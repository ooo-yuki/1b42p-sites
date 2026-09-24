import { test, expect } from './fixture';

// Временный фотоотчёт тумана (удалить после проверки).
test('blender fog shot', async ({ page }) => {
  test.setTimeout(240000);
  const errs: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errs.push(m.text().slice(0, 500));
  });
  page.on('pageerror', (e) => errs.push('pageerror: ' + String(e).slice(0, 500)));
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
  await page.waitForTimeout(8000);
  type C2 = C & { ground: (x: number, z: number) => number; pos: () => { x: number; z: number; yaw: number; py: number; pitch: number } };
  const gy = await page.evaluate(() => (window as unknown as { __mtt: C2 }).__mtt.ground(-20, 52));
  console.log('DIAG ground@purple-edge=' + gy);
  await page.evaluate(() => (window as unknown as { __mtt: C }).__mtt.look(0, 120));
  await page.waitForTimeout(2000);
  const st = await page.evaluate(() => (window as unknown as { __mtt: C2 }).__mtt.pos());
  console.log('DIAG camstate ' + JSON.stringify(st));
  await page.evaluate(() => (window as unknown as { __mtt: C }).__mtt.look(0, 300));
  await page.waitForTimeout(2000);
  await page.setViewportSize({ width: 640, height: 360 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'test-results/blender-fog.jpg', type: 'jpeg', quality: 45 });
  await page.evaluate(() => (window as unknown as { __mtt: C }).__mtt.look(0, -600));
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-results/blender-fog2.jpg', type: 'jpeg', quality: 45 });
  console.log('DIAG fog shots saved');
  console.log('DIAG console errors: ' + JSON.stringify(errs.slice(0, 8)));
});
