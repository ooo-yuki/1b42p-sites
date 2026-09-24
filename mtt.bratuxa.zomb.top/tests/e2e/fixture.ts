import { test as base, expect } from '@playwright/test';

// Общий тест-стенд: опрос техперерыва глушится в ВЫКЛ, чтобы реальный
// перерыв на проде не ронял весь сьют. Сам перерыв проверяется
// только в maint.spec.ts (свои стабы, импорт из '@playwright/test').
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/api/maintenance', (r) => r.fulfill({ json: { ok: true, on: false } }));
    await use(page);
  },
});
export { expect };
