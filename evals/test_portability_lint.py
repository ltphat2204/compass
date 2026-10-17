"""Portable package validation through the public CLI."""
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

REPO = Path(__file__).resolve().parents[1]
LINTER = Path(os.environ.get("COMPASS_LINTER", REPO / "scripts/check_portability.py"))
NAMES = tuple("comp-" + n for n in "analyze done engineer implement intent plan review ship tasks".split())

# Each rule is exercised by the same exit-status/diagnostic assertion.
RULES = {
    "name": ("---\nname: wrong\ndescription: Test.\n---\nBody", False),
    "description": ("---\nname: comp-analyze\n---\nBody", False),
    "local-link": ("[missing](missing.md)", False),
    "sibling-resource": ("[missing](../comp-plan/missing.md)", False),
    "personal-path": ("Run `/Users/alice/private/run.sh`.", False),
    "claude-argument": ("```sh\necho $ARGUMENTS\n```", False),
    "claude-skill-dir": ("```bash\ncat ${CLAUDE_SKILL_DIR}/notes.md\n```", False),
    "ordinary-shell": ("```zsh\necho \"$1\"\n```", True),
    "external-fragment": ("[web](https://example.com/a) [section](#test)", True),
    "host-example": ("<!-- compass:host claude -->\n```sh\necho $ARGUMENTS\n```", True),
    "host-marker-single-block": ("<!-- compass:host claude -->\n```sh\necho $ARGUMENTS\n```\n```sh\necho $ARGUMENTS\n```", False),
    "host-marker-no-path-exemption": ("<!-- compass:host claude -->\n```sh\ncat /Users/alice/private/file\n```", False),
}


def assert_lint_result(case, result, valid, filename="SKILL.md"):
    output = result.stdout + result.stderr
    case.assertEqual(result.returncode == 0, valid, output)
    if not valid:
        case.assertIn(filename, output, "diagnostic must identify offending file")
        case.assertTrue(output.strip())


class PortabilityLintContract(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.skills = self.root / ".agents/skills"
        for name in NAMES:
            folder = self.skills / name
            folder.mkdir(parents=True)
            (folder / "SKILL.md").write_text(self.document(name, "[resource](notes.md) [sibling](../comp-plan/SKILL.md)"))
            (folder / "notes.md").write_text("# Notes\n")
        self.target = self.skills / "comp-analyze/SKILL.md"

    @staticmethod
    def document(name, body):
        return f"---\nname: {name}\ndescription: Portable fixture.\n---\n# Test\n{body}\n"

    def run_lint(self, valid, root=None, filename="SKILL.md"):
        before = {p.relative_to(self.root).as_posix(): p.read_bytes() for p in self.root.rglob("*") if p.is_file()}
        result = subprocess.run([sys.executable, str(LINTER), "--root", str(root or self.skills)], capture_output=True, text=True, env={**os.environ, "PYTHONDONTWRITEBYTECODE": "1"})
        assert_lint_result(self, result, valid, filename)
        after = {p.relative_to(self.root).as_posix(): p.read_bytes() for p in self.root.rglob("*") if p.is_file()}
        self.assertEqual(before, after, "lint must not write")

    def test_valid_direct_and_repository_roots(self):
        self.run_lint(True)
        self.run_lint(True, self.root)

    def test_rule_table(self):
        for rule, (body, valid) in RULES.items():
            with self.subTest(rule=rule):
                self.target.write_text(body if body.startswith("---") else self.document("comp-analyze", body))
                self.run_lint(valid)

    def test_missing_name_is_rejected(self):
        self.target.write_text("---\ndescription: Portable fixture.\n---\nBody\n")
        self.run_lint(False)

    def test_host_markers_supported_and_unknown(self):
        for host in ("codex", "claude", "cursor", "copilot", "unknown-host"):
            with self.subTest(host=host):
                self.target.write_text(self.document("comp-analyze", f"<!-- compass:host {host} -->\n```sh\necho $ARGUMENTS\n```"))
                self.run_lint(host != "unknown-host")

    def test_host_execution_metadata(self):
        for key in ("allowed-tools", "model", "context", "agent", "hooks"):
            with self.subTest(key=key):
                self.target.write_text(f"---\nname: comp-analyze\ndescription: Test.\n{key}: test\n---\nBody\n")
                self.run_lint(False)

    def test_optional_portable_metadata(self):
        self.target.write_text("---\nname: comp-analyze\ndescription: Test.\nlicense: MIT\nmetadata:\n  author: Example\n---\nBody\n")
        self.run_lint(True)

    def test_missing_skill_and_resource_nested_links(self):
        (self.skills / "comp-tasks/SKILL.md").unlink()
        self.run_lint(False)
        (self.skills / "comp-tasks/SKILL.md").write_text(self.document("comp-tasks", "Body"))
        (self.skills / "comp-analyze/notes.md").write_text("[broken](lost.md)\n")
        self.run_lint(False, filename="notes.md")

    def test_installed_host_roots(self):
        for host_path in (".claude/skills", ".cursor/skills", ".github/skills"):
            import shutil
            destination = self.root / host_path
            shutil.copytree(self.skills, destination)
            self.run_lint(True, destination)


if __name__ == "__main__":
    unittest.main()
