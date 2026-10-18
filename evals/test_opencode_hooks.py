"""Public V2 adapter contract, exercised through Node and the real dispatcher."""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
ADAPTER = Path(os.environ.get('COMPASS_OPENCODE_ADAPTER', ROOT / 'integrations/opencode/compass.js'))
HARNESS = ROOT / 'evals/fixtures/opencode-hooks/harness.mjs'


class OpenCodeHooksTests(unittest.TestCase):
    def run_scenario(self, scenario, status='complete', state=True, invalid=False, passed=False, trace=False):
        with tempfile.TemporaryDirectory(prefix='compass opencode ') as directory:
            project = Path(directory)
            (project / '.git').mkdir()
            (project / 'feature').mkdir()
            for name, content in {'feature/intent.md': 'intent', 'feature/plan.md': 'plan',
                                  'src.txt': 'source', 'test.txt': 'frozen'}.items():
                (project / name).write_text(content)
            if state:
                (project / '.compass').mkdir()
                (project / '.compass/hooks.json').write_text(json.dumps({
                    'version': 1, 'feature': 'feature', 'status': status,
                    'behavior_change': True, 'scope': ['src.txt'],
                    'frozen': {'test.txt': hashlib.sha256(b'frozen').hexdigest()}, 'blockers': [],
                }))
                if passed:
                    report = project / 'report.txt'
                    report.write_text('independent PASS')
                    snapshot = subprocess.run(['python3', str(ROOT / 'hooks/compass.py'), 'snapshot'],
                                              cwd=project, text=True, capture_output=True, check=True).stdout.strip()
                    path = project / '.compass/hooks.json'
                    record = json.loads(path.read_text())
                    evidence = {'status': 'PASS', 'snapshot': snapshot, 'report': 'report.txt',
                                'report_sha256': hashlib.sha256(report.read_bytes()).hexdigest()}
                    record.update(verification=evidence, review=evidence)
                    path.write_text(json.dumps(record))
            env = {**os.environ, 'PROJECT': str(project), 'ADAPTER': str(ADAPTER), 'SCENARIO': scenario}
            if invalid or trace:
                shim = project / 'python3'
                if trace:
                    shim.write_text(f'#!{sys.executable}\nimport sys, subprocess\n'
                                    'data = sys.stdin.read()\n'
                                    f'with open({str(project / "trace.jsonl")!r}, "a") as f: f.write(data + "\\n")\n'
                                    f'p = subprocess.run([{sys.executable!r}, *sys.argv[1:]], input=data, text=True)\n'
                                    'sys.exit(p.returncode)\n')
                elif invalid == 'json':
                    shim.write_text('#!/bin/sh\nprintf "{broken JSON"\n')
                elif invalid == 'schema':
                    shim.write_text('#!/bin/sh\nprintf "[]"\n')
                else:
                    shim.write_text('#!/bin/sh\necho "dispatcher process failed" >&2\nexit 17\n')
                shim.chmod(0o755)
                env['PATH'] = str(project) + os.pathsep + env['PATH']
            result = subprocess.run(['node', str(HARNESS)], text=True, capture_output=True,
                                    timeout=20, env=env)
            self.assertEqual(result.returncode, 0, result.stderr + result.stdout)
            data = json.loads(result.stdout)
            self.assertTrue(data['aborted'], 'cleanup must abort event subscription')
            self.assertEqual(data['disposed'], 3, 'cleanup must dispose all hook registrations')
            self.assertEqual((project / 'test.txt').read_text(), 'frozen')
            if trace:
                return data['output'], [json.loads(line) for line in (project / 'trace.jsonl').read_text().splitlines()]
            return data['output']

    def test_frozen_mappings_and_unrelated_tools(self):
        values, events = self.run_scenario('mapping', trace=True)
        for value in values[:3]:
            self.assertIn('frozen', value.get('error', '').lower(), value)
        for value in values[3:]:
            self.assertNotIn('error', value)
        self.assertEqual([event['tool_name'] for event in events], ['Write', 'Edit', 'apply_patch', 'Write', 'Bash'])

    def test_prompt_keeps_text_and_adds_semantic_guidance(self):
        result = self.run_scenario('prompt')
        self.assertNotIn('error', result)
        text = result['data']['prompt']['text']
        self.assertIn('Keep my exact request.', text)
        self.assertIn('comp-engineer', text)
        self.assertEqual(result['data']['marker'], 7)

    def test_after_preserves_content_metadata_and_failure(self):
        outputs = self.run_scenario('after')
        for output in outputs[:2]:
            self.assertNotIn('error', output)
            result = output['data']['result']
            self.assertEqual(result['marker'], 9)
            self.assertIn('original output', json.dumps(result['content']))
            self.assertIn('STALE', json.dumps(result['content']))
        self.assertIn({'type': 'image', 'url': 'keep-image'}, outputs[1]['data']['result']['content'])
        failure = outputs[2]['data']
        self.assertEqual(failure['status'], 'error')
        self.assertEqual(failure['error'], {'message': 'actual failure', 'code': 3})
        self.assertIn('failure detail', json.dumps(failure['result']['content']))

    def test_completion_scoping_guard_and_external_reset(self):
        result = self.run_scenario('events')
        self.assertEqual([result[k] for k in ['initial', 'first', 'repeated', 'secondSession']], [0, 1, 1, 2])
        self.assertEqual([p['sessionID'] for p in result['prompts']], ['one', 'two', 'one', 'before-only', 'after-only'])
        for prompt in result['prompts']:
            self.assertIn('STALE', prompt['text'])

    def test_nonblocking_gates_do_not_continue(self):
        for status, state in [('active', True), ('blocked', True), ('complete', False)]:
            with self.subTest(status=status, state=state):
                self.assertEqual(self.run_scenario('events', status, state)['prompts'], [])
        self.assertEqual(self.run_scenario('events', passed=True)['prompts'], [])

    def test_dispatcher_error_is_visible(self):
        result = self.run_scenario('mapping', invalid=True)
        self.assertTrue(result[0].get('error'), result)
        self.assertIn('dispatcher process failed', result[0]['error'])
        for invalid in ['json', 'schema']:
            with self.subTest(invalid=invalid):
                result = self.run_scenario('mapping', invalid=invalid)
                self.assertTrue(result[0].get('error'), result)


if __name__ == '__main__':
    unittest.main()
