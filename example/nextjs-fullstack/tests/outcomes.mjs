import assert from 'node:assert/strict';
export function unchanged(actual, expected) {assert.deepEqual(actual,expected,'saved or canceled state must be preserved');}
export function pending(actual, expected) {assert.equal(actual.disabled,true,'pending sender must be disabled');unchanged(actual.view,expected);}
export function failed(actual, expected, input) {
  unchanged(actual.view,expected);assert.equal(actual.calls,1,'failed mutation must not retry automatically');
  if(input!==undefined)assert.equal(actual.input,input,'failed save must retain input');
}
export function tieOrder(tasks, previous) {
  if(previous)assert.deepEqual(tasks.map(t=>t.id),previous.map(t=>t.id),'repeated GET must preserve tie order');
  const groups=Map.groupBy(tasks,t=>t.createdAt);
  for(const group of groups.values()) {
    const ids=group.map(t=>t.id); if(ids.length<3)continue;
    const sorted=[...ids].sort((a,b)=>a<b?-1:a>b?1:0);
    assert.ok(JSON.stringify(ids)===JSON.stringify(sorted)||JSON.stringify(ids)===JSON.stringify(sorted.reverse()),'equal timestamps must use ID as secondary order (either direction)');
  }
}
