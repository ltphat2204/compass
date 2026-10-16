import { spawn } from 'node:child_process';
const children = ['@example/api', '@example/web'].map((name) => spawn('pnpm', ['--filter', name, 'dev'], { stdio: 'inherit', detached: true, env: { ...process.env, ...(process.env[name === '@example/api' ? 'API_PORT' : 'WEB_PORT'] ? { PORT: process.env[name === '@example/api' ? 'API_PORT' : 'WEB_PORT'] } : {}) } }));
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    try { process.kill(-child.pid, 'SIGTERM'); } catch (error) { if (error.code !== 'ESRCH') console.error(error.message); }
  }
  setTimeout(() => {
    for (const child of children) { try { process.kill(-child.pid, 'SIGKILL'); } catch {} }
    process.exit(code);
  }, 3000);
}
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
for (const child of children) {
  child.on('error', (error) => { console.error(error.message); stop(1); });
  child.on('exit', (code) => { if (!stopping) stop(code ?? 1); });
}
