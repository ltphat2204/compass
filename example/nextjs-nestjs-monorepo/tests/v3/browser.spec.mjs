import { test as base, expect } from '@playwright/test';
import { apiFixture, projectDir, request, run, ready, stop, freePort } from './harness.mjs';
import { assertTitles, assertFailedInput, assertPending, assertRetry, assertLoading, assertNoAutoRetry, assertRecoveryTrace, assertCancelled, assertConfirmation, assertSafeText, assertCompletionOutcome } from './ui-assertions.mjs';
const apiPort = Number(process.env.BROWSER_API_PORT ?? 43001);
const webPort = Number(process.env.BROWSER_WEB_PORT ?? 43000);
const webOrigin = `http://127.0.0.1:${webPort}`;
const test = base.extend({
  app: [async ({}, use) => {
    await freePort(webPort);
    const api = await apiFixture({ port: apiPort, webOrigin }); let web;
    try {
      await api.start();
      web = run('pnpm', ['--filter', '@example/web', 'start'], { PORT: String(webPort), NEXT_PUBLIC_API_URL: api.origin }, projectDir);
      await ready(webOrigin, web); await use({ api, webOrigin });
    } finally { await stop(web); await api.close(); }
  }, { scope: 'worker' }],
});
async function empty(api) {
  const { tasks } = await (await request(api)).json();
  for (const task of tasks) expect((await request(api, 'DELETE', undefined, task.id)).status).toBe(204);
}
async function row(page, title) {
  let candidate = page.getByText(title, { exact: true });
  for (let i = 0; i < 8; i++) {
    candidate = candidate.locator('..');
    if (await candidate.getByRole('button', { name: 'Sửa', exact: true }).count()) return candidate;
  }
  throw new Error('Task must expose an accessible Sửa action near its title');
}
async function filter(page, name) {
  const button = page.getByRole('button', { name, exact: true });
  if (await button.count()) return button.click();
  const radio = page.getByRole('radio', { name, exact: true });
  if (await radio.count()) return radio.check();
  return page.getByRole('combobox').selectOption({ label: name });
}
async function add(page, title) {
  const input = page.getByRole('textbox').first();
  await input.fill(title); await page.getByRole('button', { name: 'Thêm', exact: true }).click();
  await expect(page.getByText(title.trim(), { exact: true })).toBeVisible(); await expect(input).toHaveValue('');
}
async function remove(page, title, accept) {
  let native = false;
  const handleDialog = async dialog => { native = true; if (accept) await dialog.accept(); else await dialog.dismiss(); };
  page.once('dialog', handleDialog);
  await (await row(page, title)).getByRole('button', { name: 'Xóa', exact: true }).click();
  const dialog = page.getByRole('dialog').or(page.getByRole('alertdialog'));
  await assertConfirmation(async () => native || await dialog.isVisible());
  if (!native) {
    page.off('dialog', handleDialog);
    await dialog.getByRole('button', { name: accept ? /Xóa|Xác nhận/ : /Hủy/, exact: false }).click();
  }
}

test.beforeEach(async ({ app }) => empty(app.api));
for (const width of [360, 1280]) {
  test(`CRUD, filters, cancel, confirmation and safe text at ${width}px`, async ({ page, app }) => {
    await page.setViewportSize({ width, height: 900 }); await page.goto(app.webOrigin);
    await expect(page.getByRole('heading').first()).toBeVisible();
    await add(page, '  Mua sữa  '); await add(page, 'Việc thứ hai');
    const input = page.getByRole('textbox').first();
    await expect(input).toHaveAccessibleName(/.+/);
    const beforeCancel = (await (await request(app.api)).json()).tasks;
    const firstRow = await row(page, 'Mua sữa');
    await firstRow.getByRole('button', { name: 'Sửa', exact: true }).click();
    const edit = page.getByRole('textbox').last(); await edit.fill('không lưu');
    await page.getByRole('button', { name: 'Hủy', exact: true }).click();
    await assertTitles(page, ['Mua sữa'], ['không lưu']);
    assertCancelled(beforeCancel, (await (await request(app.api)).json()).tasks);
    await (await row(page, 'Mua sữa')).getByRole('button', { name: 'Sửa', exact: true }).click();
    await page.getByRole('textbox').last().fill('Đã sửa'); await page.getByRole('button', { name: 'Lưu', exact: true }).click();
    await assertTitles(page, ['Đã sửa'], ['Mua sữa']);
    await filter(page, 'Chưa hoàn thành');
    await (await row(page, 'Đã sửa')).getByRole('checkbox').click();
    await assertCompletionOutcome(page, 'Đã sửa', true, async () => (await (await request(app.api)).json()).tasks);
    await assertTitles(page, ['Việc thứ hai'], ['Đã sửa']);
    await filter(page, 'Đã hoàn thành'); await assertTitles(page, ['Đã sửa'], ['Việc thứ hai']);
    await (await row(page, 'Đã sửa')).getByRole('checkbox').click();
    await assertCompletionOutcome(page, 'Đã sửa', false, async () => (await (await request(app.api)).json()).tasks);
    await assertTitles(page, [], ['Đã sửa', 'Việc thứ hai']);
    await filter(page, 'Tất cả'); await assertTitles(page, ['Đã sửa', 'Việc thứ hai']);
    const beforeDeleteCancel = (await (await request(app.api)).json()).tasks;
    await remove(page, 'Đã sửa', false); await assertTitles(page, ['Đã sửa']);
    assertCancelled(beforeDeleteCancel, (await (await request(app.api)).json()).tasks);
    await remove(page, 'Đã sửa', true); await assertTitles(page, [], ['Đã sửa']);
    await add(page, '<img src=x onerror="window.__taskXss=true">');
    await assertSafeText(page, '<img src=x onerror="window.__taskXss=true">');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.reload(); await assertTitles(page, ['Việc thứ hai']);
    const persisted = (await (await request(app.api)).json()).tasks;
    expect(persisted.map(task => task.title)).toContain('Việc thứ hai'); expect(persisted.map(task => task.title)).not.toContain('Đã sửa');
    // Keyboard operation uses the public form; visual focus quality is reviewed manually.
    await input.focus(); await input.fill('Bàn phím'); await page.keyboard.press('Tab');
    await page.getByRole('button', { name: 'Thêm', exact: true }).focus(); await page.keyboard.press('Enter');
    await assertTitles(page, ['Bàn phím']);
  });
}

test('GET outage, retry and durable recovery after API restart', async ({ page, app }) => {
  await page.goto(app.webOrigin); await add(page, 'Sau khởi động lại');
  await app.api.stop(); await page.reload();
  const retry = page.getByRole('button', { name: /thử lại/i }); await assertRetry(page);
  await app.api.start(); await retry.click(); await assertTitles(page, ['Sau khởi động lại']);
});

test('pending and failed mutations preserve input, do not claim success or auto retry', async ({ page, app }) => {
  await page.goto(app.webOrigin);
  const input = page.getByRole('textbox').first(); const submit = page.getByRole('button', { name: 'Thêm', exact: true });
  let release; const gate = new Promise(resolve => { release = resolve; }); let attempts = 0; const observed = [];
  await page.route(`${app.api.origin}/api/tasks`, async route => {
    observed.push(route.request().method());
    if (route.request().method() !== 'POST') return route.continue();
    attempts++; await gate; await route.fetch(); await route.abort('failed');
  });
  await input.fill('Giữ khi lỗi'); await submit.click(); await assertPending(submit);
  await assertTitles(page, [], ['Giữ khi lỗi']); release();
  await assertFailedInput(input, 'Giữ khi lỗi', submit);
  await expect(page.getByRole('alert').or(page.getByRole('status')).filter({ hasText: /.+/ }).first()).toBeVisible();
  await page.waitForTimeout(1200); assertNoAutoRetry(attempts);
  await assertTitles(page, [], ['Giữ khi lỗi']);
  expect((await (await request(app.api)).json()).tasks.map(task => task.title)).toEqual(['Giữ khi lỗi']);
  // An enabled submit may explain recovery or reconcile first, but cannot blindly repeat POST.
  if (await submit.isEnabled()) {
    await submit.click(); await page.waitForTimeout(300);
    assertRecoveryTrace(observed);
  }
  // An uncertain write must be reconciled by a GET before another submission.
  await page.reload(); await assertTitles(page, ['Giữ khi lỗi']);
  await page.unroute(`${app.api.origin}/api/tasks`); await add(page, 'Sau đối soát');
});

test('initial GET error and successful explicit retry', async ({ page, app }) => {
  let release; const gate = new Promise(resolve => { release = resolve; }); let reads = 0;
  await page.route(`${app.api.origin}/api/tasks`, async route => {
    if (route.request().method() !== 'GET') return route.continue();
    reads++; if (reads === 1) { await gate; return route.abort('failed'); } return route.continue();
  });
  await page.goto(app.webOrigin);
  await assertLoading(page); release();
  const retry = page.getByRole('button', { name: /thử lại/i }); await assertRetry(page);
  await retry.click(); await expect(retry).toHaveCount(0); expect(reads).toBeGreaterThanOrEqual(2);
  await expect(page.getByRole('button', { name: 'Thêm', exact: true })).toBeEnabled();
});

test('failed edit preserves draft and stored title, failed delete retains task', async ({ page, app }) => {
  await page.goto(app.webOrigin); await add(page, 'Dữ liệu gốc');
  let attempts = 0; let release; const gate = new Promise(resolve => { release = resolve; });
  await page.route(`${app.api.origin}/api/tasks/**`, async route => {
    if (route.request().method() === 'PATCH') { attempts++; await gate; return route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: { code: 'SAVE_FAILED', message: 'Không lưu được' } }) }); }
    if (route.request().method() === 'DELETE') return route.abort('failed');
    return route.continue();
  });
  await (await row(page, 'Dữ liệu gốc')).getByRole('button', { name: 'Sửa', exact: true }).click();
  const edit = page.getByRole('textbox').last(); await edit.fill('Bản nháp còn lại');
  const save = page.getByRole('button', { name: 'Lưu', exact: true }); await save.click(); await assertPending(save); release();
  await assertFailedInput(edit, 'Bản nháp còn lại', save);
  await page.waitForTimeout(1200); assertNoAutoRetry(attempts);
  expect((await (await request(app.api)).json()).tasks[0].title).toBe('Dữ liệu gốc');
  await page.getByRole('button', { name: 'Hủy', exact: true }).click();
  await page.reload(); await assertTitles(page, ['Dữ liệu gốc']);
  await remove(page, 'Dữ liệu gốc', true); await assertTitles(page, ['Dữ liệu gốc']);
  await expect(page.getByRole('alert').or(page.getByRole('status')).filter({ hasText: /.+/ }).first()).toBeVisible();
  expect((await (await request(app.api)).json()).tasks).toHaveLength(1);
});
