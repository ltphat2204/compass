"""Render canonical Compass responsibilities into project-local native roles."""

import json
from pathlib import Path


ROLES = ("comp-test-author", "comp-implementer", "comp-reviewer")
ROLE_TOOLS = {
    "comp-test-author": {"Read", "Glob", "Grep", "Edit", "Write", "Bash"},
    "comp-implementer": {"Read", "Glob", "Grep", "Edit", "Write", "Bash"},
    "comp-reviewer": {"Read", "Glob", "Grep"},
}


def native_paths(target: str) -> tuple[str, ...]:
    """Fixed ownership allowlist, independent of available role sources."""
    if target not in {"claude", "codex", "opencode"}:
        return ()
    suffix = "toml" if target == "codex" else "md"
    return tuple(f".{target}/agents/{name}.{suffix}" for name in ROLES)


def _read_role(path: Path, name: str) -> tuple[bytes, str, str]:
    if path.is_symlink() or not path.is_file():
        raise ValueError(f"Invalid role source: {path}")
    raw = path.read_bytes()
    lines = raw.decode("utf-8").splitlines(keepends=True)
    if not lines or lines[0].rstrip("\r\n") != "---":
        raise ValueError(f"Missing role metadata: {path}")
    metadata = {}
    for index, line in enumerate(lines[1:], 1):
        if line.rstrip("\r\n") == "---":
            body = "".join(lines[index + 1 :])
            break
        key, separator, value = line.rstrip("\r\n").partition(":")
        if not separator or key not in {"name", "description", "tools"}:
            raise ValueError(f"Unsupported role metadata in {path}: {key}")
        if key in metadata:
            raise ValueError(f"Duplicate role metadata in {path}: {key}")
        metadata[key] = value.strip()
    else:
        raise ValueError(f"Unclosed role metadata: {path}")
    if set(metadata) != {"name", "description", "tools"}:
        raise ValueError(f"Incomplete role metadata: {path}")
    if metadata["name"] != name or not metadata["description"] or not body.strip():
        raise ValueError(f"Invalid role name, description or body: {path}")
    tools = [tool.strip() for tool in metadata["tools"].split(",")]
    if len(tools) != len(set(tools)) or set(tools) != ROLE_TOOLS[name]:
        raise ValueError(f"Unsupported role tools: {path}")
    return raw, metadata["description"], body


def render_agents(source: Path, target: str) -> dict[str, bytes]:
    """Return relative native-role paths and bytes for a canonical skills root."""
    if target not in {"claude", "codex", "opencode", "cursor", "copilot", "pi"}:
        raise ValueError(f"Unknown host target: {target}")
    agents = Path(source).parent.parent / "agents"
    if agents.is_symlink():
        raise ValueError(f"Invalid role source directory: {agents}")
    if not agents.exists():
        return {}
    if not agents.is_dir() or {p.name for p in agents.glob("comp-*")} != {
        f"{name}.md" for name in ROLES
    }:
        raise ValueError(f"Incomplete or unsupported role sources: {agents}")
    roles = {name: _read_role(agents / f"{name}.md", name) for name in ROLES}
    rendered = {}
    for name, (raw, description, body) in roles.items():
        if target == "claude":
            rendered[f".claude/agents/{name}.md"] = raw
        elif target == "codex":
            text = (
                f"name = {json.dumps(name, ensure_ascii=False)}\n"
                f"description = {json.dumps(description, ensure_ascii=False)}\n"
                f"developer_instructions = {json.dumps(body, ensure_ascii=False)}\n"
            )
            rendered[f".codex/agents/{name}.toml"] = text.encode("utf-8")
        elif target == "opencode":
            permissions = '  "*": deny\n  read: allow\n  glob: allow\n  grep: allow\n'
            if name != "comp-reviewer":
                permissions += "  edit: allow\n  bash: allow\n"
            text = (
                f"---\ndescription: {json.dumps(description, ensure_ascii=False)}\n"
                f"mode: subagent\npermission:\n{permissions}  task: deny\n---\n{body}"
            )
            rendered[f".opencode/agents/{name}.md"] = text.encode("utf-8")
    return rendered
