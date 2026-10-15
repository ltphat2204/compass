import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { suiteDir } from './harness.mjs';
const cases = [
  ['minimum', 'validation: trim'], ['trim', 'validation: trim'], ['unicode', 'validation: trim'],
  ['keys', 'validation: reject'], ['types', 'validation: reject'],
  ['identity', 'CRUD:'], ['order', 'CRUD:'],
  ['persistence', 'persistence:'], ['cors', 'CORS:'], ['leak', 'storage failure:'],
  ['charset500', 'parser boundaries: unsupported'], ['charset400', 'parser boundaries: unsupported'],
  ['large500', 'parser boundaries: large'], ['large415', 'parser boundaries: large'],
  ['storage400', 'storage failure:']
];
function run(mutation, pattern) {
  const args = ['--test', '--test-concurrency=1', ...(pattern ? [`--test-name-pattern=${pattern}`] : []), 'http.test.mjs'];
  return spawnSync(process.execPath, args, { cwd: suiteDir, encoding: 'utf8', env: { ...process.env, ACCEPTANCE_REFERENCE: '1', CONTROL_MUTATION: mutation }, timeout: 180000 });
}
const correct = run('', '');
console.log(correct.stdout); console.error(correct.stderr);
assert.equal(correct.status, 0, 'Specification reference must pass');
for (const [mutation, pattern] of cases) {
  const result = run(mutation, pattern);
  assert.notEqual(result.status, 0, `${mutation}: wrong rule escaped detection`);
  assert.match(result.stdout, /AssertionError|ERR_ASSERTION/, `${mutation}: must fail an assertion`);
  console.log(`REJECTED ${mutation}: matching assertion detected plausible wrong rule`);
}
console.log('Positive reference and all wrong-rule HTTP controls passed.');
