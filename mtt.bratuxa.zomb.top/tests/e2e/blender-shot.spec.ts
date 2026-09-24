import { test, expect } from '@playwright/test';

// Временный визуальный чек Blender-карты (удалить после проверки).
test('blender shot', async ({ page }) => {
  test.setTimeout(240000);
  await page.addInitScript(() => localStorage.setItem('mtt_dev', '1'));
  await page.goto('/');
  await expect(page).toHaveTitle(/42 LIVE/);
  await page.click('#guestBtn');
  await page.click('#nav-maps');
  await page.evaluate(() => (document.querySelector('#map-blender') as HTMLButtonElement).click());
  await page.click('#nav-play');
  await page.click('#goBtn');
  await expect(page.locator('#fps')).toBeVisible({ timeout: 30000 });
  await page.waitForFunction(
    () => (window as unknown as { __mtt: { solids: () => unknown[] } }).__mtt.solids().length > 100,
    null,
    { timeout: 180000, polling: 2000 },
  );
  await page.waitForTimeout(12000);
  // смотрим по сторонам: 4 кадра с поворотом
  for (let i = 0; i < 4; i++) {
    await page.evaluate(() => (window as unknown as { __mtt: { look: (dx: number, dy: number) => void } }).__mtt.look(2.2, -0.15));
    await page.waitForTimeout(1500);
  }
  await page.setViewportSize({ width: 640, height: 360 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'test-results/blender-trees.jpg', type: 'jpeg', quality: 40 });
  console.log('DIAG shot saved');
});
