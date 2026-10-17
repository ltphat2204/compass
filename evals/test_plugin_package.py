"""Check the submission ZIP contains portable skills and only public package files."""
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from zipfile import ZipFile

REPO = Path(__file__).resolve().parents[1]


class PluginPackageTest(unittest.TestCase):
    def test_submission_layout_resources_and_overwrite_protection(self):
        with tempfile.TemporaryDirectory() as temporary:
            output = Path(temporary) / "compass.zip"
            command = [sys.executable, str(REPO / "scripts/package_plugin.py"), "--output", str(output)]
            result = subprocess.run(command, capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            with ZipFile(output) as archive:
                manifest = json.loads(archive.read(".codex-plugin/plugin.json"))
                self.assertEqual(manifest["skills"], "./skills/")
                expected = {".codex-plugin/plugin.json"}
                for source, prefix in ((REPO / ".agents/skills", "skills"), (REPO / "assets", "assets")):
                    for path in source.rglob("*"):
                        if path.is_file():
                            name = f"{prefix}/{path.relative_to(source)}"
                            expected.add(name)
                            self.assertEqual(archive.read(name), path.read_bytes(), name)
                self.assertEqual(set(archive.namelist()), expected)
                self.assertEqual(sum(name.endswith("/SKILL.md") for name in expected), 9)
                for key in ("logo", "composerIcon"):
                    self.assertIn(manifest["interface"][key].removeprefix("./"), expected)
            original = output.read_bytes()
            result = subprocess.run(command, capture_output=True, text=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual(output.read_bytes(), original)


if __name__ == "__main__":
    unittest.main()
