"""Exercise the Pi project installation contract."""

from pathlib import Path
import subprocess
import sys
from tempfile import TemporaryDirectory
import unittest

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / ".agents/skills"


class PiHostTests(unittest.TestCase):
    def test_project_skills_install_check_and_uninstall(self):
        with TemporaryDirectory() as scratch:
            project = Path(scratch)
            command = [sys.executable, str(ROOT / "scripts/install.py"),
                       "--agent", "pi", "--project", str(project)]
            installed = subprocess.run(command, capture_output=True, text=True)
            self.assertEqual(installed.returncode, 0, installed.stdout + installed.stderr)

            destination = project / ".pi/skills"
            for skill in SOURCE.iterdir():
                with self.subTest(skill=skill.name):
                    self.assertEqual((destination / skill.name / "SKILL.md").read_bytes(),
                                     (skill / "SKILL.md").read_bytes())
            self.assertFalse((project / ".pi/agents").exists())

            checked = subprocess.run(command + ["--check"], capture_output=True, text=True)
            self.assertEqual(checked.returncode, 0, checked.stdout + checked.stderr)
            removed = subprocess.run(command + ["--uninstall"], capture_output=True, text=True)
            self.assertEqual(removed.returncode, 0, removed.stdout + removed.stderr)
            self.assertEqual([path for path in destination.rglob("*") if path.is_file()], [])
            self.assertFalse((project / ".compass/install-pi.json").exists())


if __name__ == "__main__":
    unittest.main()
