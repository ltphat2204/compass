import {test,expect} from '@playwright/test'
import {successMessagePattern} from './success-message.ts'
import {editTransition,filterTransition,cancellationTransition} from './domain-cases.ts'
const key='compass-example-react-vite.tasks.v1'
const row=(id:string,title:string,completed=false,createdAt='2026-01-01T00:00:00.000Z')=>({id,title,completed,createdAt})
async function stored(page:any){return page.evaluate((k:string)=>JSON.parse(localStorage.getItem(k)!),key)}
async function seed(page:any,tasks:any[]){await page.addInitScript(({key,tasks})=>{if(!sessionStorage.getItem('acceptance-fixture')){localStorage.setItem(key,JSON.stringify(tasks));sessionStorage.setItem('acceptance-fixture','yes')}},{key,tasks});await page.goto('/')}
const addInput=(page:any)=>page.getByRole('textbox',{name:/tiêu đề|công việc|việc cần làm/i}).first()
const addButton=(page:any)=>page.getByRole('button',{name:/^Thêm$/i})

const requests=new WeakMap<object,string[]>()
test.beforeEach(async({page})=>{const business:string[]=[];requests.set(page,business);page.on('request',r=>{if(['fetch','xhr'].includes(r.resourceType()))business.push(r.url())})})
test.afterEach(async({page})=>{expect(requests.get(page)).toEqual([])})
async function expectFailure(page:any){
 const reporting=page.getByRole('alert').or(page.getByRole('status'))
 await expect(reporting.filter({hasText:/lỗi|không thể|thất bại|hợp lệ|200|trống|bắt buộc/i}).first()).toBeVisible()
 await expect(reporting.filter({hasText:successMessagePattern})).toHaveCount(0)
}
test('AC-01 fresh seeds, delete all and reload preserves empty',async({page})=>{
 await page.goto('/');expect(await stored(page)).toHaveLength(3)
 page.on('dialog',d=>d.accept())
 for(let i=0;i<3;i++)await page.getByRole('button',{name:/^Xóa$/i}).first().click()
 expect(await stored(page)).toEqual([]);await page.reload();expect(await stored(page)).toEqual([]);await expect(page.getByRole('button',{name:/^Xóa$/i})).toHaveCount(0)
})
test('AC-02/03/04 CRUD, cancellation, duplicate titles, identity and filtering',async({page})=>{
 await seed(page,[])
 await addInput(page).fill('  Alpha  ');await addButton(page).click();expect(await stored(page)).toHaveLength(1);await expect(addInput(page)).toHaveValue('')
 const original=(await stored(page))[0];expect(original.title).toBe('Alpha');expect(original.completed).toBe(false)
 await page.getByRole('button',{name:/^Sửa$/i}).click();await page.getByRole('textbox',{name:/tiêu đề|công việc|việc cần làm/i}).last().fill('Cancelled');await page.getByRole('button',{name:/^Hủy$/i}).click();cancellationTransition([original],await stored(page))
 await page.getByRole('button',{name:/^Sửa$/i}).click();await page.getByRole('textbox',{name:/tiêu đề|công việc|việc cần làm/i}).last().fill('  Beta  ');await page.getByRole('button',{name:/^Lưu$/i}).click();editTransition(original,(await stored(page))[0],'Beta')
 await addInput(page).fill('Beta');await addButton(page).click();expect(await stored(page)).toHaveLength(2)
 await page.getByRole('checkbox').first().check();expect((await stored(page)).filter((t:any)=>t.completed)).toHaveLength(1)
 const beforeFilter=await stored(page);await page.getByRole('button',{name:/^Chưa hoàn thành$/i}).click();cancellationTransition(beforeFilter,await stored(page));await expect(page.getByRole('checkbox')).toHaveCount(1)
 await page.getByRole('checkbox').click();await expect(page.getByRole('checkbox')).toHaveCount(0);expect((await stored(page)).filter((t:any)=>t.completed)).toHaveLength(2)
 const beforeDoneFilter=await stored(page);await page.getByRole('button',{name:/^Đã hoàn thành$/i}).click();cancellationTransition(beforeDoneFilter,await stored(page));await expect(page.getByRole('checkbox')).toHaveCount(2)
 await page.getByRole('checkbox').first().click();await expect(page.getByRole('checkbox')).toHaveCount(1);expect((await stored(page)).filter((t:any)=>!t.completed)).toHaveLength(1)
 const beforeAllFilter=await stored(page);await page.getByRole('button',{name:/^Tất cả$/i}).click();cancellationTransition(beforeAllFilter,await stored(page));await expect(page.getByRole('checkbox')).toHaveCount(2)
 const before=await stored(page);page.once('dialog',d=>d.dismiss());await page.getByRole('button',{name:/^Xóa$/i}).first().click();cancellationTransition(before,await stored(page))
 await page.reload();cancellationTransition(before,await stored(page))
})
test('AC-03 UI rejects whitespace and 201 code points and accepts 200 Unicode',async({page})=>{
 await seed(page,[])
 for(const text of ['   ','😀'.repeat(201)]){await addInput(page).fill(text);await addButton(page).click();expect(await stored(page)).toEqual([]);await expect(addInput(page)).toHaveValue(text);await expectFailure(page)}
 await addInput(page).fill('😀'.repeat(200));await addButton(page).click();expect((await stored(page))[0].title).toBe('😀'.repeat(200))
})
test('AC-05 corrupt storage remains intact until reset confirmation',async({page})=>{
 await page.addInitScript(k=>localStorage.setItem(k,'{'),key);await page.goto('/')
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe('{')
 await expectFailure(page)
 const reset=page.getByRole('button',{name:/đặt lại|khôi phục/i});await expect(reset).toBeVisible()
 page.once('dialog',d=>d.dismiss());await reset.click();expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe('{')
 page.once('dialog',d=>d.accept());await reset.click();expect(await stored(page)).toHaveLength(3)
})
test('AC-05 read error prevents writes',async({page})=>{
 await page.addInitScript(()=>{(window as any).__writes=0;Storage.prototype.getItem=()=>{throw Error('blocked')};Storage.prototype.setItem=()=>{(window as any).__writes++}})
 await page.goto('/');await expectFailure(page);expect(await page.evaluate(()=>(window as any).__writes)).toBe(0)
 await expect(addButton(page)).toBeDisabled()
})
test('AC-05 write failure retains list/input and retry succeeds',async({page})=>{
 await seed(page,[row('one','Original')])
 await page.evaluate(()=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(!(window as any).__retry)throw Error('quota');return original.call(this,k,v)}})
 await addInput(page).fill('Unsaved');await addButton(page).click();expect((await stored(page)).map((t:any)=>t.title)).toEqual(['Original']);await expect(addInput(page)).toHaveValue('Unsaved');await expectFailure(page)
 await page.evaluate(()=>(window as any).__retry=true);await addButton(page).click();expect((await stored(page)).map((t:any)=>t.title)).toContain('Unsaved')
})
test('AC-04/06/07 order, literal HTML, responsive, keyboard and no business network',async({page})=>{
 const requests:string[]=[];page.on('request',r=>{if(['fetch','xhr'].includes(r.resourceType()))requests.push(r.url())})
 await seed(page,[row('b','Second'),row('a','First'),row('z','Newest',true,'2026-02-01T00:00:00.000Z')])
 const newest=await page.getByText('Newest',{exact:true}).boundingBox(),first=await page.getByText('First',{exact:true}).boundingBox(),second=await page.getByText('Second',{exact:true}).boundingBox();expect(newest!.y).toBeLessThan(first!.y);expect(first!.y).toBeLessThan(second!.y)
 for(const width of [360,1280]){await page.setViewportSize({width,height:800});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)}
 await addInput(page).fill('<img src=x onerror="window.__executed=true">');await addInput(page).press('Enter');await expect(page.getByText('<img src=x onerror="window.__executed=true">',{exact:true})).toBeVisible();expect(await page.evaluate(()=>(window as any).__executed)).toBeUndefined()
 await addInput(page).focus();await page.keyboard.press('Tab');await expect(addButton(page)).toBeFocused();expect(await addButton(page).evaluate(e=>{const s=getComputedStyle(e);return s.outlineStyle!=='none'||s.boxShadow!=='none'})).toBe(true)
 expect(requests).toEqual([])
})

test('AC-05 malformed schema is preserved and reported',async({page})=>{
 const raw=JSON.stringify([{id:'bad',title:'Title',completed:'yes',createdAt:'2026-01-01T00:00:00.000Z'}])
 await page.addInitScript(({key,raw})=>localStorage.setItem(key,raw),{key,raw});await page.goto('/')
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(raw);await expectFailure(page)
})
test('AC-05 failed edit, toggle and delete do not commit UI or storage',async({page})=>{
 const initial=[row('one','Original')];await seed(page,initial)
 await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw Error('quota')}})
 await page.getByRole('button',{name:/^Sửa$/i}).click();await page.getByRole('textbox',{name:/tiêu đề|công việc|việc cần làm/i}).last().fill('Changed');await page.getByRole('button',{name:/^Lưu$/i}).click();expect(await stored(page)).toEqual(initial);await expect(page.getByRole('textbox',{name:/tiêu đề|công việc|việc cần làm/i}).last()).toHaveValue('Changed');await expectFailure(page)
 await page.getByRole('button',{name:/^Hủy$/i}).click();await page.getByRole('checkbox').click();await expect(page.getByRole('checkbox')).not.toBeChecked();expect(await stored(page)).toEqual(initial);await expectFailure(page)
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:/^Xóa$/i}).click();expect(await stored(page)).toEqual(initial);await expect(page.getByText('Original',{exact:true})).toBeVisible();await expectFailure(page)
})

test('AC-04 distinct empty-list and filter-no-results messages',async({page})=>{
 await seed(page,[])
 const empty=page.getByText(/chưa có.*(?:công việc|việc)|danh sách.*trống|không có.*công việc/i).first()
 await expect(empty).toBeVisible();const emptyText=await empty.textContent()
 await addInput(page).fill('Only pending');await addButton(page).click()
 const all=await stored(page)
 await page.getByRole('button',{name:/^Đã hoàn thành$/i}).click();await expect(page.getByRole('checkbox')).toHaveCount(0)
 const noResults=page.getByText(/không có.*(?:phù hợp|hoàn thành|kết quả)|không.*kết quả|chưa có.*hoàn thành/i).first()
 await expect(noResults).toBeVisible();expect(await noResults.textContent()).not.toBe(emptyText)
 cancellationTransition(all,await stored(page));filterTransition(all,[],true)
})
test('AC-05 confirmed reset write failure preserves damaged storage and reports failure',async({page})=>{
 await page.addInitScript(k=>{localStorage.setItem(k,'{');Storage.prototype.setItem=()=>{throw Error('quota')}},key);await page.goto('/')
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:/đặt lại|khôi phục/i}).click()
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe('{');await expectFailure(page)
})

test('AC-03 invalid edit retains original and entered title with reported validation error',async({page})=>{
 const initial=[row('one','Original')];await seed(page,initial)
 await page.getByRole('button',{name:/^Sửa$/i}).click()
 const edit=page.getByRole('textbox',{name:/tiêu đề|công việc|việc cần làm/i}).last()
 for(const title of ['   ','😀'.repeat(201)]){await edit.fill(title);await page.getByRole('button',{name:/^Lưu$/i}).click();cancellationTransition(initial,await stored(page));await expect(edit).toHaveValue(title);await expectFailure(page)}
 await page.getByRole('button',{name:/^Hủy$/i}).click();cancellationTransition(initial,await stored(page))
})
