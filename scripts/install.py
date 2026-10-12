#!/usr/bin/env python3
"""Copy Compass skills into an explicitly selected project, without overwrites."""

import argparse
from pathlib import Path
import shutil
import sys


HOST_PATHS = {
    "codex": ".agents/skills",
    "claude": ".claude/skills",
    "cursor": ".cursor/skills",
    "copilot": ".github/skills",
}
SKILL_NAMES = tuple("comp-" + name for name in (
    "analyze", "done", "engineer", "implement", "intent", "plan", "review", "ship", "tasks"
))


def install(agent, project, source):
    project = project.expanduser().resolve(strict=True)
    if not project.is_dir():
        raise ValueError("Project must be an existing directory")
    destination = project / HOST_PATHS[agent]
    skills = [source / name for name in SKILL_NAMES]
    for skill in skills:
        if not (skill / "SKILL.md").is_file():
            raise ValueError(f"Missing source skill: {skill}")
        target = destination / skill.name
        if target.exists() or target.is_symlink():
            raise FileExistsError(f"Skill already exists: {target}")
    # Refuse redirected project folders so installation cannot escape its scope.
    if not destination.resolve().is_relative_to(project):
        raise ValueError("Skill destination resolves outside the selected project")
    destination.mkdir(parents=True, exist_ok=True)
    created = []
    try:
        for skill in skills:
            target = destination / skill.name
            target.mkdir()  # Claim ownership without overwriting a concurrent install.
            created.append(target)
            shutil.copytree(skill, target, dirs_exist_ok=True)
    except Exception:
        for target in reversed(created):
            shutil.rmtree(target)
        raise
    return destination


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--agent", choices=HOST_PATHS, required=True)
    parser.add_argument("--project", type=Path, required=True,
                        help="Existing project directory; no global installation")
    args = parser.parse_args()
    source = Path(__file__).resolve().parents[1] / ".agents/skills"
    try:
        destination = install(args.agent, args.project, source)
    except (OSError, ValueError) as error:
        print(f"Installation stopped: {error}", file=sys.stderr)
        return 1
    print(f"Installed {len(SKILL_NAMES)} Compass skills into {destination}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
