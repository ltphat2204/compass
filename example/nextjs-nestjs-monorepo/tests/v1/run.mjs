import { spawnSync } from 'node:child_process';
import { projectDir, suiteDir } from './harness.mjs';
const apiPort = process.env.BROWSER_API_PORT ?? '43001';
const commands = [
  [projectDir, ['build']],
  [suiteDir, ['test:http']],
  [suiteDir, ['test:browser']],
];
for (const [cwd, args] of commands) {
  const result = spawnSync('pnpm', args, { cwd, stdio: 'inherit', env: { ...process.env, NEXT_PUBLIC_API_URL: `http://127.0.0.1:${apiPort}`, ACCEPTANCE_REFERENCE: '0', CONTROL_MUTATION: '' } });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
