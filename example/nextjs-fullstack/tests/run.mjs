import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import {transport,error} from './contract.mjs';
import {unchanged} from './outcomes.mjs';

const root=resolve(import.meta.dirname,'..');
const directory=await mkdtemp(join(tmpdir(),'compass-tasks-'));
const db=join(directory,'tasks.sqlite');
const port=process.env.TEST_PORT || '3102';
const base=`http://127.0.0.1:${port}`;
const env={...process.env,DATABASE_PATH:db,TEST_BASE_URL:base};
let server;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function command(cmd) {
  return new Promise((resolve,reject)=>{const child=spawn(cmd,{cwd:root,env,shell:true,stdio:'inherit'});child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(new Error(`Command failed (${code}): ${cmd}`)));});
}
async function start() {
  try {await fetch(base,{signal:AbortSignal.timeout(500)}); throw new Error(`HARNESS: port ${port} already in use; choose TEST_PORT`);} catch(e) {if(e.message.startsWith('HARNESS:'))throw e;}
  server=spawn(process.env.TEST_APP_COMMAND || `pnpm start --hostname 127.0.0.1 --port ${port}`,{cwd:root,env,shell:true,stdio:'inherit',detached:true});
  let spawnError;server.on('error',e=>spawnError=e);
  for(let i=0;i<120;i++) {
    if(spawnError)throw spawnError;
    if(server.exitCode!==null)throw new Error(`HARNESS: application exited before readiness (${server.exitCode})`);
    try {await fetch(base,{signal:AbortSignal.timeout(500)}); return;} catch {await sleep(500);}
  }
  throw new Error('HARNESS: app did not become reachable within 60 seconds');
}
async function stop() {
  if(!server)return;
  const child=server;server=undefined;
  try {process.kill(-child.pid,'SIGTERM');}catch{}
  for(let i=0;i<40&&child.exitCode===null;i++)await sleep(100);
  if(child.exitCode===null){try{process.kill(-child.pid,'SIGKILL');}catch{}}
}
try {
  await command('node --test tests/controls.test.mjs');
  await command(process.env.TEST_SCHEMA_COMMAND || 'pnpm db:init');
  await start();
  const api=transport(base), initial=await api('GET');
  assert.equal(initial.status,200,'AC-03 missing public API behavior');
  unchanged((await initial.json()).tasks,[]);
  await command('node --test tests/api.test.mjs');
  await command('pnpm exec playwright test --config tests/playwright.config.mjs');
  // Verify a real storage write failure, independently of client-side network mocks.
  const lock=new DatabaseSync(db); lock.exec('BEGIN EXCLUSIVE');
  try {await error(await api('POST','',{title:'Must not commit under lock'}),500);} finally {lock.exec('ROLLBACK');lock.close();}
  const afterLock=await api('GET');assert.equal(afterLock.status,200);assert.ok(!(await afterLock.json()).tasks.some(t=>t.title==='Must not commit under lock'));
  const seed=await api('POST','',{title:'Persistent record'});assert.equal(seed.status,201);const saved=(await seed.json()).task;
  const change=await api('PATCH',saved.id,{completed:true});assert.equal(change.status,200);const expected=(await change.json()).task;
  await stop(); await command(process.env.TEST_SCHEMA_COMMAND || 'pnpm db:init'); await start();
  const restarted=await api('GET');assert.equal(restarted.status,200);unchanged((await restarted.json()).tasks.find(t=>t.id===saved.id),expected);
  console.log('AC-04/05: repeated schema, restart persistence, and real SQLite lock failure passed');
} finally {await stop();await rm(directory,{recursive:true,force:true});}
