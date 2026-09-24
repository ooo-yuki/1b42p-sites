import { test, expect } from './fixture';

// Временный визуальный чек фиолетовой зоны (удалить после проверки).
test('blender purple shot', async ({ page }) => {
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
  type C = { teleport: (x: number, z: number) => unknown; look: (dx: number, dy: number) => void };
  await page.evaluate(() => (window as unknown as { __mtt: C }).__mtt.teleport(-20, 52));
  await page.waitForTimeout(2000);
  await page.evaluate(() => (window as unknown as { __mtt: C }).__mtt.look(0.6, 0.1));
  await page.waitForTimeout(1500);
  await page.setViewportSize({ width: 640, height: 360 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'test-results/blender-purple.jpg', type: 'jpeg', quality: 40 });
  console.log('DIAG purple shot saved');
});
