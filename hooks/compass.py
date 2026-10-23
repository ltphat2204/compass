"""Read-only Compass lifecycle checks. Python 3.9+, standard library only."""
import hashlib
import json
import os
from pathlib import Path
import re
import sys


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def project(cwd):
    current = Path(cwd).absolute()
    for directory in (current, *current.parents):
        state = directory / '.compass/hooks.json'
        if state.exists() or state.is_symlink():
            return directory, state
        if (directory / '.git').exists():
            break
    return None, None


def checked(root, value):
    if not isinstance(value, str) or not value or Path(value).is_absolute():
        raise ValueError('paths must be nonempty project-relative strings')
    candidate = root / value
    # Check lexical components as well as the normalized destination.
    for component in (candidate, *candidate.parents):
        if component.is_symlink():
            raise ValueError('symlink path is unsupported: ' + value)
        if component == root:
            break
    normalized = Path(os.path.abspath(candidate))
    if normalized != root and root not in normalized.parents:
        raise ValueError('path escapes project: ' + value)
    return normalized


def intersects(a, b):
    return a == b or a in b.parents or b in a.parents


def load(root, state_path):
    checked(root, '.compass/hooks.json')
    state = json.loads(state_path.read_text())
    if not isinstance(state, dict) or type(state.get('version')) is not int or state['version'] != 1:
        raise ValueError('version must be 1')
    if state.get('status') not in ('active', 'blocked', 'complete'):
        raise ValueError('status must be active, blocked, or complete')
    if type(state.get('behavior_change')) is not bool:
        raise ValueError('behavior_change must be a boolean')
    feature = checked(root, state.get('feature'))
    if not feature.is_dir():
        raise ValueError('feature must identify an existing artifact directory')
    scope = state.get('scope')
    if not isinstance(scope, list) or not scope:
        raise ValueError('scope must be a nonempty array')
    for value in scope:
        path = checked(root, value)
        if intersects(path, state_path):
            raise ValueError('scope must exclude .compass/hooks.json and its ancestors')
    frozen = state.get('frozen')
    if not isinstance(frozen, dict):
        raise ValueError('frozen must map relative file paths to SHA256 hashes')
    for value, sha in frozen.items():
        path = checked(root, value)
        if path.is_dir() or not isinstance(sha, str) or not re.fullmatch('[0-9a-f]{64}', sha):
            raise ValueError('frozen requires file paths and lowercase SHA256 hashes')
    if not isinstance(state.get('blockers'), list) or any(not isinstance(x, str) for x in state['blockers']):
        raise ValueError('blockers must be an array of strings')
    for name in ('verification', 'review'):
        record = state.get(name)
        if record is not None:
            if not isinstance(record, dict):
                raise ValueError(name + ' must be an evidence object')
            checked(root, record.get('report'))
    return state


def snapshot(root, state):
    inventory = {}
    paths = state['scope'] + list(state['frozen']) + [state['feature'] + '/intent.md', state['feature'] + '/plan.md']
    for value in paths:
        path = checked(root, value)
        members = sorted(path.rglob('*')) if path.is_dir() else [path]
        for member in members:
            checked(root, str(member.relative_to(root)))
            if member.is_dir():
                continue
            inventory[str(member.relative_to(root))] = digest(member) if member.is_file() else None
    payload = {'files': inventory, 'scope': state['scope'], 'frozen': state['frozen'], 'behavior_change': state['behavior_change']}
    return hashlib.sha256(json.dumps(payload, sort_keys=True, separators=(',', ':')).encode()).hexdigest()


def problems(root, state, current):
    issues = []
    for name in ('intent.md', 'plan.md'):
        value = state['feature'] + '/' + name
        if not checked(root, value).is_file():
            issues.append('missing required input: ' + value + '; restore it before completion')
    for value, expected in state['frozen'].items():
        path = checked(root, value)
        if not path.is_file() or digest(path) != expected:
            issues.append('frozen resource drift: ' + value + '; restore the frozen revision or refreeze and rerun verification/review')
    if state['behavior_change'] and not state['frozen']:
        issues.append('behavior changes require a nonempty frozen suite; freeze the full suite revision before completion')
    for name in ('verification', 'review'):
        record = state.get(name) or {}
        report = checked(root, record['report']) if 'report' in record else None
        if (record.get('status') != 'PASS' or record.get('snapshot') != current or
                report is None or not report.is_file() or record.get('report_sha256') != digest(report)):
            issues.append(name + ' evidence is STALE or missing; rerun it and record PASS, the current snapshot, report, and report_sha256')
    if state['blockers']:
        issues.append('unresolved blockers: ' + '; '.join(state['blockers']) + '; resolve them before completion')
    return issues


def targets(event, root):
    name = event.get('tool_name', '')
    data = event.get('tool_input', {})
    paths = []
    if name.lower() == 'apply_patch' or name.lower().endswith('__apply_patch'):
        patch = data if isinstance(data, str) else next((data[k] for k in ('command', 'patch', 'input') if isinstance(data.get(k), str)), '')
        paths.extend(re.findall(r'^\*\*\* (?:Add File|Update File|Delete File|Move to): (.+)$', patch, re.M))
    elif isinstance(data, dict):
        operation = str(data.get('operation', data.get('action', name))).lower()
        if name in ('Edit', 'Write', 'MultiEdit') or (name.startswith('mcp') and any(word in operation for word in ('write', 'edit', 'delete', 'remove', 'move', 'rename', 'patch', 'create'))):
            paths.extend(data[key] for key in ('file_path', 'filePath', 'path', 'file', 'source', 'destination', 'source_path', 'destination_path', 'old_path', 'new_path') if isinstance(data.get(key), str))
    cwd = Path(event.get('cwd', str(root)))
    return [Path(os.path.abspath(cwd / path)) for path in paths]


def context(event, message):
    return {'hookSpecificOutput': {'hookEventName': event, 'additionalContext': message}}


def main(event):
    cli = sys.argv[1:] == ['snapshot']
    name = event.get('hook_event_name', '')
    if name == 'UserPromptSubmit':
        return context(name, 'Compass: for a new engineering request or brainstorm, use comp-engineer to clarify intent and choose the next useful step. Resume existing feature work. Simple explanations/status questions need no workflow. Exploration does not authorize implementation; do not automatically execute every stage. Before implementation, present current intent and plan, then stop for user approval of both. The only exception is a pre-existing, host-confirmed active automation goal covering this work; do not create a Codex Goal for an ordinary request or to bypass approval. Preserve valid approval on resume; material revisions require renewed approval. Before claiming DONE, the coordinator must set active hook state status to complete so Stop can check evidence.')
    root, state_path = project(event.get('cwd', os.getcwd()))
    if root is None:
        if cli:
            raise ValueError('no active .compass/hooks.json found inside the repository boundary')
        return {}
    state = load(root, state_path)
    current = snapshot(root, state)
    if cli:
        print(current)
        return None
    if name == 'PreToolUse':
        frozen = [checked(root, value) for value in state['frozen']]
        for target in targets(event, root):
            # Resolve aliases, including symlinked tool paths, without reading content.
            aliases = (target, target.resolve())
            if any(intersects(alias, path) for alias in aliases for path in frozen):
                return {'hookSpecificOutput': {'hookEventName': name, 'permissionDecision': 'deny', 'permissionDecisionReason': 'Compass: target touches a frozen resource. Preserve the full frozen suite revision; ask the coordinator to refreeze explicitly if requirements change.'}}
        return {}
    if name in ('PostToolUse', 'Stop'):
        issues = problems(root, state, current)
        if name == 'Stop' and state['status'] == 'complete' and issues:
            reason = 'Compass completion gate: ' + '; '.join(issues)
            if not event.get('stop_hook_active'):
                return {'decision': 'block', 'reason': reason}
            return context(name, reason + '. Continuation already active; completion remains unverified. Pause or mark blocked until resolved; do not claim DONE.')
        if name == 'PostToolUse' and issues:
            return context(name, 'Compass: ' + '; '.join(issues))
    return {}


if __name__ == '__main__':
    event = {}
    try:
        if sys.argv[1:] != ['snapshot']:
            event = json.load(sys.stdin)
        result = main(event)
        if result is not None:
            print(json.dumps(result))
    except (ValueError, OSError, TypeError, KeyError) as error:
        message = 'Compass hooks configuration/error: ' + str(error) + '. Correct .compass/hooks.json paths/schema or restore missing resources; evidence is not validated.'
        if sys.argv[1:] == ['snapshot']:
            print(message, file=sys.stderr)
            sys.exit(1)
        output = {'systemMessage': message}
        if isinstance(event, dict) and event.get('hook_event_name') == 'Stop':
            status = None
            try:
                _, state_path = project(event.get('cwd', os.getcwd()))
                if state_path is not None:
                    raw = json.loads(state_path.read_text())
                    status = raw.get('status') if isinstance(raw, dict) else None
            except (ValueError, OSError, TypeError):
                pass
            if status not in ('active', 'blocked'):
                if event.get('stop_hook_active'):
                    output = context('Stop', message + ' Continuation already active; pause or mark blocked and correct the state before claiming DONE.')
                else:
                    output = {'decision': 'block', 'reason': message}
        print(json.dumps(output))
