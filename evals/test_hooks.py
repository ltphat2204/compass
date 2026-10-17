"""Independent subprocess assertions for the public lifecycle-hook contract."""
import hashlib
import json
import os
from pathlib import Path
import shlex
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
RUNNER = shlex.split(os.environ.get("COMPASS_HOOK_RUNNER", "")) or [sys.executable, str(ROOT / "hooks/compass.py")]

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

class HookTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix="compass hooks ")
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        for name in (".git", ".compass", "dev/feature", "src", "tests", "reports", "sub"):
            (self.root / name).mkdir(parents=True)
        for name in ("dev/feature/intent.md", "dev/feature/plan.md", "src/main.py", "tests/frozen.py"):
            (self.root / name).write_text(name + "\n")
        self.state = dict(version=1, feature="dev/feature", status="active", behavior_change=True,
                          scope=["src"], frozen={"tests/frozen.py": sha(self.root / "tests/frozen.py")}, blockers=[])
        self.save()

    def save(self):
        (self.root / ".compass/hooks.json").write_text(json.dumps(self.state))

    def call(self, event, cwd=None, **fields):
        result = subprocess.run(RUNNER, cwd=cwd or self.root, input=json.dumps(dict(
            hook_event_name=event, cwd=str(cwd or self.root), **fields)), text=True, capture_output=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        output = json.loads(result.stdout)
        self.assertIsInstance(output, dict)
        return output

    def snapshot(self, cwd=None):
        result = subprocess.run(RUNNER + ["snapshot"], cwd=cwd or self.root, text=True, capture_output=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertRegex(result.stdout.strip(), r"^[0-9a-f]{64}$")
        return result.stdout.strip()

    def deny(self, output):
        return output.get("hookSpecificOutput", {}).get("permissionDecision") == "deny"

    def evidence(self):
        snapshot = self.snapshot()
        for kind in ("verification", "review"):
            report = self.root / ("reports/" + kind + ".md")
            report.write_text("PASS " + kind)
            self.state[kind] = dict(status="PASS", snapshot=snapshot,
                                    report=str(report.relative_to(self.root)), report_sha256=sha(report))
        self.save()

    def test_registration(self):
        config = json.loads((ROOT / "hooks/hooks.json").read_text())
        hooks = config["hooks"]
        commands = []
        for event in ("UserPromptSubmit", "PreToolUse", "PostToolUse", "Stop"):
            handlers = [h for group in hooks[event] for h in group["hooks"] if h["type"] == "command"]
            self.assertEqual(len(handlers), 1)
            command = handlers[0]["command"]
            self.assertIn('"${CLAUDE_PLUGIN_ROOT}', command)
            self.assertIn("compass.py", command)
            commands.append(command)
        self.assertEqual(len(set(commands)), 1)

    def test_inert_without_state(self):
        (self.root / ".compass/hooks.json").unlink()
        for event in ("PreToolUse", "PostToolUse", "Stop"):
            self.assertEqual(self.call(event, tool_name="Write", tool_input={"file_path": "tests/frozen.py"}), {})

    def test_protection(self):
        for tool, data in (("Edit", {"file_path": "tests/frozen.py"}),
                           ("Write", {"path": "tests/../tests/frozen.py"}),
                           ("MultiEdit", {"file_path": "tests/frozen.py", "edits": []}),
                           ("mcp__files__delete_directory", {"path": "tests"})):
            with self.subTest(tool=tool):
                self.assertTrue(self.deny(self.call("PreToolUse", tool_name=tool, tool_input=data)))
        self.assertFalse(self.deny(self.call("PreToolUse", tool_name="Edit", tool_input={"file_path": "src/main.py"})))
        self.assertTrue(self.deny(self.call("PreToolUse", cwd=self.root / "sub", tool_name="Write", tool_input={"path": "../tests/frozen.py"})))
        self.assertFalse(self.deny(self.call("PreToolUse", cwd=self.root / "sub", tool_name="Write", tool_input={"path": "tests/frozen.py"})))

    def test_patch_protection(self):
        patches = ["*** Begin Patch\n*** Delete File: tests/frozen.py\n*** End Patch",
                   "*** Begin Patch\n*** Update File: tests/frozen.py\n*** Move to: tests/new.py\n@@\n-old\n+new\n*** End Patch",
                   "*** Begin Patch\n*** Update File: src/main.py\n*** Move to: tests/frozen.py\n@@\n-old\n+new\n*** End Patch"]
        for patch in patches:
            for data in (patch, {"command": patch}, {"patch": patch}, {"input": patch}):
                self.assertTrue(self.deny(self.call("PreToolUse", tool_name="apply_patch", tool_input=data)))

    def test_snapshot_scope_and_inventory(self):
        initial = self.snapshot()
        self.assertEqual(initial, self.snapshot(self.root / "sub"))
        (self.root / "outside.txt").write_text("outside")
        self.state["status"] = "blocked"
        self.state["blockers"] = ["question"]
        self.save()
        self.assertEqual(initial, self.snapshot())
        for name in ("src/new.py", "dev/feature/intent.md", "dev/feature/plan.md", "tests/frozen.py"):
            path = self.root / name
            old = path.read_bytes() if path.exists() else None
            path.write_text("changed")
            self.assertNotEqual(initial, self.snapshot(), name)
            if old is None:
                path.unlink()
            else:
                path.write_bytes(old)
        (self.root / "src/main.py").unlink()
        self.assertNotEqual(initial, self.snapshot())

    def test_snapshot_configuration(self):
        initial = self.snapshot()
        for key, value in (("scope", ["src", "tests"]), ("frozen", {}), ("behavior_change", False)):
            old = self.state[key]
            self.state[key] = value
            self.save()
            self.assertNotEqual(initial, self.snapshot(), key)
            self.state[key] = old
            self.save()
        self.state["scope"] = ["src/main.py"]
        self.save()
        initial = self.snapshot()
        (self.root / "src/main.py").unlink()
        self.assertNotEqual(initial, self.snapshot())

    def test_completion_rules(self):
        self.assertNotEqual(self.call("Stop").get("decision"), "block")
        self.state["status"] = "complete"
        self.save()
        self.assertEqual(self.call("Stop").get("decision"), "block")
        self.evidence()
        self.assertNotEqual(self.call("Stop").get("decision"), "block")
        self.state["blockers"] = ["unresolved"]
        self.save()
        self.assertEqual(self.call("Stop").get("decision"), "block")
        self.assertNotEqual(self.call("Stop", stop_hook_active=True).get("decision"), "block")
        self.state["status"] = "blocked"
        self.save()
        self.assertNotEqual(self.call("Stop").get("decision"), "block")

    def test_freeze_required_for_behavior(self):
        self.state.update(status="complete", frozen={})
        self.save()
        self.evidence()
        self.assertEqual(self.call("Stop").get("decision"), "block")
        self.state["behavior_change"] = False
        self.save()
        self.evidence()
        self.assertNotEqual(self.call("Stop").get("decision"), "block")

    def test_evidence_and_reports(self):
        self.state["status"] = "complete"
        self.save()
        self.evidence()
        for kind in ("verification", "review"):
            for field, value in (("status", "FAIL"), ("snapshot", "0" * 64), ("report_sha256", "0" * 64), ("report", "reports/missing.md")):
                old = self.state[kind][field]
                self.state[kind][field] = value
                self.save()
                self.assertEqual(self.call("Stop").get("decision"), "block", (kind, field))
                self.state[kind][field] = old
                self.save()
        (self.root / "reports/review.md").write_text("changed")
        self.assertEqual(self.call("Stop").get("decision"), "block")

    def test_post_tool_evidence_invalidation(self):
        self.evidence()
        for name in ("src/main.py", "reports/verification.md", "reports/review.md"):
            path = self.root / name
            old = path.read_bytes()
            path.write_text("changed")
            self.assertIn("stale", json.dumps(self.call("PostToolUse")).lower(), name)
            path.write_bytes(old)
        (self.root / "reports/review.md").unlink()
        self.assertIn("stale", json.dumps(self.call("PostToolUse")).lower())

    def test_drift_is_stale_without_mutation(self):
        self.state["status"] = "complete"
        self.save()
        self.evidence()
        (self.root / "tests/frozen.py").write_text("opaque shell changed frozen file")
        before = {str(p.relative_to(self.root)): p.read_bytes() for p in self.root.rglob("*") if p.is_file()}
        output = self.call("PostToolUse", tool_name="Bash", tool_input={"command": "ignored"})
        self.assertIn("stale", json.dumps(output).lower())
        self.assertEqual(self.call("Stop").get("decision"), "block")
        after = {str(p.relative_to(self.root)): p.read_bytes() for p in self.root.rglob("*") if p.is_file()}
        self.assertEqual(before, after)

    def diagnostic(self, output):
        context = output.get("systemMessage", "") + " " + output.get("hookSpecificOutput", {}).get("additionalContext", "")
        self.assertRegex(context.lower(), r"invalid|unsafe|symlink|version|path|config")
        self.assertRegex(context.lower(), r"must|fix|remove|correct|repair|use|expected|require")

    def test_invalid_state_and_boundary(self):
        for mutate in (lambda: self.state.update(scope=["../escape"]),
                       lambda: self.state.update(feature="../escape"),
                       lambda: self.state.update(version=99)):
            old = dict(self.state)
            mutate()
            self.save()
            self.diagnostic(self.call("PostToolUse"))
            self.state = old
        self.save()
        (self.root / "src/link").symlink_to(self.root / "tests/frozen.py")
        self.diagnostic(self.call("PostToolUse"))
        (self.root / "src/link").unlink()
        (self.root / "sub/.git").mkdir()
        self.assertEqual(self.call("Stop", cwd=self.root / "sub"), {})

    def test_intake_semantic_guidance(self):
        output = self.call("UserPromptSubmit", prompt="Brainstorm a safer lifecycle workflow")
        context = output.get("hookSpecificOutput", {}).get("additionalContext", "")
        self.assertIn("comp-engineer", context)
        self.assertRegex(context.lower(), r"explor|brainstorm")
        self.assertRegex(context.lower(), r"resum|existing|continu")
        self.assertRegex(context.lower(), r"explan|status")
        self.assertRegex(context.lower(), r"authoriz|implement")

if __name__ == "__main__":
    unittest.main()
