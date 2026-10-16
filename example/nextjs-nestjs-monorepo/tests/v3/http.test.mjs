import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { apiFixture, request, reference, run, stop, suiteDir, projectDir, freePort } from './harness.mjs';

async function fixture(t) { const f = await apiFixture(); t.after(() => f.close()); await f.start(); return f; }
function task(value, title, completed = false) {
  assert.equal(typeof value.id, 'string'); assert.ok(value.id.length > 0);
  assert.equal(value.title, title); assert.equal(value.completed, completed);
  assert.equal(typeof value.createdAt, 'string');
  assert.match(value.createdAt, /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/);
  assert.ok(Number.isFinite(Date.parse(value.createdAt)));
}
async function error(response, status, privateValues = []) {
  assert.equal(response.status, status);
  const body = await response.json();
  assert.equal(typeof body.error?.code, 'string'); assert.ok(body.error.code.length);
  assert.equal(typeof body.error?.message, 'string'); assert.ok(body.error.message.length);
  const text = JSON.stringify(body);
  for (const privateValue of privateValues) assert.ok(!text.includes(privateValue), `Internal detail leaked: ${privateValue}`);
  assert.ok(!/(SQLITE_|SQL logic error|node_modules|\bat .*\(.*:\d+:\d+\))/i.test(text));
}
async function create(f, title) { const response = await request(f, 'POST', { title }); assert.equal(response.status, 201); const body = await response.json(); task(body.task, title.trim()); return body.task; }

test('validation: trim, Unicode length, duplicate titles and internal spaces', async t => {
  const f = await fixture(t);
  for (const title of ['😀', '  Mua sữa  ', 'việc  ở  nhà', '😀'.repeat(200), 'e\u0301'.repeat(100)]) await create(f, title);
  const a = await create(f, 'trùng'); const b = await create(f, 'trùng'); assert.notEqual(a.id, b.id);
  for (const title of ['', ' \t\n ', '😀'.repeat(201), 'a'.repeat(201), 'e\u0301'.repeat(100) + 'x']) await error(await request(f, 'POST', { title }), 400);
  const trimmedBoundary = await create(f, '  ' + '😀'.repeat(200) + '  '); task(trimmedBoundary, '😀'.repeat(200));
});

test('validation: reject invalid shapes, unknown fields, JSON and unsupported media', async t => {
  const f = await fixture(t);
  const original = await create(f, 'giữ lại');
  for (const body of [null, [], 'title', {}, { title: null }, { title: 1 }, { title: true }, { title: 'a', completed: false }, { title: 'a', extra: 1 }, { title: 'a', id: 'client' }]) await error(await request(f, 'POST', body), 400);
  for (const body of [null, [], {}, { completed: 'false' }, { completed: 0 }, { completed: null }, { title: false }, { title: ' ' }, { title: 'x'.repeat(201) }, { unknown: 1 }, { title: 'new', createdAt: '2020-01-01T00:00:00Z' }]) await error(await request(f, 'PATCH', body, original.id), 400);
  await error(await fetch(`${f.origin}/api/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"title":' }), 400);
  await error(await fetch(`${f.origin}/api/tasks`, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: '{"title":"x"}' }), 415);
  await error(await fetch(`${f.origin}/api/tasks/${original.id}`, { method: 'PATCH', headers: { 'Content-Type': 'text/plain' }, body: '{"completed":true}' }), 415);
  const { tasks } = await (await request(f)).json(); assert.deepEqual(tasks, [original]);
});

test('parser boundaries: unsupported JSON charset preserves stored tasks', async t => {
  const f = await fixture(t); const original = await create(f, 'charset boundary');
  for (const method of ['POST', 'PATCH']) {
    const response = await request(f, method, { title: 'rejected charset' }, method === 'PATCH' ? original.id : '', { 'Content-Type': 'application/json; charset=iso-8859-1' });
    await error(response, 415, [f.database, f.directory]);
    assert.deepEqual((await (await request(f)).json()).tasks, [original]);
  }
  await f.stop(); await f.start();
  assert.deepEqual((await (await request(f)).json()).tasks, [original]);
});

test('parser boundaries: large valid JSON with over-limit title is 400 without mutation', async t => {
  const f = await fixture(t); const original = await create(f, 'large title boundary');
  // ASCII keeps byte and code-point length equal, beyond ordinary JSON body ceilings.
  const title = 'x'.repeat(2 * 1024 * 1024);
  for (const method of ['POST', 'PATCH']) {
    const body = method === 'PATCH' ? { title, completed: true } : { title };
    await error(await request(f, method, body, method === 'PATCH' ? original.id : ''), 400, [f.database, f.directory]);
    assert.deepEqual((await (await request(f)).json()).tasks, [original]);
  }
  await f.stop(); await f.start();
  assert.deepEqual((await (await request(f)).json()).tasks, [original]);
});

test('CRUD: identity, boolean transitions, ordering, last write and delete semantics', async t => {
  const f = await fixture(t);
  assert.deepEqual(await (await request(f)).json(), { tasks: [] });
  const first = await create(f, 'một');
  await new Promise(resolve => setTimeout(resolve, 20));
  const second = await create(f, '<b>hai</b>');
  const listed = await (await request(f)).json(); assert.equal(listed.tasks[0].id, second.id); assert.equal(listed.tasks[1].id, first.id);
  for (const update of [{ title: '  mới  ', completed: true }, { completed: false }, { title: 'cuối' }]) {
    const response = await request(f, 'PATCH', update, first.id); assert.equal(response.status, 200);
    const updated = (await response.json()).task;
    assert.equal(updated.id, first.id); assert.equal(updated.createdAt, first.createdAt);
    task(updated, update.title?.trim() ?? 'mới', update.completed ?? false);
  }
  let tasks = (await (await request(f)).json()).tasks; assert.equal(tasks[1].title, 'cuối'); assert.equal(tasks[0].id, second.id);
  const response = await request(f, 'DELETE', undefined, first.id); assert.equal(response.status, 204); assert.equal(await response.text(), '');
  await error(await request(f, 'DELETE', undefined, first.id), 404); await error(await request(f, 'PATCH', { completed: true }, first.id), 404);
  tasks = (await (await request(f)).json()).tasks; assert.deepEqual(tasks, [second]);
});

test('persistence: restart preserves edits and deletions; ties have deterministic ID order', async t => {
  const f = await fixture(t);
  const a = await create(f, 'bền'); const b = await create(f, 'xóa');
  const response = await request(f, 'PATCH', { completed: true }, a.id); assert.equal(response.status, 200);
  assert.equal((await request(f, 'DELETE', undefined, b.id)).status, 204);
  await f.stop(); await f.start();
  assert.deepEqual((await (await request(f)).json()).tasks, [{ ...a, completed: true }]);
  // The public contract fixes an ID tiebreak, but does not choose its direction.
  const items = await Promise.all(Array.from({ length: 12 }, (_, i) => create(f, `đồng thời ${i}`)));
  const before = (await (await request(f)).json()).tasks;
  const grouped = Map.groupBy(before, item => item.createdAt);
  for (const group of grouped.values()) {
    const ids = group.map(item => item.id);
    const ascending = [...ids].sort();
    assert.ok(JSON.stringify(ids) === JSON.stringify(ascending) || JSON.stringify(ids) === JSON.stringify(ascending.reverse()));
  }
  await f.stop(); await f.start(); assert.deepEqual((await (await request(f)).json()).tasks, before);
  assert.equal(new Set(items.map(item => item.id)).size, items.length);
});

test('CORS: only configured origin, JSON PATCH DELETE preflights', async t => {
  const f = await fixture(t);
  for (const method of ['POST', 'PATCH', 'DELETE']) {
    const response = await fetch(`${f.origin}/api/tasks`, { method: 'OPTIONS', headers: { Origin: f.webOrigin, 'Access-Control-Request-Method': method, 'Access-Control-Request-Headers': 'content-type' } });
    assert.ok(response.ok); assert.equal(response.headers.get('access-control-allow-origin'), f.webOrigin);
    assert.ok(response.headers.get('access-control-allow-methods')?.toUpperCase().split(/,\s*/).includes(method));
    assert.ok(response.headers.get('access-control-allow-headers')?.toLowerCase().split(/,\s*/).includes('content-type'));
  }
  for (const origin of [f.webOrigin, 'https://untrusted.invalid', f.webOrigin + '.evil.invalid']) {
    for (const method of ['GET', 'OPTIONS']) {
      const response = await request(f, method, undefined, '', { Origin: origin, ...(method === 'OPTIONS' ? { 'Access-Control-Request-Method': 'PATCH' } : {}) });
      if (origin === f.webOrigin) assert.equal(response.headers.get('access-control-allow-origin'), origin);
      else assert.equal(response.headers.get('access-control-allow-origin'), null);
    }
  }
});

test('storage failure: 500 envelope without internals, no successful mutation', async t => {
  const f = await fixture(t); const existing = await create(f, 'khóa ghi');
  const db = new DatabaseSync(f.database); t.after(() => db.close());
  db.exec('PRAGMA busy_timeout=0; BEGIN IMMEDIATE');
  try { await error(await request(f, 'POST', { title: 'không lưu' }), 500, [f.database, f.directory]); }
  finally { db.exec('ROLLBACK'); }
  assert.deepEqual((await (await request(f)).json()).tasks, [existing]);
});

test('configuration: missing origin/path and unusable database fail startup clearly', async t => {
  const f = await apiFixture(); t.after(() => f.close());
  const invalid = path.join(f.directory, 'not-a-database'); await writeFile(invalid, 'this is not sqlite');
  const directoryPath = path.join(f.directory, 'directory'); await mkdir(directoryPath);
  for (const env of [{ WEB_ORIGIN: '', DATABASE_PATH: f.database }, { WEB_ORIGIN: f.webOrigin, DATABASE_PATH: '' }, { WEB_ORIGIN: f.webOrigin, DATABASE_PATH: invalid }, { WEB_ORIGIN: f.webOrigin, DATABASE_PATH: directoryPath }]) {
    const port = await freePort();
    const process = reference ? run(globalThis.process.execPath, [path.join(suiteDir, 'reference.mjs')], { PORT: String(port), ...env }, suiteDir) : run('pnpm', ['--filter', '@example/api', 'start'], { PORT: String(port), ...env }, projectDir);
    try {
      const exited = await Promise.race([new Promise(resolve => process.child.once('exit', () => resolve(true))), new Promise(resolve => setTimeout(resolve, 30000, false).unref())]);
      assert.equal(exited, true, 'Invalid startup must exit'); assert.notEqual(process.child.exitCode, 0);
      assert.match(process.output(), /config|WEB_ORIGIN|DATABASE_PATH|database|sqlite/i);
    } finally { await stop(process); }
  }
});
