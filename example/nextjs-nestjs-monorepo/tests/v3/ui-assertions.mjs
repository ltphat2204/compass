import { expect } from '@playwright/test';
export async function assertTitles(page, present, absent = []) {
  for (const title of present) await expect(page.getByText(title, { exact: true })).toBeVisible();
  for (const title of absent) await expect(page.getByText(title, { exact: true })).toHaveCount(0);
}
export async function assertFailedInput(input, value, add) {
  await expect(input).toHaveValue(value);
}
export async function assertPending(button, timeout = 10000) { await expect(button).toBeDisabled({ timeout }); }
export async function assertRetry(page, timeout = 10000) { await expect(page.getByRole('button', { name: /thử lại/i })).toBeVisible({ timeout }); }
export async function assertLoading(page, timeout = 10000) {
  const indicator = page.getByRole('status').or(page.getByRole('progressbar')).or(page.locator('[aria-busy="true"]')).or(page.getByText(/đang\s+(?:tải|nạp|lấy)|loading/i));
  await expect(indicator.first()).toBeVisible({ timeout });
}
export function assertNoAutoRetry(attempts) { expect(attempts).toBe(1); }
export function assertRecoveryTrace(methods) {
  let lastWrite = -1;
  for (let index = 0; index < methods.length; index++) {
    if (!['POST', 'PATCH', 'DELETE'].includes(methods[index])) continue;
    if (lastWrite !== -1) expect(methods.slice(lastWrite + 1, index)).toContain('GET');
    lastWrite = index;
  }
}
export function assertCancelled(before, after) { expect(after).toEqual(before); }
export async function assertConfirmation(visible, timeout = 10000) { await expect.poll(visible, { timeout }).toBe(true); }
export async function assertSafeText(page, title) {
  await expect(page.getByText(title, { exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.__taskXss)).toBeUndefined();
}
export async function assertCompletionOutcome(page, title, completed, readTasks, timeout = 10000) {
  // Completion may remain controlled at its old value until the save response arrives.
  await expect(page.getByText(title, { exact: true })).toHaveCount(0, { timeout });
  await expect.poll(async () => (await readTasks()).find(task => task.title === title)?.completed, { timeout }).toBe(completed);
}
