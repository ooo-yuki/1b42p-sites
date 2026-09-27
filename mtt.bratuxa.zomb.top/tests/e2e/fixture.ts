import { test as base, expect } from '@playwright/test';

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
