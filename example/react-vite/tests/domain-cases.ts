import assert from 'node:assert/strict'
export function titleCases(validate: (s:string)=>string) {
  assert.equal(validate('  Mua  sữa  '), 'Mua  sữa')
  assert.equal(validate('x'), 'x')
  assert.equal(validate('😀'.repeat(200)), '😀'.repeat(200))
  for (const value of ['', '   ', 'x'.repeat(201), '😀'.repeat(201)]) assert.throws(()=>validate(value))
}
export function orderCases(sort: (tasks:any[])=>any[]) {
  const tasks=[{id:'b',createdAt:'2026-01-01T00:00:00.000Z'},{id:'z',createdAt:'2026-01-02T00:00:00.000Z'},{id:'a',createdAt:'2026-01-01T00:00:00.000Z'}]
  assert.deepEqual(sort(tasks).map(t=>t.id), ['z','a','b'])
  assert.deepEqual(tasks.map(t=>t.id), ['b','z','a'])
  assert.notEqual(sort(tasks), tasks)
}

export function storageCases(load:(storage:any)=>any[],save:(storage:any,tasks:any[])=>void) {
 const error=new Error('blocked');let writes=0
 assert.throws(()=>load({getItem:()=>{throw error},setItem:()=>{writes++}}),e=>e===error);assert.equal(writes,0)
 assert.throws(()=>load({getItem:()=>'{',setItem:()=>{writes++}}));assert.equal(writes,0)
 assert.throws(()=>load({getItem:()=>null,setItem:()=>{throw error}}),e=>e===error)
 assert.throws(()=>save({setItem:()=>{throw error}},[]),e=>e===error)
 assert.deepEqual(load({getItem:()=>'[]',setItem:()=>{writes++}}),[]);assert.equal(writes,0)
}

export const exampleTask={id:'one',title:'Task',completed:false,createdAt:'2026-01-01T00:00:00.000Z'}
export function schemaCases(parse:(raw:string)=>any[]) {
 const task=exampleTask
 assert.deepEqual(parse(JSON.stringify([task,{...task,id:'two'}])),[task,{...task,id:'two'}])
 assert.deepEqual(parse('[]'),[])
 const invalid=['{','null','{}','[null]',JSON.stringify([{}]),JSON.stringify([task,task])]
 for(const change of [{id:''},{id:1},{title:1},{title:' '},{title:' padded '},{title:'x'.repeat(201)},{completed:1},{createdAt:'2026-02-30T00:00:00.000Z'},{createdAt:'2026-01-01T00:00:00+07:00'},{createdAt:'nonsense'}])invalid.push(JSON.stringify([{...task,...change}]))
 for(const raw of invalid)assert.throws(()=>parse(raw),raw)
}
export function initializationCases(load:(storage:any)=>any[],seeds:()=>any[]) {
 const fixed=seeds();assert.equal(fixed.length,3);assert.deepEqual(fixed,seeds());assert.equal(new Set(fixed.map(t=>t.id)).size,3);assert.ok(fixed.some(t=>t.completed));assert.ok(fixed.some(t=>!t.completed))
 let raw:string|null=null,writes=0;const storage={getItem:()=>raw,setItem:(_key:string,value:string)=>{raw=value;writes++}}
 assert.deepEqual(load(storage),fixed);assert.equal(writes,1);assert.deepEqual(load(storage),fixed);assert.equal(writes,1)
 raw='[]';assert.deepEqual(load(storage),[]);assert.equal(writes,1)
}
export function editTransition(before:any,after:any,title:string){assert.deepEqual(after,{...before,title})}
export function filterTransition(all:any[],visible:any[],completed:boolean){assert.deepEqual(visible.map(t=>t.id),all.filter(t=>t.completed===completed).map(t=>t.id))}
export function cancellationTransition(before:any[],after:any[]){assert.deepEqual(after,before)}
export function crudFilterCases(transition:(tasks:any[],action:any)=>any[]) {
 const initial=[exampleTask]
 const edited=transition(initial,{type:'edit',id:'one',title:'Changed'});editTransition(initial[0],edited[0],'Changed')
 cancellationTransition(initial,transition(initial,{type:'cancel'}))
 const done=transition(initial,{type:'toggle',id:'one'});assert.deepEqual(done,[{...exampleTask,completed:true}])
 filterTransition(done,transition(done,{type:'filter',completed:false}),false)
 assert.deepEqual(transition(done,{type:'toggle',id:'one'}),initial)
 assert.deepEqual(transition(initial,{type:'delete',id:'one'}),[])
 cancellationTransition(initial,transition(initial,{type:'deleteCancel',id:'one'}))
}
