import { test as base, expect, type Page } from '@playwright/test';

// Общий тест-стенд: опрос техперерыва глушится в ВЫКЛ, чтобы реальный
// перерыв на проде не ронял весь сьют. Сам перерыв проверяется
// только в maint.spec.ts (свои стабы, импорт из '@playwright/test').
// Трекер хаба глушим пустым 200 (не abort: аборт сам пишет ERR_FAILED в консоль).
// Тогда строгие тесты не зависят от того, жив хаб или лежит с 503.
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/api/maintenance', (r) => r.fulfill({ json: { ok: true, on: false } }));
    await page.route('**/hub.bratuxa.zomb.top/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
    await use(page);
  },
});
export { expect };

/** После «В БОЙ»: карта (GLB арены/нашествия) грузится асинхронно, HUD появляется
    только когда она готова, а управление включает `start()` — ждём и того, и другого
    вместо фиксированного waitForTimeout, иначе тесты читают пустую карту. */
export async function started(page: Page): Promise<void> {
  await expect(page.locator('#hudRow2')).toBeVisible({ timeout: 60000 });
  await page.waitForFunction(
    () => (window as unknown as { __mtt?: { playing?: () => boolean } }).__mtt?.playing?.() === true,
    null,
    { timeout: 60000, polling: 250 },
  );
};
