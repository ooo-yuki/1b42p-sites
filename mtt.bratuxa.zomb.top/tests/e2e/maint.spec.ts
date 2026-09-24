import { test, expect } from '@playwright/test';

// Технический перерыв: плашка на весь экран всем без DEV-доступа.
test('техперерыв: гость видит плашку + ТГК', async ({ page }) => {
  await page.route('**/api/maintenance', (r) => r.fulfill({ json: { ok: true, on: true } }));
  await page.goto('/');
  await expect(page).toHaveTitle(/42 LIVE/);
  const ov = page.locator('#maintOverlay');
  await expect(ov).toBeVisible({ timeout: 15000 });
  await expect(page.locator('#maintTg')).toHaveAttribute('href', 'https://t.me/carstvoMTT');
  await expect(page.locator('#maintTitle')).toContainText('ТЕХНИЧЕСКИЙ ПЕРЕРЫВ');
  // перекрывает весь экран
  const box = await ov.boundingBox();
  const vp = page.viewportSize();
  expect(box, 'плашка не на весь экран').not.toBe(null);
  expect(Math.abs((box?.width ?? 0) - (vp?.width ?? 0)) < 2).toBe(true);
  expect(Math.abs((box?.height ?? 0) - (vp?.height ?? 0)) < 2).toBe(true);
});

test('техперерыв: с DEV-доступом плашки нет, кнопка-тоггл на месте', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('mtt_dev', '1'));
  await page.route('**/api/maintenance', (r) => r.fulfill({ json: { ok: true, on: true } }));
  await page.goto('/');
  await expect(page).toHaveTitle(/42 LIVE/);
  await expect(page.locator('#maintOverlay')).toHaveCount(0);
  await page.click('#devBanner');
  const btn = page.locator('#devMaintBtn');
  await expect(btn).toBeVisible();
  await expect(btn).toContainText('ВЫКЛ');
});
