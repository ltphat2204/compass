import {successMessagePattern} from './success-message.ts'
import test from 'node:test'
import assert from 'node:assert/strict'
import {titleCases,orderCases,storageCases,schemaCases,initializationCases,crudFilterCases,exampleTask} from './domain-cases.ts'
const correctTitle=(s:string)=>{s=s.trim();if([...s].length<1||[...s].length>200)throw new Error('invalid');return s}
const correctOrder=(ts:any[])=>[...ts].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)||a.id.localeCompare(b.id))
test('spec controls accept canonical Unicode validator and immutable total ordering',()=>{titleCases(correctTitle);orderCases(correctOrder)})
test('spec controls reject UTF-16 length, missing trim, absent ID tie break and mutation',()=>{
 assert.throws(()=>titleCases(s=>{s=s.trim();if(!s.length||s.length>200)throw Error();return s}))
 assert.throws(()=>titleCases(s=>{if(!s.length||[...s].length>200)throw Error();return s}))
 assert.throws(()=>orderCases(ts=>[...ts].sort((a,b)=>b.createdAt.localeCompare(a.createdAt))))
 assert.throws(()=>orderCases(ts=>ts.sort((a,b)=>b.createdAt.localeCompare(a.createdAt)||a.id.localeCompare(b.id))))
})

const referenceSave=(s:any,t:any[])=>s.setItem('key',JSON.stringify(t))
const referenceLoad=(s:any)=>{const raw=s.getItem('key');if(raw===null){const seeds=[{id:'seed'}];referenceSave(s,seeds);return seeds}return JSON.parse(raw)}
test('persistence controls accept propagated errors and preserve explicit empty state',()=>storageCases(referenceLoad,referenceSave))
test('persistence controls reject silent RAM fallback and destructive repair',()=>{
 assert.throws(()=>storageCases((s:any)=>{try{return referenceLoad(s)}catch{return []}},referenceSave))
 assert.throws(()=>storageCases((s:any)=>{try{return referenceLoad(s)}catch{referenceSave(s,[]);return []}},referenceSave))
 assert.throws(()=>storageCases(referenceLoad,()=>{}))
})

const referenceParse=(raw:string)=>{
 const tasks=JSON.parse(raw);if(!Array.isArray(tasks))throw Error('array')
 const ids=new Set()
 for(const t of tasks){if(!t||typeof t.id!=='string'||!t.id||ids.has(t.id)||typeof t.title!=='string'||correctTitle(t.title)!==t.title||typeof t.completed!=='boolean'||typeof t.createdAt!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(t.createdAt)||!Number.isFinite(Date.parse(t.createdAt))||new Date(t.createdAt).toISOString().replace('.000Z','Z')!==t.createdAt.replace('.000Z','Z'))throw Error('schema');ids.add(t.id)}
 return tasks
}
const fixedSeeds=()=>[exampleTask,{...exampleTask,id:'two',completed:true},{...exampleTask,id:'three'}]
const initializingLoad=(s:any)=>{const raw=s.getItem('key');if(raw===null){const tasks=fixedSeeds();referenceSave(s,tasks);return tasks}return referenceParse(raw)}
const referenceTransition=(tasks:any[],action:any)=>{
 if(action.type==='edit')return tasks.map(t=>t.id===action.id?{...t,title:action.title}:t)
 if(action.type==='toggle')return tasks.map(t=>t.id===action.id?{...t,completed:!t.completed}:t)
 if(action.type==='delete')return tasks.filter(t=>t.id!==action.id)
 if(action.type==='filter')return tasks.filter(t=>t.completed===action.completed)
 return tasks
}
test('schema controls accept validated records and reject JSON-only or coercing policies',()=>{
 schemaCases(referenceParse)
 assert.throws(()=>schemaCases(JSON.parse))
 assert.throws(()=>schemaCases(raw=>referenceParse(JSON.stringify(JSON.parse(raw).map((t:any)=>({...t,completed:Boolean(t.completed)}))))))
 assert.throws(()=>schemaCases(raw=>referenceParse(JSON.stringify(JSON.parse(raw).map((t:any)=>({...t,title:t.title?.trim()}))))))
})
test('initialization controls detect reseeding empty arrays and repeated writes',()=>{
 initializationCases(initializingLoad,fixedSeeds)
 assert.throws(()=>initializationCases(s=>{const ts=initializingLoad(s);if(!ts.length){referenceSave(s,fixedSeeds());return fixedSeeds()}return ts},fixedSeeds))
 assert.throws(()=>initializationCases(s=>{const ts=initializingLoad(s);referenceSave(s,ts);return ts},fixedSeeds))
 assert.throws(()=>initializationCases(initializingLoad,()=>fixedSeeds().slice(0,2)))
})
test('CRUD/filter controls detect identity drift, destructive cancel and reversed filtering',()=>{
 crudFilterCases(referenceTransition)
 assert.throws(()=>crudFilterCases((ts,a)=>a.type==='edit'?referenceTransition(ts,a).map(t=>({...t,id:'new'})):referenceTransition(ts,a)))
 assert.throws(()=>crudFilterCases((ts,a)=>a.type==='deleteCancel'?[]:referenceTransition(ts,a)))
 assert.throws(()=>crudFilterCases((ts,a)=>a.type==='filter'?ts.filter(t=>t.completed!==a.completed):referenceTransition(ts,a)))
 assert.throws(()=>crudFilterCases((ts,a)=>a.type==='toggle'?ts:referenceTransition(ts,a)))
})

test('v2 success classification distinguishes positive outcomes from saved-data failure descriptions',()=>{
 for(const text of ['Đã lưu công việc','Đã thêm công việc thành công','Xóa thành công','Thành công'])assert.equal(successMessagePattern.test(text),true,text)
 for(const text of ['Dữ liệu đã lưu không hợp lệ','Không thể lưu công việc','Lưu không thành công','Đã lưu không hợp lệ','Lỗi: chưa lưu được','Lưu thất bại'])assert.equal(successMessagePattern.test(text),false,text)
})
