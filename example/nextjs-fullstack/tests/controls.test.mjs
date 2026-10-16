import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cases} from './contract.mjs';
import {unchanged,pending,failed,tieOrder} from './outcomes.mjs';
// Independent executable model derived only from PRD; never imported by the app.
function reference(defect) {
  let tasks = [], sequence = 0;
  return async (method='GET',id='',input,type='application/json',raw=false) => {
    const fail = status => Response.json({error:{code:`E${status}`,message:'Yêu cầu không hợp lệ'}},{status});
    if(method==='GET') return Response.json({tasks:defect==='omit'?tasks.filter(t=>t.title!=='Order B'):defect==='order'?[...tasks]:[...tasks].reverse()});
    if(method==='DELETE') {
      if(!tasks.some(t=>t.id===id)) return defect==='delete-idempotent'?new Response(null,{status:204}):fail(404);
      tasks=tasks.filter(t=>t.id!==id); return new Response(null,{status:204});
    }
    if(type!=='application/json') return fail(defect==='content-type'?400:415);
    let body=input;
    if(raw) { try {body=JSON.parse(input);} catch {return fail(400);} }
    if(!body || typeof body!=='object' || Array.isArray(body)) return fail(400);
    const fields=Object.keys(body), allowed=method==='POST'?['title']:['title','completed'];
    if((!fields.length && defect!=='empty-patch') || (defect!=='unknown' && fields.some(k=>!allowed.includes(k)))) return fail(400);
    if(method==='POST' && !Object.hasOwn(body,'title')) return fail(400);
    if(Object.hasOwn(body,'completed') && typeof body.completed!=='boolean' && defect!=='boolean') return fail(400);
    if(Object.hasOwn(body,'title')) {
      if(typeof body.title!=='string') return fail(400);
      const normalized=body.title.trim();
      const length=defect==='utf16'?normalized.length:[...normalized].length;
      if(length<(defect==='empty-title'?0:1) || length>(defect==='length'?201:200)) return fail(400);
      body={...body,title:defect==='trim'?body.title:normalized};
    }
    if(method==='POST') {
      const task={id:String(++sequence),title:body.title,completed:defect==='default',createdAt:new Date().toISOString()};
      tasks.push(task); return Response.json({task},{status:201});
    }
    const index=tasks.findIndex(t=>t.id===id); if(index<0) return fail(404);
    tasks[index]={...tasks[index],...body,...(defect==='identity'?{createdAt:'2000-01-01T00:00:00Z'}:{})};
    return Response.json({task:tasks[index]});
  };
}
for(const [name, run] of Object.entries(cases)) test(`correct reference accepts ${name}`,()=>run(reference()));
for(const defect of ['trim','default','identity','utf16','unknown','empty-title','length','empty-patch','boolean','content-type','order','delete-idempotent','omit']) test(`relevant assertion rejects ${defect}`, async()=>{
  const index=['utf16','empty-title','length'].includes(defect)?1:['unknown','empty-patch','boolean'].includes(defect)?2:defect==='content-type'?3:['order','delete-idempotent','omit'].includes(defect)?4:0;
  await assert.rejects(Object.values(cases)[index](reference(defect)),{name:'AssertionError'});
});

// These small independent state adapters model only PRD actions, not production code.
// The same outcome assertions inspect real browser/process observations in ui.spec/run.
function lifecycle(defect) {
  let disk=[],memory=[];
  return {
    init(){if(defect==='destructive-init')disk=[];},
    save(value){memory=structuredClone(value);if(defect!=='volatile')disk=structuredClone(value);},
    restart(){memory=structuredClone(disk);},
    read(){return structuredClone(memory);}
  };
}
function persistenceScenario(defect) {
  const store=lifecycle(defect), expected=[{id:'persist',title:'Đã lưu',completed:true,createdAt:'2026-10-15T00:00:00Z'}];
  store.init();unchanged(store.read(),[]);store.save(expected);store.init();store.restart();unchanged(store.read(),expected);
}
test('correct independent persistence/repeated-schema reference accepted',()=>persistenceScenario());
for(const defect of ['volatile','destructive-init'])test(`reject ${defect} through shared persistence assertion`,()=>assert.throws(()=>persistenceScenario(defect),{name:'AssertionError'}));
function interaction(defect) {
  const original={visible:true,checked:false,replacement:false};let view={...original},calls=0,input='Chưa lưu';
  return {
    original,
    cancel(){if(defect==='cancel')view.visible=false;return {...view};},
    begin(){calls++;if(defect==='optimistic')view.checked=true;return {view:{...view},disabled:defect!=='unlocked'};},
    reject(){if(defect==='false-success')view.visible=false;if(defect==='retry')calls++;if(defect==='clear-input')input='';return {view:{...view},calls,input};}
  };
}
function failureScenario(defect) {const ui=interaction(defect);pending(ui.begin(),ui.original);failed(ui.reject(),ui.original,'Chưa lưu');}
test('correct independent pending/failure reference accepted',()=>failureScenario());
for(const defect of ['optimistic','unlocked','false-success','retry','clear-input'])test(`reject ${defect} through shared mutation assertion`,()=>assert.throws(()=>failureScenario(defect),{name:'AssertionError'}));
for(const defect of [undefined,'cancel'])test(`${defect?'reject mutated':'accept correct'} cancellation reference`,()=>{
  const ui=interaction(defect),run=()=>unchanged(ui.cancel(),ui.original);if(defect)assert.throws(run,{name:'AssertionError'});else run();
});
const tied=ids=>ids.map(id=>({id,title:id,completed:false,createdAt:'2026-10-15T00:00:00Z'}));
test('equal-createdAt fixture accepts both fixed ID directions',()=>{tieOrder(tied(['a','b','c']));tieOrder(tied(['c','b','a']));});
test('equal-createdAt fixture rejects insertion order and changing tie order',()=>{
  assert.throws(()=>tieOrder(tied(['b','a','c'])),{name:'AssertionError'});
  assert.throws(()=>tieOrder(tied(['a','b','c']),tied(['c','b','a'])),{name:'AssertionError'});
});
