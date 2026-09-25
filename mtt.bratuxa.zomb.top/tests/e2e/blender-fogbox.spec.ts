import { test, expect } from './fixture';

// Временный кадр box-shadow тумана (удалить после проверки).
test('blender fog boxshot', async ({ page }) => {
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
  await page.waitForTimeout(8000);
  type C = { teleport: (x: number, z: number) => unknown };
  await page.evaluate(() => (window as unknown as { __mtt: C }).__mtt.teleport(-19, 66));
  await page.waitForTimeout(3000);
  await page.setViewportSize({ width: 640, height: 360 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'test-results/fog-box.jpg', type: 'jpeg', quality: 45 });
  console.log('DIAG fog box shot saved');
});
