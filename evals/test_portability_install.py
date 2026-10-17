"""Contract tests for project-local Compass ownership and lifecycle."""
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

REPO = Path(__file__).resolve().parents[1]
INSTALLER = Path(os.environ.get("COMPASS_INSTALLER", REPO / "scripts/install.py"))
NAMES = tuple("comp-" + n for n in "analyze done engineer implement intent plan review ship tasks".split())
HOSTS = {"codex": ".agents/skills", "claude": ".claude/skills", "cursor": ".cursor/skills", "copilot": ".github/skills"}


def snapshot(root):
    return {str(p.relative_to(root)): ("link", os.readlink(p)) if p.is_symlink() else ("dir",) if p.is_dir() else ("file", p.read_bytes()) for p in root.rglob("*")}


def assert_unchanged(case, before, root):
    case.assertEqual(before, snapshot(root), "operation changed project before successful preflight")


class InstallContract(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve()
        self.repo = self.root / "source"
        self.source = self.repo / ".agents/skills"
        for name in NAMES:
            skill = self.source / name
            skill.mkdir(parents=True)
            (skill / "SKILL.md").write_text(f"---\nname: {name}\ndescription: Portable test skill.\n---\n# Test\nSee [resource](resource.md).\n")
            (skill / "resource.md").write_text("Resource.\n")
        scripts = self.repo / "scripts"
        scripts.mkdir()
        shutil.copytree(INSTALLER.parent, scripts, dirs_exist_ok=True)
        lint = INSTALLER.with_name("check_portability.py")
        if lint.exists():
            shutil.copyfile(lint, scripts / lint.name)
        self.script = scripts / "install.py"
        self.project = self.root / "project"
        self.project.mkdir()
        (self.project / "README.md").write_text("User data\n")

    def cli(self, *args, host="codex", ok=True):
        result = subprocess.run([sys.executable, str(self.script), "--agent", host, "--project", str(self.project), *args], capture_output=True, text=True, env={**os.environ, "PYTHONDONTWRITEBYTECODE": "1"})
        self.assertEqual(result.returncode == 0, ok, result.stdout + result.stderr)
        if not ok:
            self.assertTrue((result.stdout + result.stderr).strip(), "failure must diagnose the problem")
        return result.stdout + result.stderr

    def installed(self, name="comp-analyze", file="SKILL.md", host="codex"):
        return self.project / HOSTS[host] / name / file

    def manifest(self, host="codex"):
        return self.project / ".compass" / f"install-{host}.json"

    def test_preview_and_collision_write_nothing(self):
        before = snapshot(self.project)
        output = self.cli("--dry-run")
        assert_unchanged(self, before, self.project)
        for name in NAMES:
            self.assertIn(str(self.project / HOSTS["codex"] / name), output)
        self.installed().parent.mkdir(parents=True)
        before = snapshot(self.project)
        self.cli("--dry-run", ok=False)
        assert_unchanged(self, before, self.project)

    def test_four_hosts_api_and_manifest_hashes(self):
        spec = importlib.util.spec_from_file_location("compass_installer_contract", INSTALLER)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        for host, target in HOSTS.items():
            with self.subTest(host=host):
                destination = module.install(host, self.project, self.source)
                self.assertEqual(Path(destination), self.project / target)
                data = json.loads(self.manifest(host).read_text())
                self.assertEqual(data["schema_version"], 1)
                self.assertEqual(data["host"], host)
                self.assertIsNone(data["source_revision"], "non-Git source records null revision")
                expected = {}
                for path in (self.project / target).rglob("*"):
                    if path.is_file():
                        expected[path.relative_to(self.project).as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()
                self.assertEqual(data["files"], expected)

    def test_revision_records_git_head_with_dirty_source(self):
        def git(*args):
            result = subprocess.run(["git", "-C", str(self.repo), *args], capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            return result.stdout.strip()
        git("init", "--quiet")
        git("add", ".agents")
        git("-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "-c", "commit.gpgsign=false", "commit", "--quiet", "-m", "Fixture")
        revision = git("rev-parse", "HEAD")
        (self.source / "comp-analyze/resource.md").write_text("Uncommitted source bytes")
        self.cli()
        data = json.loads(self.manifest().read_text())
        self.assertEqual(data["source_revision"], revision)
        self.assertIn(hashlib.sha256(b"Uncommitted source bytes").hexdigest(), json.dumps(data))
        self.cli("--check")

    def test_healthy_check_and_complete_lifecycle(self):
        self.cli()
        before = snapshot(self.project)
        self.cli("--check")
        assert_unchanged(self, before, self.project)
        old = self.source / "comp-analyze/resource.md"
        old.unlink()
        (self.source / "comp-analyze/SKILL.md").write_text("---\nname: comp-analyze\ndescription: Updated.\n---\nUpdated.\n")
        (self.source / "comp-analyze/new.md").write_text("New\n")
        extra = self.installed(file="personal.txt")
        extra.write_text("Keep\n")
        before = snapshot(self.project)
        self.cli("--check", ok=False)
        preview = self.cli("--update", "--dry-run")
        for file in ("SKILL.md", "new.md", "resource.md"):
            self.assertIn(str(self.installed(file=file)), preview)
        assert_unchanged(self, before, self.project)
        self.cli("--update")
        self.assertFalse(self.installed(file="resource.md").exists())
        self.assertEqual(self.installed(file="new.md").read_text(), "New\n")
        self.assertEqual(self.installed().read_bytes(), (self.source / "comp-analyze/SKILL.md").read_bytes())
        data = json.loads(self.manifest().read_text())
        encoded = json.dumps(data)
        self.assertIn(hashlib.sha256(self.installed().read_bytes()).hexdigest(), encoded)
        self.assertIn(hashlib.sha256(b"New\n").hexdigest(), encoded)
        self.assertNotIn(self.installed(file="resource.md").relative_to(self.project).as_posix(), encoded)
        self.cli("--check")
        before = snapshot(self.project)
        owned = json.loads(self.manifest().read_text())["files"]
        preview = self.cli("--uninstall", "--dry-run")
        for relative in owned:
            self.assertIn(str(self.project / relative), preview)
        assert_unchanged(self, before, self.project)
        self.cli("--uninstall")
        self.assertFalse(self.manifest().exists())
        self.assertFalse(self.installed().exists())
        self.assertEqual(extra.read_text(), "Keep\n")
        self.assertEqual((self.project / "README.md").read_text(), "User data\n")

    def test_modified_missing_and_symlink_payload_block_atomically(self):
        self.cli()
        path = self.installed("comp-tasks")
        original = path.read_bytes()
        for defect in ("modified", "missing", "symlink"):
            with self.subTest(defect=defect):
                if path.exists() or path.is_symlink():
                    path.unlink()
                if defect == "modified":
                    path.write_text("User customization")
                elif defect == "symlink":
                    path.symlink_to(self.project / "README.md")
                before = snapshot(self.project)
                for operation in ("--check", "--update", "--uninstall"):
                    self.cli(operation, ok=False)
                    assert_unchanged(self, before, self.project)
                    if operation != "--check":
                        self.cli(operation, "--dry-run", ok=False)
                        assert_unchanged(self, before, self.project)
                if path.is_symlink():
                    path.unlink()
                path.write_bytes(original)

    def test_invalid_manifest_and_conflicting_new_file_block_atomically(self):
        self.cli()
        manifest = self.manifest()
        original = manifest.read_bytes()
        # Replace any tracked project-relative payload key, without relying on map field naming.
        text = original.decode()
        tracked = self.installed().relative_to(self.project).as_posix()
        self.assertIn(tracked, text)
        for malicious in ("README.md", "../escape.md", "/tmp/escape.md", ".claude/skills/comp-analyze/SKILL.md", ".agents/skills/comp-analyze/../comp-plan/SKILL.md"):
            with self.subTest(path=malicious):
                manifest.write_text(text.replace(tracked, malicious))
                before = snapshot(self.project)
                for op in ("--check", "--update", "--uninstall"):
                    self.cli(op, ok=False)
                    assert_unchanged(self, before, self.project)
        manifest.write_bytes(original)

    def test_conflicting_new_file_blocks_update_atomically(self):
        self.cli()
        (self.source / "comp-analyze/new.md").write_text("Upstream")
        self.installed(file="new.md").write_text("User")
        before = snapshot(self.project)
        self.cli("--update", ok=False)
        assert_unchanged(self, before, self.project)

    def test_invalid_metadata_and_redirected_manifest_block(self):
        self.cli()
        manifest = self.manifest()
        original = manifest.read_bytes()
        for invalid in ("{}", "[]", "not json", original.decode().replace("codex", "claude")):
            manifest.write_text(invalid)
            before = snapshot(self.project)
            for op in ("--check", "--update", "--uninstall"):
                self.cli(op, ok=False)
                assert_unchanged(self, before, self.project)
        manifest.write_bytes(original)
        real = self.root / "ownership.json"
        manifest.rename(real)
        manifest.symlink_to(real)
        before = snapshot(self.project)
        for op in ("--check", "--update", "--uninstall"):
            self.cli(op, ok=False)
            assert_unchanged(self, before, self.project)
        self.assertEqual(real.read_bytes(), original)

    def test_check_rejects_broken_installed_link_without_writes(self):
        self.cli()
        # Align payload hashes and source bytes so only local-link validation can fail.
        target = self.installed()
        target.write_text(target.read_text() + "\n[missing](nonexistent.md)\n")
        (self.source / "comp-analyze/SKILL.md").write_bytes(target.read_bytes())
        relative = target.relative_to(self.project).as_posix()
        data = json.loads(self.manifest().read_text())
        def refresh(value):
            if isinstance(value, dict):
                for key, nested in value.items():
                    if key == relative:
                        value[key] = hashlib.sha256(target.read_bytes()).hexdigest()
                    else:
                        refresh(nested)
        refresh(data)
        self.manifest().write_text(json.dumps(data))
        before = snapshot(self.project)
        self.cli("--check", ok=False)
        assert_unchanged(self, before, self.project)

    def test_redirected_payload_parent_blocks_operations(self):
        self.cli()
        original = self.installed().parent
        outside = self.root / "redirected-skill"
        original.rename(outside)
        original.symlink_to(outside, target_is_directory=True)
        before = snapshot(self.project)
        outside_before = snapshot(outside)
        for op in ("--check", "--update", "--uninstall"):
            self.cli(op, ok=False)
            assert_unchanged(self, before, self.project)
            assert_unchanged(self, outside_before, outside)

    def test_hash_schema_and_duplicate_ownership_are_untrusted(self):
        import re
        self.cli()
        manifest = self.manifest()
        text = manifest.read_text()
        data = json.loads(text)
        schema_keys = [key for key in data if "schema" in key]
        self.assertTrue(schema_keys)
        invalid_schema = dict(data)
        invalid_schema[schema_keys[0]] = 999999
        bad_hash = re.sub(r'"[a-fA-F0-9]{64}"', '"invalid-hash"', text, count=1)
        self.assertNotEqual(text, bad_hash)
        tracked = self.installed().relative_to(self.project).as_posix()
        duplicate = re.sub(r'("' + re.escape(tracked) + r'"\s*:\s*"[a-fA-F0-9]{64}")', r'\1, \1', text, count=1)
        self.assertNotEqual(text, duplicate, "payload hashes must be keyed by relative payload paths")
        invalid_revision = dict(data)
        invalid_revision["source_revision"] = ["not a revision"]
        for malformed in (json.dumps(invalid_schema), json.dumps(invalid_revision), bad_hash, duplicate):
            manifest.write_text(malformed)
            before = snapshot(self.project)
            for op in ("--check", "--update", "--uninstall"):
                self.cli(op, ok=False)
                assert_unchanged(self, before, self.project)

    def test_redirected_ownership_directory_blocks_without_writes(self):
        self.cli()
        ownership = self.project / ".compass"
        outside = self.root / "ownership"
        ownership.rename(outside)
        ownership.symlink_to(outside, target_is_directory=True)
        before = snapshot(self.project)
        outside_before = snapshot(outside)
        for op in ("--check", "--update", "--uninstall"):
            self.cli(op, ok=False)
            assert_unchanged(self, before, self.project)
            assert_unchanged(self, outside_before, outside)

    def test_invalid_upstream_link_blocks_update_without_writes(self):
        self.cli()
        path = self.source / "comp-tasks/SKILL.md"
        path.write_text(path.read_text() + "\n[missing](nonexistent.md)\n")
        before = snapshot(self.project)
        self.cli("--update", ok=False)
        assert_unchanged(self, before, self.project)

    def test_existing_project_is_required(self):
        self.project = self.root / "absent-project"
        self.cli("--dry-run", ok=False)
        self.assertFalse(self.project.exists())

    def test_missing_manifest_never_adopts_existing_payload(self):
        self.cli()
        self.manifest().unlink()
        before = snapshot(self.project)
        for args in ((), ("--check",), ("--update",), ("--uninstall",), ("--update", "--dry-run"), ("--uninstall", "--dry-run")):
            self.cli(*args, ok=False)
            assert_unchanged(self, before, self.project)

    def test_operation_flags_are_mutually_exclusive_on_healthy_install(self):
        self.cli()
        before = snapshot(self.project)
        for operation in ("--check", "--update", "--uninstall"):
            # Preview proves each mutating operation independently passes preflight.
            self.cli(*((operation,) if operation == "--check" else (operation, "--dry-run")))
            assert_unchanged(self, before, self.project)
        for flags in (("--check", "--update"), ("--check", "--uninstall"), ("--update", "--uninstall")):
            with self.subTest(flags=flags):
                output = self.cli(*flags, ok=False)
                self.assertRegex(output.lower(), r"not allowed with|mutually exclusive|incompatible|cannot (?:be )?(?:used|combine)|only one")
                assert_unchanged(self, before, self.project)

    def test_legacy_install_and_exclusive_operations(self):
        self.installed().parent.mkdir(parents=True)
        self.installed().write_text("Legacy")
        before = snapshot(self.project)
        for args in ((), ("--update",), ("--uninstall",), ("--check", "--update"), ("--update", "--uninstall"), ("--check", "--uninstall")):
            self.cli(*args, ok=False)
            assert_unchanged(self, before, self.project)


if __name__ == "__main__":
    unittest.main()
