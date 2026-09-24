import { test, expect } from '@playwright/test';

// Диагностика загрузки Blender-карты: логи + ошибки консоли.
test('blender diag', async ({ page }) => {
  test.setTimeout(240000);
  const logs: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') logs.push(m.type() + ': ' + m.text().slice(0, 250));
  });
  page.on('pageerror', (e) => logs.push('pageerror: ' + String(e).slice(0, 250)));
  await page.addInitScript(() => localStorage.setItem('mtt_dev', '1'));
  await page.goto('/');
  await expect(page).toHaveTitle(/42 LIVE/);
  await page.click('#guestBtn');
  await page.click('#nav-maps');
  console.log('DIAG btn visible: ' + (await page.locator('#map-blender').isVisible()));
  await page.evaluate(() => (document.querySelector('#map-blender') as HTMLButtonElement).click());
  await page.click('#goBtn');
  await expect(page.locator('#fps')).toBeVisible({ timeout: 30000 });
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(5000);
    const s = await page.evaluate(() => {
      const w = window as unknown as { __mtt?: { solids: () => unknown[]; map: () => string } };
      if (!w.__mtt) return 'no __mtt';
      try { return w.__mtt.map() + ' solids=' + w.__mtt.solids().length; }
      catch (e) { return 'eval-err ' + String(e).slice(0, 200); }
    });
    console.log(`DIAG ${(i + 1) * 5}s: ${s}`);
    const n = Number(String(s).split('solids=')[1]);
    if (Number.isFinite(n) && n > 100) break;
  }
  console.log('DIAG console errors/warnings: ' + JSON.stringify(logs.slice(0, 20)));
});
