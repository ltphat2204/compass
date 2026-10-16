import assert from 'node:assert/strict';
import {tieOrder} from './outcomes.mjs';

export function task(value, title) {
  assert.ok((typeof value.id === 'string' && value.id.length > 0) || (typeof value.id === 'number' && Number.isFinite(value.id)));
  assert.equal(value.title, title); assert.equal(typeof value.completed, 'boolean');
  assert.match(value.createdAt, /^\d{4}-\d{2}-\d{2}T.*Z$/);
  assert.ok(Number.isFinite(Date.parse(value.createdAt)));
}
export async function error(response, status) {
  assert.equal(response.status, status);
  const body = await response.json();
  assert.equal(typeof body.error.code, 'string'); assert.ok(body.error.code);
  assert.equal(typeof body.error.message, 'string'); assert.ok(body.error.message);
  assert.doesNotMatch(JSON.stringify(body), /SQLITE_|SELECT .+ FROM|INSERT INTO|node_modules|\bat .+\(.*:\d+|\/Users\/|\/home\//i);
}
export const cases = {
  'AC-02 trim, duplicates, interior whitespace, default state and immutable identity': async (api) => {
    const title = 'Mua  sữa';
    const a = await api('POST', '', {title: `  ${title}  `}); assert.equal(a.status, 201);
    const original = (await a.json()).task; task(original, title); assert.equal(original.completed, false);
    const b = await api('POST', '', {title}); assert.equal(b.status, 201);
    assert.notEqual((await b.json()).task.id, original.id);
    const edit = await api('PATCH', original.id, {title:'  Đã sửa  ', completed:true}); assert.equal(edit.status, 200);
    const updated = (await edit.json()).task; task(updated, 'Đã sửa');
    assert.equal(updated.id, original.id); assert.equal(updated.createdAt, original.createdAt); assert.equal(updated.completed, true);
    const reopened = await api('PATCH', original.id, {completed:false}); assert.equal(reopened.status, 200); const saved=(await reopened.json()).task; assert.equal(saved.completed,false); const read=await api('GET');assert.equal(read.status,200);assert.deepEqual((await read.json()).tasks.find(t=>t.id===saved.id),saved);
  },
  'AC-02 Unicode code-point boundary': async (api) => {
    for (const title of ['x', 'x'.repeat(200), '😀'.repeat(200)]) {
      const r = await api('POST', '', {title}); assert.equal(r.status, 201); task((await r.json()).task, title);
    }
    for (const title of ['', ' \t\n ', 'x'.repeat(201), '😀'.repeat(201)]) await error(await api('POST', '', {title}), 400);
  },
  'AC-02 strict POST and PATCH objects, unknown fields and wrong types': async (api) => {
    const created = await api('POST', '', {title:'Validation'}); assert.equal(created.status, 201); const original = (await created.json()).task;
    for (const body of [null, [], 'title', {}, {title:null}, {title:3}, {title:true}, {title:'ok',completed:false}, {title:'ok',id:'client'}, {title:'ok',createdAt:'2020-01-01T00:00:00Z'}]) await error(await api('POST','',body),400);
    for (const body of [null, [], 'title', {}, {unknown:1}, {completed:null}, {completed:0}, {completed:'true'}, {title:null}, {title:8}, {title:''}, {title:' '.repeat(4)}, {title:'😀'.repeat(201)}, {title:'changed',unknown:1}, {id:'replacement'}, {createdAt:'2020-01-01T00:00:00Z'}]) await error(await api('PATCH',original.id,body),400);
    const list = await api('GET'); assert.equal(list.status,200); assert.deepEqual((await list.json()).tasks.find(t => t.id === original.id), original);
  },
  'AC-03 malformed JSON and unsupported content type': async (api) => {
    const r = await api('POST','',{title:'Transport'}); assert.equal(r.status,201); const id = (await r.json()).task.id;
    for (const [method, path] of [['POST',''],['PATCH',id]]) {
      await error(await api(method,path,'{', 'application/json', true),400);
      await error(await api(method,path,'title=hello','text/plain',true),415);
    }
  },
  'AC-03/06 fresh GET, ordering, DELETE and missing IDs': async (api) => {
    const before = Date.now();
    const a = await api('POST','',{title:'Order A'}); assert.equal(a.status,201); const first = (await a.json()).task;
    await new Promise(r => setTimeout(r, 15));
    const b = await api('POST','',{title:'Order B'}); assert.equal(b.status,201); const second = (await b.json()).task;
    assert.ok(Date.parse(first.createdAt) >= before - 1000); assert.ok(Date.parse(second.createdAt) <= Date.now() + 1000);
    const read = async () => { const r = await api('GET'); assert.equal(r.status,200); const body = await r.json(); assert.ok(Array.isArray(body.tasks)); return body.tasks; };
    const list = await read(); assert.deepEqual(list.find(t=>t.id===first.id),first); assert.deepEqual(list.find(t=>t.id===second.id),second); assert.ok(list.findIndex(t=>t.id===second.id) < list.findIndex(t=>t.id===first.id));
    for(let i=1;i<list.length;i++) assert.ok(Date.parse(list[i-1].createdAt)>=Date.parse(list[i].createdAt));
    const repeated=await read(); assert.deepEqual(repeated,list); tieOrder(list); tieOrder(repeated,list);
    const deleted=await api('DELETE',first.id); assert.equal(deleted.status,204); assert.equal(await deleted.text(),'');
    assert.ok(!(await read()).some(t=>t.id===first.id));
    await error(await api('DELETE',first.id),404); await error(await api('PATCH',first.id,{completed:true}),404);
  }
};
export function transport(base) {
  return (method='GET',id='',body,contentType='application/json',raw=false) => fetch(`${base}/api/tasks${id ? `/${encodeURIComponent(id)}` : ''}`, {
    method, headers:body === undefined ? {} : {'content-type':contentType}, body:body === undefined ? undefined : raw ? body : JSON.stringify(body), signal:AbortSignal.timeout(30000)
  });
}
