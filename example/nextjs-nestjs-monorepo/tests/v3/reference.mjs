// Isolated specification reference used only to challenge the assertions before freeze.
// Never imported by either application; schema and implementation are private to this fixture.
import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
const mutation = process.env.CONTROL_MUTATION;
if (!process.env.WEB_ORIGIN || !process.env.DATABASE_PATH) { console.error('Configuration requires WEB_ORIGIN and DATABASE_PATH'); process.exit(1); }
let db;
try { db = new DatabaseSync(process.env.DATABASE_PATH); db.exec('PRAGMA busy_timeout=50; CREATE TABLE IF NOT EXISTS reference_tasks (id TEXT PRIMARY KEY, title TEXT, completed INTEGER, createdAt TEXT)'); }
catch { console.error('Cannot open SQLite database'); process.exit(1); }
if (mutation === 'persistence') db.exec('DELETE FROM reference_tasks');
const decode = row => ({ ...row, completed: Boolean(row.completed) });
const list = () => db.prepare(`SELECT * FROM reference_tasks ORDER BY createdAt ${mutation === 'order' ? 'ASC' : 'DESC'}, id DESC`).all().map(decode);
const get = id => { const row = db.prepare('SELECT * FROM reference_tasks WHERE id = ?').get(id); return row && decode(row); };
function valid(body, patch) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return false;
  const keys = Object.keys(body);
  if (!keys.length || (mutation !== 'keys' && keys.some(key => !(patch ? ['title', 'completed'] : ['title']).includes(key)))) return false;
  if (!patch && !('title' in body)) return false;
  if ('title' in body) {
    if (typeof body.title !== 'string') return false;
    const title = body.title.trim();
    const length = mutation === 'unicode' ? title.length : [...title].length;
    if (length < (mutation === 'minimum' ? 2 : 1) || length > 200) return false;
  }
  if ('completed' in body && typeof body.completed !== 'boolean' && mutation !== 'types') return false;
  return true;
}
http.createServer(async (req, res) => {
  const origin = req.headers.origin;
  if (origin === process.env.WEB_ORIGIN || mutation === 'cors') res.setHeader('Access-Control-Allow-Origin', mutation === 'cors' ? '*' : origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  const send = (status, body) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(body === undefined ? undefined : JSON.stringify(body)); };
  const fail = status => send(mutation === 'storage400' && status === 500 ? 400 : status, { error: { code: `HTTP_${status}`, message: mutation === 'leak' && status === 500 ? process.env.DATABASE_PATH : 'Request failed' } });
  if (req.method === 'OPTIONS') return send(204);
  const match = req.url.match(/^\/api\/tasks(?:\/([^/?]+))?$/);
  if (!match) return fail(404);
  const id = match[1] && decodeURIComponent(match[1]);
  try {
    if (req.method === 'GET') return send(200, { tasks: list() });
    if (req.method === 'DELETE') {
      if (!get(id)) return fail(404);
      db.prepare('DELETE FROM reference_tasks WHERE id = ?').run(id); return send(204);
    }
    if (!['POST', 'PATCH'].includes(req.method)) return fail(404);
    if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] ?? '')) return fail(415);
    const charset = /(?:^|;)\s*charset\s*=\s*(?:"([^"]*)"|([^;\s]*))/i.exec(req.headers['content-type']);
    if (charset && !/^utf-?8$/i.test(charset[1] ?? charset[2])) {
      req.resume();
      return fail(mutation === 'charset500' ? 500 : mutation === 'charset400' ? 400 : 415);
    }
    // Bound retained bytes while draining the request so the client receives the JSON error.
    const chunks = []; let size = 0; let oversized = false;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 64 * 1024) { oversized = true; chunks.length = 0; }
      else if (!oversized) chunks.push(chunk);
    }
    if (oversized) return fail(mutation === 'large500' ? 500 : mutation === 'large415' ? 415 : 400);
    const text = Buffer.concat(chunks).toString('utf8');
    let body; try { body = JSON.parse(text); } catch { return fail(400); }
    if (!valid(body, req.method === 'PATCH')) return fail(400);
    if (req.method === 'POST') {
      const item = { id: randomUUID(), title: mutation === 'trim' ? body.title : body.title.trim(), completed: false, createdAt: new Date().toISOString() };
      db.prepare('INSERT INTO reference_tasks VALUES (?, ?, ?, ?)').run(item.id, item.title, 0, item.createdAt);
      return send(201, { task: item });
    }
    const previous = get(id); if (!previous) return fail(404);
    const item = { ...previous, ...body, id: previous.id, createdAt: mutation === 'identity' ? new Date().toISOString() : previous.createdAt };
    if ('title' in body) item.title = body.title.trim();
    db.prepare('UPDATE reference_tasks SET title = ?, completed = ?, createdAt = ? WHERE id = ?').run(item.title, Number(item.completed), item.createdAt, id);
    return send(200, { task: item });
  } catch { fail(500); }
}).listen(Number(process.env.PORT), '127.0.0.1');
