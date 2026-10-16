import assert from 'node:assert/strict';
import { test, expect } from '@playwright/test';
import { assertTitles, assertFailedInput, assertPending, assertRetry, assertLoading, assertNoAutoRetry, assertRecoveryTrace, assertCancelled, assertConfirmation, assertSafeText, assertCompletionOutcome } from './ui-assertions.mjs';

test('filter assertions accept correct visibility and reject stale completed item', async ({ page }) => {
  await page.setContent('<main><p>Chưa xong</p></main>');
  await assertTitles(page, ['Chưa xong'], ['Đã xong']);
  await page.setContent('<main><p>Chưa xong</p><p>Đã xong</p></main>');
  let rejected = false;
  try { await expect(page.getByText('Đã xong', { exact: true })).toHaveCount(0, { timeout: 100 }); } catch (error) { rejected = /toHaveCount/.test(error.message); }
  expect(rejected).toBe(true);
});
test('failure assertions accept preserved input and reject destructive clearing', async ({ page }) => {
  await page.setContent('<label>Tiêu đề<input value="Giữ khi lỗi"></label><button>Thêm</button>');
  const input = page.getByRole('textbox'); const add = page.getByRole('button', { name: 'Thêm' });
  await assertFailedInput(input, 'Giữ khi lỗi', add);
  await input.fill(''); let rejected = false;
  try { await expect(input).toHaveValue('Giữ khi lỗi', { timeout: 100 }); } catch (error) { rejected = /toHaveValue/.test(error.message); }
  expect(rejected).toBe(true);
});

test('pending assertion rejects an unlocked submit', async ({ page }) => {
  await page.setContent('<button disabled>Thêm</button>');
  const button = page.getByRole('button', { name: 'Thêm' }); await assertPending(button);
  await button.evaluate(element => { element.disabled = false; }); let rejected = false;
  try { await assertPending(button, 100); } catch (error) { rejected = /toBeDisabled/.test(error.message); }
  expect(rejected).toBe(true);
});
test('GET failure assertion rejects a screen with no explicit retry', async ({ page }) => {
  await page.setContent('<p role="status">Mất kết nối</p><button>Thử lại</button>'); await assertRetry(page);
  await page.setContent('<p role="status">Mất kết nối</p>'); let rejected = false;
  try { await assertRetry(page, 100); } catch (error) { rejected = /toBeVisible/.test(error.message); }
  expect(rejected).toBe(true);
});

test('loading assertion accepts pending indicator and rejects silent blank loading', async ({ page }) => {
  await page.setContent('<p role="status">Đang tải</p>'); await assertLoading(page);
  await page.setContent('<main></main>'); let rejected = false;
  try { await assertLoading(page, 100); } catch (error) { rejected = /toBeVisible/.test(error.message); }
  expect(rejected).toBe(true);
});

test('lost response trace requires GET before another write; automatic retry count is rejected', () => {
  assertNoAutoRetry(1);
  assert.throws(() => assertNoAutoRetry(2), /toBe/);
  assertRecoveryTrace(['POST', 'GET', 'POST']);
  assertRecoveryTrace(['PATCH', 'GET', 'PATCH']);
  assert.throws(() => assertRecoveryTrace(['POST', 'POST']), /toContain/);
  assert.throws(() => assertRecoveryTrace(['PATCH', 'PATCH']), /toContain/);
});

test('cancel edit/delete assertions accept unchanged data and reject accidental writes', () => {
  const before = [{ id: 'control-id', title: 'Giữ nguyên', completed: false, createdAt: '2026-01-01T00:00:00Z' }];
  assertCancelled(before, structuredClone(before));
  assert.throws(() => assertCancelled(before, [{ ...before[0], title: 'Đã bị sửa' }]), /toEqual/);
  assert.throws(() => assertCancelled(before, []), /toEqual/);
});

test('delete confirmation assertion rejects silent destructive action', async ({ page }) => {
  await page.setContent('<dialog open><p>Xác nhận xóa</p><button>Hủy</button><button>Xóa</button></dialog>');
  await assertConfirmation(() => page.getByRole('dialog').isVisible());
  await page.setContent('<main>Đã xóa</main>');
  await assert.rejects(() => assertConfirmation(() => page.getByRole('dialog').isVisible(), 100), /toBe/);
});

test('literal title/XSS assertion rejects executable markup', async ({ page }) => {
  const title = '<img src=x onerror="window.__taskXss=true">';
  await page.setContent('<main><p></p></main>');
  await page.locator('p').evaluate((element, text) => { element.textContent = text; }, title);
  await assertSafeText(page, title);
  await page.locator('main').evaluate((element, markup) => { element.insertAdjacentHTML('beforeend', markup); }, title);
  await expect.poll(() => page.evaluate(() => window.__taskXss)).toBe(true);
  await assert.rejects(() => assertSafeText(page, title), /toBeUndefined/);
});

async function controlledCompletion(page, completed, wrongRule) {
  await page.setContent('<label><input type="checkbox">Công việc chờ lưu</label>');
  await page.evaluate(({ completed, wrongRule }) => {
    window.__controlTasks = [{ title: 'Công việc chờ lưu', completed: !completed }];
    const checkbox = document.querySelector('input'); checkbox.checked = !completed;
    checkbox.addEventListener('click', event => {
      event.preventDefault();
      // This isolated fixture models a controlled checkbox whose save resolves later.
      window.__completeControlSave = () => {
        if (wrongRule !== 'unpersisted') window.__controlTasks[0].completed = completed;
        if (wrongRule !== 'no-transition') document.querySelector('label').remove();
      };
    });
  }, { completed, wrongRule });
  await page.getByRole('checkbox').click();
  expect(await page.getByRole('checkbox').isChecked()).toBe(!completed);
  await page.evaluate(() => { setTimeout(() => window.__completeControlSave(), 100); });
  return () => page.evaluate(() => window.__controlTasks);
}

for (const completed of [true, false]) {
  test(`completion outcome accepts delayed controlled save to ${completed}`, async ({ page }) => {
    const read = await controlledCompletion(page, completed);
    await assertCompletionOutcome(page, 'Công việc chờ lưu', completed, read);
  });
  test(`completion outcome rejects filtered transition without persisted ${completed}`, async ({ page }) => {
    const read = await controlledCompletion(page, completed, 'unpersisted');
    await assert.rejects(() => assertCompletionOutcome(page, 'Công việc chờ lưu', completed, read, 300), /toBe/);
  });
  test(`completion outcome rejects persistence without filtered transition to ${completed}`, async ({ page }) => {
    const read = await controlledCompletion(page, completed, 'no-transition');
    await assert.rejects(() => assertCompletionOutcome(page, 'Công việc chờ lưu', completed, read, 300), /toHaveCount/);
  });
}
