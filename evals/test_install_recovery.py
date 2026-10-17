"""Public lifecycle data-preservation contracts, independently authored."""
import importlib.util
import os
import re
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

INSTALLER = Path(os.environ.get("COMPASS_INSTALLER", Path(__file__).resolve().parents[1] / "scripts/install.py"))
NAMES = tuple("comp-" + name for name in "analyze done engineer implement intent plan review ship tasks".split())


class InstallRecoveryContract(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve()
        self.source = self.root / "source"
        for name in NAMES:
            directory = self.source / name
            directory.mkdir(parents=True)
            (directory / "SKILL.md").write_text(f"---\nname: {name}\ndescription: Recovery fixture.\n---\n# Recovery\nOriginal bytes.\n")
        self.project = self.root / "project"
        self.project.mkdir()
        self.user = self.project / "README.md"
        self.user.write_text("Unrelated user bytes")
        spec = importlib.util.spec_from_file_location("compass_recovery_subject", INSTALLER)
        self.api = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(self.api)
        self.payload = self.project / ".agents/skills"
        self.manifest = self.project / ".compass/install-codex.json"

    def install(self):
        self.api.install("codex", self.project, self.source)

    def manage(self, operation):
        return self.api.manage("codex", self.project, self.source, operation=operation)

    def tracked_bytes(self):
        paths = [self.manifest, self.user]
        paths.extend(self.payload / name / "SKILL.md" for name in NAMES)
        return {path: path.read_bytes() if path.exists() else None for path in paths}

    def changed_source(self):
        for name in NAMES:
            path = self.source / name / "SKILL.md"
            path.write_text(path.read_text().replace("Original bytes.", "Updated source bytes."))

    def assert_old_installation(self, before):
        self.assertEqual(self.tracked_bytes(), before)
        # Check against the old source expected by the restored installation.
        for name in NAMES:
            (self.source / name / "SKILL.md").write_bytes(before[self.payload / name / "SKILL.md"])
        self.manage("check")

    def test_missing_source_preserves_value_error(self):
        with self.assertRaises(ValueError):
            self.api.install("codex", self.project, self.root / "absent-source")
        self.assertEqual(self.user.read_text(), "Unrelated user bytes")
        self.assertFalse(self.manifest.exists())
        self.assertFalse(self.payload.exists())

    def test_update_preserves_unrelated_hardlink_names(self):
        self.install()
        owned = self.payload / "comp-analyze/SKILL.md"
        alias = self.project / "personal-copy.md"
        os.link(owned, alias)
        original = alias.read_bytes()
        self.changed_source()
        self.manage("update")
        self.assertEqual(alias.read_bytes(), original, "update truncated a shared inode")
        self.assertEqual(owned.read_bytes(), (self.source / "comp-analyze/SKILL.md").read_bytes())
        self.assertNotEqual(owned.read_bytes(), original)
        self.manage("check")

    def test_uninstall_preserves_unrelated_hardlink_names(self):
        self.install()
        owned = self.payload / "comp-analyze/SKILL.md"
        alias = self.project / "personal-copy.md"
        os.link(owned, alias)
        original = alias.read_bytes()
        self.manage("uninstall")
        self.assertEqual(alias.read_bytes(), original, "uninstall truncated a shared inode")
        self.assertFalse(owned.exists())
        self.assertFalse(self.manifest.exists())
        self.assertEqual(self.user.read_text(), "Unrelated user bytes")

    def failure_case(self, operation, boundary):
        self.install()
        before = self.tracked_bytes()
        self.changed_source()
        real_replace, real_unlink = os.replace, os.unlink
        fired = []
        mutated = []
        def changed():
            return any((path.read_bytes() if path.exists() else None) != value for path, value in before.items() if path != self.manifest and path != self.user)
        def absolute(path):
            return Path(os.path.abspath(os.fspath(path)))
        def inject(src, dst=None):
            if fired:
                return
            live_changed = changed()
            if live_changed:
                mutated.append(True)
            manifest_commit = absolute(src) == self.manifest or (dst is not None and absolute(dst) == self.manifest)
            if live_changed and (boundary == "payload" or manifest_commit):
                fired.append(True)
                raise OSError("injected ordinary commit failure")
        def replace(src, dst, *args, **kwargs):
            inject(src, dst)
            return real_replace(src, dst, *args, **kwargs)
        def unlink(path, *args, **kwargs):
            inject(path)
            return real_unlink(path, *args, **kwargs)
        with patch.object(os, "replace", replace), patch.object(os, "unlink", unlink):
            with self.assertRaises((OSError, ValueError)):
                self.manage(operation)
        self.assertTrue(fired, f"did not exercise {boundary} failure boundary")
        self.assertTrue(mutated, "failure must occur after a live payload mutation")
        self.assert_old_installation(before)

    def test_failed_recovery_retains_original_backup_and_reports_location(self):
        self.install()
        before = self.tracked_bytes()
        self.changed_source()
        real_replace, real_unlink = os.replace, os.unlink
        primary = []
        restoration = []
        changed_paths = []
        owned = set(before) - {self.manifest, self.user}
        def absolute(path):
            return Path(os.path.abspath(os.fspath(path)))
        def inject(src, dst=None):
            if primary:
                if dst is not None and absolute(dst) in owned:
                    restoration.append(absolute(dst))
                    raise OSError("injected restoration failure")
                return
            changed = [path for path in owned if not path.exists() or path.read_bytes() != before[path]]
            if changed:
                changed_paths.extend(changed)
                primary.append(True)
                raise OSError("injected primary commit failure")
        def replace(src, dst, *args, **kwargs):
            inject(src, dst)
            return real_replace(src, dst, *args, **kwargs)
        def unlink(path, *args, **kwargs):
            inject(path)
            return real_unlink(path, *args, **kwargs)
        with patch.object(os, "replace", replace), patch.object(os, "unlink", unlink):
            with self.assertRaises((OSError, ValueError)) as failure:
                self.manage("update")
        self.assertTrue(primary, "primary failure did not follow a live mutation")
        self.assertTrue(restoration, "restoration failure was not exercised")
        message = str(failure.exception)
        self.assertRegex(message.lower(), r"recover|backup")
        reported_roots = [Path(match.rstrip(" .)")) for match in re.findall(r"/[^\n'\";,]+", message)]
        search_roots = [self.root, *[path for path in reported_roots if path.exists()]]
        backups = set()
        for root in search_roots:
            for path in ([root] if root.is_file() else root.rglob("*")):
                if path.is_file() and path not in before and self.source not in path.parents:
                    backups.add(path)
        for changed in changed_paths:
            surviving = [path for path in backups if path.read_bytes() == before[changed]]
            self.assertTrue(surviving, f"original bytes lost for {changed}")
            reported = [location for path in surviving for location in (path, *path.parents) if location not in (self.root, self.project, Path("/"), *self.root.parents) and (str(location) in message or (self.project in location.parents and location.relative_to(self.project).as_posix() in message))]
            self.assertTrue(reported, "error must identify an existing retained backup location")
        self.assertEqual(self.user.read_bytes(), before[self.user])

    def test_update_recovers_after_payload_mutation(self):
        self.failure_case("update", "payload")

    def test_uninstall_recovers_after_payload_mutation(self):
        self.failure_case("uninstall", "payload")

    def test_update_recovers_manifest_commit_failure(self):
        self.failure_case("update", "manifest")

    def test_uninstall_recovers_manifest_commit_failure(self):
        self.failure_case("uninstall", "manifest")


if __name__ == "__main__":
    unittest.main()
