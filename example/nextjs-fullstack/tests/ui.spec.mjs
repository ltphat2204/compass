import {test,expect} from '@playwright/test';
import {unchanged,pending,failed} from './outcomes.mjs';
const tasksUrl='**/api/tasks';
const titleInput=page=>page.getByRole('textbox').first();
const addButton=page=>page.getByRole('button',{name:/^Thêm(?: công việc)?$/i});
async function filter(page,name) {
  const control=page.getByRole('button',{name}).or(page.getByRole('tab',{name})).or(page.getByRole('radio',{name})).or(page.getByRole('link',{name}));
  if(await control.count())return control.click();
  const select=page.getByRole('combobox'); const options=await select.locator('option').evaluateAll(options=>options.map(o=>({value:o.value,text:o.textContent})));
  const option=options.find(o=>name.test(o.text.trim())); expect(option).toBeTruthy(); await select.selectOption(option.value);
}
// Track the control's DOM position rather than a progress-dependent accessible name.
async function stableControl(page,locator) {
  const {tag,index}=await locator.evaluate(e=>({tag:e.tagName,index:[...document.querySelectorAll(e.tagName)].indexOf(e)}));
  return page.locator(tag).nth(index);
}
async function messages(page) {
  return page.evaluate(()=>{
    const elements=new Set(document.querySelectorAll('[role="alert"],[role="status"]'));
    for(const input of document.querySelectorAll('input[aria-describedby],input[aria-errormessage]'))for(const id of [input.getAttribute('aria-describedby'),input.getAttribute('aria-errormessage')].filter(Boolean).join(' ').split(/\s+/)) {
      const element=document.getElementById(id);if(element)elements.add(element);
    }
    return [...elements].filter(e=>e.getClientRects().length).map(e=>e.textContent.trim()).filter(Boolean);
  });
}
function failedRequest(page, matches) {
  return new Promise(resolve=>{
    const cleanup=()=>{page.off('requestfinished',finished);page.off('requestfailed',aborted);};
    const finished=async request=>{if(matches(request)){cleanup();resolve({status:(await request.response()).status()});}};
    const aborted=request=>{if(matches(request)){cleanup();resolve({failed:true});}};
    page.on('requestfinished',finished);page.on('requestfailed',aborted);
  });
}
async function announcedFailure(page,before,settled,timeout=5000) {
  const outcome=await settled;expect(outcome.failed===true||outcome.status>=400).toBe(true);
  await expect.poll(async()=>(await messages(page)).some(message=>
    !before.includes(message)&&!/^đang\b/iu.test(message)&&
    /lỗi|thất bại|không thể|không (?:hợp lệ|tồn tại)|không[^.!?]{0,80}được|bị từ chối|gián đoạn|mất kết nối|ngoại tuyến|(?:chưa|không) (?:biết|rõ|xác định)|tải lại|thử lại|kiểm tra lại/iu.test(message)
  ),{timeout}).toBe(true);
}
async function ready(page) {
  await expect(page.getByText(/chưa có công việc|danh sách trống|không có công việc/i).first()).toBeVisible();
  await expect(addButton(page)).toBeEnabled();
}
async function reset(request) {
  const response=await request.get('/api/tasks'); expect(response.status()).toBe(200);
  for(const task of (await response.json()).tasks) expect((await request.delete(`/api/tasks/${encodeURIComponent(task.id)}`)).status()).toBe(204);
}
async function add(page,title) { await titleInput(page).fill(title); await addButton(page).click(); await expect(page.getByText(title,{exact:true})).toBeVisible(); }
function row(page,title) {
  // The narrowest semantic container containing both the task text and its edit action.
  return page.getByText(title,{exact:true}).locator('xpath=ancestor::*[.//button[normalize-space()="Sửa"]][1]');
}
async function list(request) {const r=await request.get('/api/tasks'); expect(r.status()).toBe(200); return (await r.json()).tasks;}
test.beforeEach(async({request},info)=>{if(!info.title.startsWith('HARNESS'))await reset(request);});
test('AC-01/06 complete CRUD, cancellation, filters, fresh reload without localStorage',async({page,request})=>{
  await page.addInitScript(()=>{Storage.prototype.setItem=function(){throw new Error('Task storage must use the server');};});
  await page.goto('/');
  await expect(page.getByRole('heading').first()).toBeVisible();
  await expect(page.getByText(/chưa có công việc|danh sách trống|không có công việc/i)).toBeVisible();
  const emptyText=(await page.getByText(/chưa có công việc|danh sách trống|không có công việc/i).first().textContent()).trim();
  await add(page,'Mua sữa'); await expect(titleInput(page)).toHaveValue(''); const beforeCancel=await list(request);
  const item=row(page,'Mua sữa'); await item.getByRole('button',{name:/^Sửa$/i}).click();
  const edit=page.getByRole('textbox').last(); await edit.fill('Bỏ thay đổi'); await page.getByRole('button',{name:/^Hủy$/i}).click();
  await expect(page.getByText('Mua sữa',{exact:true})).toBeVisible(); unchanged(await list(request),beforeCancel);
  await item.getByRole('button',{name:/^Sửa$/i}).click(); await edit.fill('Đọc sách'); await page.getByRole('button',{name:/^Lưu$/i}).click();
  await expect(page.getByText('Đọc sách',{exact:true})).toBeVisible();
  await filter(page,/^Chưa hoàn thành$/i); await row(page,'Đọc sách').getByRole('checkbox').click();
  await expect.poll(async()=>(await list(request))[0].completed).toBe(true);
  await expect(page.getByText('Đọc sách',{exact:true})).toHaveCount(0);
  const filteredMessage=page.getByText(/không có|chưa có|trống/i).filter({hasNot:page.getByRole('button')}).first();
  await expect(filteredMessage).toBeVisible(); expect((await filteredMessage.textContent()).trim()).not.toBe(emptyText);
  await filter(page,/^Đã hoàn thành$/i); await expect(page.getByText('Đọc sách',{exact:true})).toBeVisible();
  await row(page,'Đọc sách').getByRole('checkbox').click(); await expect.poll(async()=>(await list(request))[0].completed).toBe(false); await expect(page.getByText('Đọc sách',{exact:true})).toHaveCount(0);
  await filter(page,/^Tất cả$/i);
  await page.reload(); await expect(page.getByText('Đọc sách',{exact:true})).toBeVisible();
  const beforeDeleteCancel=await list(request); page.once('dialog',dialog=>dialog.dismiss());
  const deletion=row(page,'Đọc sách').getByRole('button',{name:/^Xóa$/i}); await deletion.click(); page.removeAllListeners('dialog');
  const confirmation=page.getByRole('dialog').or(page.getByRole('alertdialog'));
  if(await confirmation.count()) await confirmation.getByRole('button',{name:/hủy|không/i}).click();
  await expect(page.getByText('Đọc sách',{exact:true})).toBeVisible(); unchanged(await list(request),beforeDeleteCancel);
  page.once('dialog',dialog=>dialog.accept()); await deletion.click(); page.removeAllListeners('dialog');
  if(await confirmation.count()) await confirmation.getByRole('button',{name:/xóa|xác nhận|đồng ý/i}).click();
  await expect(page.getByText('Đọc sách',{exact:true})).toHaveCount(0); expect(await list(request)).toHaveLength(0);
});
test('AC-05 loading, GET error and retry',async({page})=>{
  let release; const gate=new Promise(r=>release=r); let fail=true;
  await page.route(tasksUrl,async route=>{await gate;if(fail)await route.fulfill({status:500,json:{error:{code:'STORAGE_ERROR',message:'Không thể tải công việc'}}});else await route.continue();});
  await page.goto('/'); await expect(page.getByText(/đang tải/i)).toBeVisible(); release();
  const retry=page.getByRole('button',{name:/thử lại|tải lại/i}); await expect(retry).toBeVisible(); fail=false; await retry.click();
  await expect(page.getByText(/chưa có công việc|danh sách trống|không có công việc/i)).toBeVisible();
});
for(const failure of ['400','404','500','connection','lost-response']) test(`AC-05 mutation ${failure}, no automatic retries and no false state`,async({page,request})=>{
  await page.goto('/'); await ready(page); const beforeMessages=await messages(page);
  const sender=await stableControl(page,addButton(page));
  const settled=failedRequest(page,req=>req.method()==='POST'&&new URL(req.url()).pathname==='/api/tasks');
  let intercepted; const received=new Promise(resolve=>intercepted=resolve);
  let calls=0, release; const gate=new Promise(r=>release=r);
  await page.route(tasksUrl,async route=>{
    if(route.request().method()!=='POST')return route.continue();
    calls++; intercepted(); await gate;
    if(failure==='lost-response'){await route.fetch();return route.abort('connectionreset');}
    if(failure==='connection')return route.abort('connectionreset');
    return route.fulfill({status:Number(failure),json:{error:{code:`E${failure}`,message:'Không thể lưu công việc'}}});
  });
  await titleInput(page).fill('Giữ nội dung'); await sender.click(); await received;
  let pendingMessages;
  try {await expect(sender).toBeDisabled();await expect(page.getByText('Giữ nội dung',{exact:true})).toHaveCount(0);pendingMessages=await messages(page);} finally {release();}
  await announcedFailure(page,[...beforeMessages,...pendingMessages],settled); await expect(titleInput(page)).toHaveValue('Giữ nội dung');
  await expect(page.getByText('Giữ nội dung',{exact:true})).toHaveCount(0);
  if(failure==='404')await expect(page.getByText(/tải lại/i).first()).toBeVisible();
  await expect(page.waitForRequest(req=>req.method()==='POST'&&new URL(req.url()).pathname==='/api/tasks',{timeout:1200})).rejects.toThrow(/Timeout/); expect(calls).toBe(1);
  expect((await list(request)).length).toBe(failure==='lost-response'?1:0);
  await page.unroute(tasksUrl); await page.reload();
  if(failure==='lost-response')await expect(page.getByText('Giữ nội dung',{exact:true})).toBeVisible();else await ready(page);
});
for(const operation of ['edit','delete','complete'])test(`AC-05 ${operation} pending lock, no optimism, failed state and no retry`,async({page,request})=>{
  await page.goto('/'); await ready(page); await add(page,'Giữ công việc'); const persisted=await list(request); const beforeMessages=await messages(page);
  const settled=failedRequest(page,req=>['PATCH','DELETE'].includes(req.method())&&new URL(req.url()).pathname.startsWith('/api/tasks/'));
  let intercepted;const received=new Promise(resolve=>intercepted=resolve);
  let release,calls=0; const gate=new Promise(resolve=>release=resolve);
  await page.route('**/api/tasks/*',async route=>{
    if(!['PATCH','DELETE'].includes(route.request().method()))return route.continue();
    calls++;intercepted(); await gate; await route.fulfill({status:500,json:{error:{code:'STORAGE_ERROR',message:'Không thể lưu công việc'}}});
  });
  const item=row(page,'Giữ công việc');let sender,confirm;
  if(operation==='edit') {
    await item.getByRole('button',{name:/^Sửa$/i}).click();await page.getByRole('textbox').last().fill('Bản sửa chưa lưu');sender=page.getByRole('button',{name:/^Lưu$/i});
  } else sender=operation==='complete'?item.getByRole('checkbox'):item.getByRole('button',{name:/^Xóa$/i});
  const observe=async()=>{
    const checkbox=page.getByRole('checkbox').first();
    return {visible:await page.getByText('Giữ công việc',{exact:true}).isVisible(),checked:await checkbox.count()?await checkbox.isChecked():undefined,replacement:await page.getByText('Bản sửa chưa lưu',{exact:true}).isVisible()};
  };
  sender=await stableControl(page,sender); const before=await observe();
  if(operation==='delete')page.once('dialog',dialog=>dialog.accept());
  await sender.click(); page.removeAllListeners('dialog');
  if(operation==='delete') {
    const dialog=page.getByRole('dialog').or(page.getByRole('alertdialog'));
    if(await dialog.count()){confirm=await stableControl(page,dialog.getByRole('button',{name:/xóa|xác nhận|đồng ý/i}));await confirm.click();}
  }
  await received;
  const disabled=async()=>await sender.isDisabled()||(confirm&&await confirm.count()?await confirm.isDisabled():false);
  let pendingMessages;
  try {
    await expect.poll(disabled).toBe(true);pending({disabled:await disabled(),view:await observe()},before);
    unchanged(await list(request),persisted);pendingMessages=await messages(page);
  } finally {release();}
  await announcedFailure(page,[...beforeMessages,...pendingMessages],settled);
  if(operation==='edit')await expect(page.getByRole('textbox').last()).toHaveValue('Bản sửa chưa lưu');
  await expect(page.waitForRequest(req=>['PATCH','DELETE'].includes(req.method())&&new URL(req.url()).pathname.startsWith('/api/tasks/'),{timeout:1200})).rejects.toThrow(/Timeout/);
  failed({view:await observe(),calls,input:operation==='edit'?await page.getByRole('textbox').last().inputValue():undefined},before,operation==='edit'?'Bản sửa chưa lưu':undefined);
  unchanged(await list(request),persisted);
  await page.unroute('**/api/tasks/*');await page.reload();
  await expect(page.getByText('Giữ công việc',{exact:true})).toBeVisible();await expect(row(page,'Giữ công việc').getByRole('checkbox')).not.toBeChecked();
});
test('AC-07 labels, keyboard focus, safe text and responsive widths',async({page})=>{
  await page.goto('/'); const input=titleInput(page); await expect(input).toHaveAccessibleName(/.+/);
  const beforeFocus=await addButton(page).evaluate(e=>{const s=getComputedStyle(e);return [s.backgroundColor,s.borderColor,s.color,s.boxShadow,s.outline];});
  await input.focus(); await input.fill('<img src=x onerror="window.__unsafe=1">'); await page.keyboard.press('Tab');
  const focus=await page.evaluate(()=>{const e=document.activeElement,s=getComputedStyle(e);return {tag:e.tagName,outline:s.outlineStyle!=='none'&&parseFloat(s.outlineWidth)>0,styles:[s.backgroundColor,s.borderColor,s.color,s.boxShadow,s.outline]};});
  expect(focus.tag).not.toBe('BODY'); expect(focus.outline||JSON.stringify(focus.styles)!==JSON.stringify(beforeFocus)).toBe(true);
  await addButton(page).focus(); await page.keyboard.press('Enter');
  await expect(page.getByText('<img src=x onerror="window.__unsafe=1">',{exact:true})).toBeVisible(); expect(await page.evaluate(()=>window.__unsafe)).toBeUndefined();
  await add(page,'😀'.repeat(200));
  for(const width of [360,1280]) {await page.setViewportSize({width,height:800}); expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true); await expect(addButton(page)).toBeVisible();}
});

for(const announcement of ['Chưa biết kết quả. Tải lại danh sách để kiểm tra.','Lưu thành công','Đang lưu'])test(`HARNESS settlement rejects false outcomes: ${announcement}`,async({page})=>{
  await page.setContent('<form><button type="button">Thêm</button></form><p role="alert"></p>');
  const sender=await stableControl(page,page.getByRole('button',{name:'Thêm'}));
  await page.getByRole('button').evaluate(button=>{button.textContent='Đang lưu';button.disabled=true;});
  await expect(sender).toBeDisabled();const before=await messages(page);
  const url='https://harness.invalid/api/tasks';
  await page.route(url,route=>route.fulfill({status:500,headers:{'access-control-allow-origin':'*'},json:{error:{code:'STORAGE_ERROR',message:'Không thể lưu'}}}));
  const settled=failedRequest(page,request=>request.url()===url&&request.method()==='POST');
  await page.evaluate(async({url,announcement})=>{
    await fetch(url,{method:'POST'}).catch(()=>{});document.querySelector('[role="alert"]').textContent=announcement;
  },{url,announcement});
  expect(await settled).toEqual({status:500});
  if(announcement.startsWith('Chưa'))await announcedFailure(page,before,settled);
  else await expect(announcedFailure(page,before,settled,100)).rejects.toThrow(/while waiting on the predicate/);
  await expect(sender).toBeDisabled();
});
