"""HC-04–06 public native role contracts; no production imports."""
import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
try:
    import tomllib
except ImportError:
    tomllib = None

REPO = Path(__file__).resolve().parents[1]
SKILLS = "analyze done engineer implement intent plan review ship tasks".split()
ROLES = ("comp-test-author", "comp-implementer", "comp-reviewer")
ROOTS = {"claude": ".claude", "codex": ".codex", "cursor": ".cursor", "copilot": ".github", "opencode": ".opencode"}
SKILL_ROOTS = dict(ROOTS, codex=".agents")
BODY = '\nPreserve this responsibility exactly.\n\nNever delegate or disclose private evidence.\nLiteral **Markdown**, `code`, "quotes", and Unicode: café.\n'


def assert_role(case, path, host, name, description, body=BODY):
    text = path.read_text()
    if host == "codex":
        if tomllib is None:
            case.skipTest("tomllib requires Python 3.11+")
        data = tomllib.loads(text)
        case.assertEqual(set(data), {"name", "description", "developer_instructions"})
        case.assertEqual(data["name"], name)
        case.assertEqual(data["description"], description)
        case.assertEqual(data["developer_instructions"], body)
        return
    lines = text.splitlines(keepends=True)
    case.assertEqual(lines[0].strip(), "---")
    end = next(i for i in range(1, len(lines)) if lines[i].strip() == "---")
    case.assertEqual("".join(lines[end + 1:]), body)
    fields, permissions = {}, {}
    in_permissions = False
    for line in lines[1:end]:
        if not line.strip():
            continue
        key, sep, value = line.strip().partition(":")
        case.assertTrue(sep)
        key, value = key.strip("\"'"), value.strip().strip("\"'")
        if line[0].isspace() and in_permissions:
            permissions[key] = value
        else:
            fields[key] = value
            in_permissions = key == "permission"
    case.assertEqual(fields["description"], description)
    if host == "claude":
        case.assertEqual(fields["name"], name)
        tools = "Read, Glob, Grep" if name == "comp-reviewer" else "Read, Glob, Grep, Edit, Write, Bash"
        case.assertEqual(fields["tools"], tools)
    else:
        case.assertEqual(fields["mode"], "subagent")
        case.assertNotIn("model", fields)
        case.assertEqual(permissions.get("*"), "deny")
        for key in ("read", "glob", "grep"):
            case.assertEqual(permissions.get(key), "allow")
        allowed = {key for key, value in permissions.items() if value == "allow"}
        if name == "comp-reviewer":
            case.assertEqual(allowed, {"read", "glob", "grep"})
        else:
            case.assertTrue({"edit", "bash"} <= allowed)
            case.assertTrue(allowed <= {"read", "glob", "grep", "edit", "write", "bash"})
        case.assertEqual(permissions.get("task"), "deny")


class HostAgentsTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name) / "source"
        self.root.mkdir()
        shutil.copytree(REPO / "scripts", self.root / "scripts")  # opaque CLI payload
        self.project = Path(self.tmp.name) / "project"
        self.project.mkdir()
        for name in SKILLS:
            folder = self.root / ".agents" / "skills" / ("comp-" + name)
            folder.mkdir(parents=True)
            (folder / "SKILL.md").write_text(f"---\nname: comp-{name}\ndescription: Skill {name}.\n---\n\nSkill body.\n")
            (folder / "resource.txt").write_text("lazy resource\n")
        self.agents = self.root / "agents"
        self.agents.mkdir()
        for name in ROLES:
            self.source_role(name).write_text(self.role_source(name))

    def source_role(self, name):
        return self.agents / (name + ".md")

    def role_source(self, name):
        tools = "Read, Glob, Grep" if name == "comp-reviewer" else "Read, Glob, Grep, Edit, Write, Bash"
        return f"---\nname: {name}\ndescription: Responsibility for {name}.\ntools: {tools}\n---\n" + BODY

    def cli(self, host, *flags, ok=True):
        result = subprocess.run([sys.executable, str(self.root / "scripts" / "install.py"), "--agent", host, "--project", str(self.project), *flags], cwd=self.root, text=True, capture_output=True)
        if ok:
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        else:
            self.assertNotEqual(result.returncode, 0, result.stdout + result.stderr)
        return result

    def installed_role(self, host, name="comp-reviewer"):
        return self.project / ROOTS[host] / "agents" / (name + (".toml" if host == "codex" else ".md"))

    def snapshot(self):
        return {str(p.relative_to(self.project)): hashlib.sha256(p.read_bytes()).hexdigest() for p in self.project.rglob("*") if p.is_file()}

    def test_five_host_discovery_and_native_role_semantics(self):
        for host, root in SKILL_ROOTS.items():
            with self.subTest(host=host):
                self.cli(host)
                for name in SKILLS:
                    skill = self.project / root / "skills" / ("comp-" + name)
                    self.assertTrue((skill / "SKILL.md").is_file())
                    self.assertEqual((skill / "resource.txt").read_text(), "lazy resource\n")
                if host in ("claude", "codex", "opencode"):
                    for name in ROLES:
                        assert_role(self, self.installed_role(host, name), host, name, f"Responsibility for {name}.")
                else:
                    self.assertFalse((self.project / ROOTS[host] / "agents").exists())
                self.cli(host, "--check")

    def test_native_role_format_contract(self):
        for host in ("claude", "codex", "opencode"):
            with self.subTest(host=host):
                self.cli(host)
                for name in ROLES:
                    assert_role(self, self.installed_role(host, name), host, name, f"Responsibility for {name}.")

    def test_dry_run_has_no_filesystem_effect(self):
        for host in ("claude", "codex", "opencode"):
            result = self.cli(host, "--dry-run")
            for name in ROLES:
                self.assertIn(self.installed_role(host, name).relative_to(self.project).as_posix(), result.stdout + result.stderr)
            self.assertEqual(self.snapshot(), {})

    def test_source_drift_update_and_owned_uninstall(self):
        for host in ("claude", "codex", "opencode"):
            with self.subTest(host=host):
                self.cli(host)
                source = self.source_role("comp-reviewer")
                original = source.read_text()
                source.write_text(original.replace("Responsibility for comp-reviewer.", "Changed description."))
                self.cli(host, "--check", ok=False)
                self.cli(host, "--update")
                assert_role(self, self.installed_role(host), host, "comp-reviewer", "Changed description.")
                self.cli(host, "--check")
                source.write_text(source.read_text() + "Additional responsibility.\n")
                self.cli(host, "--check", ok=False)
                self.cli(host, "--update")
                assert_role(self, self.installed_role(host), host, "comp-reviewer", "Changed description.", BODY + "Additional responsibility.\n")
                self.cli(host, "--check")
                self.cli(host, "--uninstall")
                for name in ROLES:
                    self.assertFalse(self.installed_role(host, name).exists())
                source.write_text(original)

    def test_customized_role_blocks_mutations_without_data_loss(self):
        for host in ("claude", "codex", "opencode"):
            with self.subTest(host=host):
                self.cli(host)
                role = self.installed_role(host)
                role.write_text(role.read_text() + "User customization.\n")
                before = self.snapshot()
                self.cli(host, "--check", ok=False)
                for flag in ("--update", "--uninstall"):
                    self.cli(host, flag, ok=False)
                    self.assertEqual(self.snapshot(), before)

    def test_unknown_metadata_and_partial_role_sources_fail(self):
        source = self.source_role("comp-test-author")
        source.write_text(self.role_source("comp-test-author").replace("tools:", "unsupported_policy: private\ntools:"))
        for host in ("claude", "codex", "opencode"):
            result = self.cli(host, ok=False)
            self.assertIn("unsupported", (result.stdout + result.stderr).lower())
            self.assertEqual(self.snapshot(), {})
        source.write_text(self.role_source("comp-test-author"))
        source.unlink()
        self.cli("opencode", ok=False)
        self.assertEqual(self.snapshot(), {})

    def test_absent_sibling_roles_preserves_legacy_skills_only(self):
        shutil.rmtree(self.agents)
        for host in ROOTS:
            self.cli(host)
            self.cli(host, "--check")
            self.assertFalse((self.project / ROOTS[host] / "agents").exists())

    def test_unowned_role_collision_is_preserved(self):
        role = self.installed_role("opencode")
        role.parent.mkdir(parents=True)
        role.write_text("User owned role\n")
        before = self.snapshot()
        self.cli("opencode", ok=False)
        self.assertEqual(self.snapshot(), before)

    def test_manifest_cannot_claim_unrelated_role(self):
        self.cli("opencode")
        outsider = self.project / ".opencode" / "agents" / "user-owned.md"
        outsider.write_text("User owned role\n")
        manifest = self.project / ".compass" / "install-opencode.json"
        data = json.loads(manifest.read_text())
        claimed = ".opencode/agents/user-owned.md"
        data["files"][claimed] = hashlib.sha256(outsider.read_bytes()).hexdigest()
        manifest.write_text(json.dumps(data))
        before = self.snapshot()
        for flag in ("--update", "--uninstall"):
            self.cli("opencode", flag, ok=False)
            self.assertEqual(self.snapshot(), before)


if __name__ == "__main__":
    unittest.main()
