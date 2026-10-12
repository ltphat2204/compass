"""Exercise actual copies, scope boundaries and no-overwrite behavior."""

import importlib.util
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
import subprocess
import sys
from unittest.mock import patch


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("compass_install", ROOT / "scripts/install.py")
INSTALLER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(INSTALLER)
SOURCE = ROOT / ".agents/skills"


def contents(folder):
    return {str(p.relative_to(folder)): p.read_bytes()
            for p in folder.rglob("*") if p.is_file()}


class InstallTests(unittest.TestCase):
    def test_cli_requires_project_and_has_no_global_option(self):
        with TemporaryDirectory() as scratch:
            for args in (("--agent", "claude"),
                         ("--agent", "claude", "--project", scratch, "--global")):
                with self.subTest(args=args):
                    result = subprocess.run(
                        [sys.executable, str(ROOT / "scripts/install.py"), *args],
                        capture_output=True, text=True,
                    )
                    self.assertEqual(result.returncode, 2)
                    self.assertEqual(list(Path(scratch).iterdir()), [])

    def test_missing_source_does_not_change_project(self):
        with TemporaryDirectory() as scratch:
            project = Path(scratch)
            note = project / "user-note.txt"
            note.write_text("preserve")
            before = contents(project)
            with self.assertRaises(ValueError):
                INSTALLER.install("claude", project, project / "missing-source")
            self.assertEqual(before, contents(project))

    def test_all_hosts_copy_resources_and_preserve_project(self):
        for host in INSTALLER.HOST_PATHS:
            with self.subTest(host=host), TemporaryDirectory() as scratch:
                project = Path(scratch)
                note = project / "user-note.txt"
                note.write_text("preserve")
                destination = INSTALLER.install(host, project, SOURCE)
                self.assertEqual(contents(SOURCE), contents(destination))
                self.assertEqual(note.read_text(), "preserve")

    def test_collision_preserves_user_edits_and_copies_nothing(self):
        with TemporaryDirectory() as scratch:
            project = Path(scratch)
            destination = project / ".claude/skills"
            existing = destination / "comp-tasks"
            existing.mkdir(parents=True)
            (existing / "SKILL.md").write_text("user customizations")
            before = contents(project)
            with self.assertRaises(FileExistsError):
                INSTALLER.install("claude", project, SOURCE)
            self.assertEqual(before, contents(project))

    def test_broken_symlink_is_not_overwritten(self):
        with TemporaryDirectory() as scratch:
            project = Path(scratch)
            destination = project / ".agents/skills"
            destination.mkdir(parents=True)
            link = destination / "comp-review"
            link.symlink_to(project / "missing")
            with self.assertRaises(FileExistsError):
                INSTALLER.install("codex", project, SOURCE)
            self.assertTrue(link.is_symlink())
            self.assertEqual(list(destination.iterdir()), [link])

    def test_external_destination_is_rejected(self):
        with TemporaryDirectory() as scratch:
            base = Path(scratch)
            project, outside = base / "project", base / "outside"
            project.mkdir()
            outside.mkdir()
            (project / ".cursor").symlink_to(outside, target_is_directory=True)
            with self.assertRaises(ValueError):
                INSTALLER.install("cursor", project, SOURCE)
            self.assertEqual(list(outside.iterdir()), [])

    def test_copy_failure_removes_only_owned_installation(self):
        with TemporaryDirectory() as scratch:
            project = Path(scratch)
            destination = project / ".github/skills"
            unrelated = destination / "user-skill"
            unrelated.mkdir(parents=True)
            (unrelated / "SKILL.md").write_text("preserve")
            copytree = INSTALLER.shutil.copytree
            calls = 0

            def failing_copy(*args, **kwargs):
                nonlocal calls
                calls += 1
                if calls == 2:
                    raise OSError("copy interrupted")
                return copytree(*args, **kwargs)

            with patch.object(INSTALLER.shutil, "copytree", side_effect=failing_copy):
                with self.assertRaises(OSError):
                    INSTALLER.install("copilot", project, SOURCE)
            self.assertEqual(contents(destination), {"user-skill/SKILL.md": b"preserve"})


if __name__ == "__main__":
    unittest.main()
