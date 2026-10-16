import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { fileURLToPath } from 'node:url';

export const suiteDir = path.dirname(fileURLToPath(import.meta.url));
export const projectDir = path.resolve(suiteDir, '../..');
export const reference = process.env.ACCEPTANCE_REFERENCE === '1';
export async function freePort(requested = 0) {
  const server = net.createServer();
  await new Promise((resolve, reject) => server.once('error', reject).listen(requested, '127.0.0.1', resolve));
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve));
  return port;
}
export function run(command, args, env = {}, cwd = projectDir) {
  const child = spawn(command, args, { cwd, env: { ...process.env, ...env }, detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '';
  child.stdout.on('data', chunk => { output = (output + chunk).slice(-24000); });
  child.stderr.on('data', chunk => { output = (output + chunk).slice(-24000); });
  child.on('error', error => { output += error.message; });
  return { child, output: () => output };
}
export async function stop(process) {
  if (!process) return;
  const { child } = process;
  try { globalThis.process.kill(-child.pid, 'SIGTERM'); } catch {}
  await Promise.race([new Promise(resolve => child.exitCode !== null ? resolve() : child.once('exit', resolve)), new Promise(resolve => setTimeout(resolve, 4000).unref())]);
  // A wrapper may exit before its descendants; always finish this owned process group.
  try { globalThis.process.kill(-child.pid, 'SIGKILL'); } catch {}
}
export async function ready(url, process, timeout = 120000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (process.child.exitCode !== null) throw new Error(`Server exited (${process.child.exitCode}): ${process.output()}`);
    try { const response = await fetch(url, { signal: AbortSignal.timeout(1500) }); if (response.ok) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  throw new Error(`Server not ready: ${url}\n${process.output()}`);
}
export async function apiFixture(options = {}) {
  const directory = await mkdtemp(path.join(tmpdir(), 'compass-task-v1-'));
  const port = await freePort(options.port ?? 0);
  const origin = `http://127.0.0.1:${port}`;
  const webOrigin = options.webOrigin ?? 'http://127.0.0.1:39999';
  const database = path.join(directory, 'tasks.sqlite');
  let server;
  const fixture = {
    directory, port, origin, webOrigin, database,
    async start(extra = {}) {
      server = reference
        ? run(process.execPath, [path.join(suiteDir, 'reference.mjs')], { PORT: String(port), WEB_ORIGIN: webOrigin, DATABASE_PATH: database, ...extra }, suiteDir)
        : run('pnpm', ['--filter', '@example/api', 'start'], { PORT: String(port), WEB_ORIGIN: webOrigin, DATABASE_PATH: database, ...extra });
      fixture.server = server;
      await ready(`${origin}/api/tasks`, server);
    },
    async stop() { await stop(server); server = undefined; },
    async close() { await fixture.stop(); await rm(directory, { recursive: true, force: true }); }
  };
  return fixture;
}
export async function request(fixture, method = 'GET', body, id = '', headers = {}) {
  return fetch(`${fixture.origin}/api/tasks${id ? `/${encodeURIComponent(id)}` : ''}`, {
    method, headers: { ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...headers },
    body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(10000)
  });
}
