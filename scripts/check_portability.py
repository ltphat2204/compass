#!/usr/bin/env python3
"""Validate portable Compass skill packages without changing them."""
import argparse
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit

HOST_PATHS = {"codex": ".agents/skills", "claude": ".claude/skills",
              "cursor": ".cursor/skills", "copilot": ".github/skills",
              "opencode": ".opencode/skills"}
SKILL_NAMES = tuple("comp-" + name for name in (
    "analyze", "done", "engineer", "implement", "intent", "plan", "review", "ship", "tasks"))


def skill_root(root):
    root = Path(root)
    if any((root / name).exists() for name in SKILL_NAMES):
        return root
    for relative in HOST_PATHS.values():
        if (root / relative).is_dir():
            return root / relative
    return root


def validate(root):
    root = skill_root(root)
    errors = []
    def report(path, message):
        errors.append(f"{path}: {message}")
    for name in SKILL_NAMES:
        skill = root / name
        entry = skill / "SKILL.md"
        if not entry.is_file():
            report(entry, "missing required skill")
            continue
        text = entry.read_text(encoding="utf-8")
        front = re.match(r"\A---\s*\n(.*?)\n---(?:\n|$)", text, re.S)
        fields = {}
        if not front:
            report(entry, "missing frontmatter")
        else:
            for line in front.group(1).splitlines():
                match = re.match(r"^([^\s:#]+):\s*(.*)$", line)
                if match:
                    key, value = match.groups()
                    if key in fields:
                        report(entry, f"duplicate frontmatter key {key}")
                    fields[key] = value.strip().strip("\"'")
                    if key not in {"name", "description", "license", "metadata"}:
                        report(entry, f"unsupported frontmatter key {key}")
            if fields.get("name") != name:
                report(entry, "name must match skill directory")
            if not fields.get("description"):
                report(entry, "missing description")
        for path in sorted(skill.rglob("*")):
            if path.is_symlink():
                report(path, "symlink is not a portable resource")
                continue
            if not path.is_file() or path.suffix.lower() != ".md":
                continue
            body = path.read_text(encoding="utf-8")
            for match in re.finditer(r"!?\[[^\]]*\]\(\s*(<[^>]+>|[^\s)]+)(?:[^)]*)\)|^\s*\[[^\]]+\]:\s*(<[^>]+>|\S+)", body, re.M):
                link = (match.group(1) or match.group(2)).strip("<>")
                parsed = urlsplit(link)
                if parsed.scheme or parsed.netloc or not parsed.path:
                    continue
                target = path.parent / unquote(parsed.path)
                if not target.exists():
                    report(path, f"missing local resource {link}")
            fence = None
            host_marker = None
            for line in body.splitlines():
                marker = re.fullmatch(r"\s*<!-- compass:host ([a-z]+) -->\s*", line)
                opening = re.match(r"^\s*(`{3,}|~{3,})\s*([^\s]*)", line)
                if fence:
                    if re.match(r"^\s*" + re.escape(fence[0]) + r"\s*$", line):
                        fence = None
                        continue
                    if re.search(r"/(?:Users|home)/[^/\s]+", line):
                        report(path, "personal absolute path in executable instructions")
                    if fence[1] in {"sh", "bash", "zsh", "shell"}:
                        if not fence[2] and re.search(r"\$ARGUMENTS\b|\$\{ARGUMENTS[^}]*\}|\$CLAUDE[A-Z_]*\b|\$\{CLAUDE[^}]*\}|\$\{?CLAUDE_SKILL_DIR\}?|\$\{?CLAUDE_SESSION_ID\}?", line):
                            report(path, "Claude-only substitution in portable shell block")
                elif opening:
                    fence = (opening.group(1), opening.group(2).lower(), host_marker in HOST_PATHS)
                    host_marker = None
                else:
                    host_marker = marker.group(1) if marker else None
                    if re.search(r"/(?:Users|home)/[^/\s]+", line):
                        report(path, "personal absolute path in instructions")
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    try:
        errors = validate(args.root)
    except (OSError, UnicodeError, ValueError) as error:
        errors = [str(error)]
    for error in errors:
        print(error, file=sys.stderr)
    if not errors:
        print("Compass portability check passed")
    return int(bool(errors))


if __name__ == "__main__":
    sys.exit(main())
