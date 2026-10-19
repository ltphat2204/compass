# Plan

1. Freeze independently authored/validated subprocess tests for the public hook contract before runtime implementation. Coordinator runs tests and spec-derived positive/defective controls; independent reviewer validates assertions.
2. Add `hooks/hooks.json` (default native discovery) and a shared stdlib `hooks/compass.py` event handler, plus coordinator-facing hook reference and focused skill/install documentation integration. Keep public submission packaging skills-only and existing installers unchanged.
3. Coordinator verifies frozen inventory, runs focused hook tests and existing portability/package checks, validates native configuration where tools are available, and requests independent final review on the stable diff.

## Public runtime contract

Run `python3 hooks/compass.py` with the host JSON event on stdin and one JSON object on stdout, exit 0 for normal hook decisions. Common fields: `hook_event_name`, `cwd`; PreToolUse: `tool_name`, `tool_input`; Stop: `stop_hook_active`. Use common native JSON `hookSpecificOutput.additionalContext`, PreToolUse `permissionDecision: deny`, and Stop `decision: block` / `reason`; successful/inert responses may be `{}`. Errors are visible and never reported as valid evidence.

`python3 hooks/compass.py snapshot` from a project/subdirectory prints its current lowercase SHA256 snapshot; it does not assert a PASS or execute checks.

State is `.compass/hooks.json`, found at cwd/ancestors, stopping at the nearest `.git` boundary. Required: `version: 1`, `feature` (project-relative existing artifact directory), `status` (`active`, `blocked`, `complete`), `behavior_change` (boolean), `scope` (nonempty array of project-relative files/directories), `frozen` (relative file -> lowercase SHA256 map, may be empty before freeze/nonbehavior), `blockers` (array of strings). Optional `verification` and `review` records each use `status: PASS`, `snapshot` (current digest), `report` (relative file), `report_sha256` (current report digest). Paths stay inside project with no symlinks; do not scope the state itself. `feature/intent.md` and `feature/plan.md` automatically participate in snapshots. Source directory inventory includes additions/deletions; missing declared source files must affect the snapshot. Snapshot includes scope/frozen configuration and behavior_change so widening a scope or clearing frozen protection invalidates old evidence. Evidence/report/status updates do not themselves change the source snapshot. Reports should live outside scoped source directories to avoid self-reference.

PreToolUse supports Edit/Write/MultiEdit (`file_path`, path alias), apply_patch (raw string or `command`/`patch`/`input` string; include move destination), and structured MCP path writes where the operation is identifiable. Resolve relative tool paths against event cwd, not the state root. Parent directory operations intersect frozen child paths. Never inspect replacement test content or emit it.

## Verification and review

Tests: Python unittest subprocess fixtures, temporary projects and native JSON events; author owns `evals/test_hooks.py` and private control resources. Existing checks: `scripts/check_portability.py`, `evals/test_plugin_package.py`, relevant portability lint. Native `claude plugin validate` if installed; test hook registration and command execution with paths containing spaces independently. Native real-model dispatch is a separately reported limitation when not exercised.

Consistency: READY. Medium risk; mandatory independent test validation and fresh final compliance/quality review. No agent may approve its own authored snapshot.
