import test from 'node:test'
import assert from 'node:assert/strict'
import {titleCases,orderCases,storageCases,schemaCases,initializationCases} from './domain-cases.ts'
import {STORAGE_KEY,seedTasks,validateTitle,sortTasks,parseTasks,loadTasks,saveTasks} from '../src/tasks.ts'
const task={id:'one',title:'Task',completed:false,createdAt:'2026-01-01T00:00:00.000Z'}
test('AC-03 Unicode boundaries and title canonicalization',()=>titleCases(validateTitle))
test('AC-04 newest first, stable ID tie break, no mutation',()=>orderCases(sortTasks))
test('AC-01 fixed independent seeds, mixed states, one initialization and saved empty list',()=>{
 assert.equal(STORAGE_KEY,'compass-example-react-vite.tasks.v1')
 const first=seedTasks();assert.equal(first.length,3);assert.deepEqual(first,seedTasks());assert.equal(new Set(first.map(t=>t.id)).size,3);assert.ok(first.some(t=>t.completed));assert.ok(first.some(t=>!t.completed));parseTasks(JSON.stringify(first))
 first[0].title='changed';assert.notDeepEqual(first,seedTasks())
 let raw:string|null=null,writes=0;const storage={getItem:()=>raw,setItem:(key:string,value:string)=>{assert.equal(key,STORAGE_KEY);raw=value;writes++}}
 assert.deepEqual(loadTasks(storage),seedTasks());loadTasks(storage);assert.equal(writes,1)
 raw='[]';assert.deepEqual(loadTasks(storage),[]);assert.equal(writes,1)
})
test('AC-03/05 parser allows duplicates titles but rejects invalid data',()=>{
 assert.deepEqual(parseTasks(JSON.stringify([task,{...task,id:'two'}])),[task,{...task,id:'two'}])
 const invalid:any[]=['{','null','{}','[null]',JSON.stringify([{}]),JSON.stringify([task,task])]
 for(const change of [{id:''},{id:1},{title:1},{title:' '},{title:' padded '},{title:'x'.repeat(201)},{completed:1},{createdAt:'2026-02-30T00:00:00.000Z'},{createdAt:'2026-01-01T00:00:00+07:00'},{createdAt:'nonsense'}])invalid.push(JSON.stringify([{...task,...change}]))
 for(const raw of invalid)assert.throws(()=>parseTasks(raw),raw)
})
test('AC-05 no destructive overwrite; read and write errors propagate',()=>{
 let writes=0;assert.throws(()=>loadTasks({getItem:()=>'{',setItem:()=>{writes++}}));assert.equal(writes,0)
 const error=new Error('blocked');assert.throws(()=>loadTasks({getItem:()=>{throw error},setItem:()=>{writes++}}),e=>e===error);assert.equal(writes,0)
 assert.throws(()=>loadTasks({getItem:()=>null,setItem:()=>{throw error}}),e=>e===error)
 assert.throws(()=>saveTasks({setItem:()=>{throw error}},[task]),e=>e===error)
 let stored='';saveTasks({setItem:(key,value)=>{assert.equal(key,STORAGE_KEY);stored=value}},[task]);assert.deepEqual(JSON.parse(stored),[task])
})

test('AC-01/05 shared persistence acceptance cases',()=>storageCases(loadTasks,saveTasks))

test('AC-03/05 shared schema acceptance cases',()=>schemaCases(parseTasks))
test('AC-01 shared initialization acceptance cases',()=>initializationCases(loadTasks,seedTasks))
