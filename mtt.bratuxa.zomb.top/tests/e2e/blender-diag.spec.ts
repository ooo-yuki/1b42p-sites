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
  await page.click('#nav-play');
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
  const stats = await page.evaluate(() => {
    const m = (window as unknown as { __mtt: {
      solids: () => Array<{ x: number; z: number; hx: number; hz: number; r: number; h: number }>;
      solidAt: (x: number, z: number, y: number) => boolean;
    } }).__mtt;
    const solids = m.solids();
    const big = solids.filter((s) => Math.max(s.hx, s.hz) > 20).length;
    const huge = solids.filter((s) => Math.max(s.hx, s.hz) > 60).length;
    const byH = [0, 0, 0];
    for (const s of solids) { byH[s.h < 0.5 ? 0 : s.h < 3 ? 1 : 2]++; }
    const top = [...solids].sort((a, b) => (b.hx * b.hz) - (a.hx * a.hz)).slice(0, 8)
      .map((s) => `${s.x.toFixed(0)},${s.z.toFixed(0)} ${s.hx.toFixed(1)}x${s.hz.toFixed(1)} h=${s.h.toFixed(1)}`);
    // пробные точки: центр и ±40
    const probes: string[] = [];
    for (const [x, z] of [[0, 0], [40, 0], [-40, 0], [0, 40], [0, -40], [40, 40], [-40, -40]] as Array<[number, number]>) {
      probes.push(`${x},${z}=${m.solidAt(x, z, 0) ? 'SOLID' : 'free'}`);
    }
    return { n: solids.length, big, huge, byH, top, probes };
  });
  console.log('DIAG solids-stats ' + JSON.stringify(stats));
  await page.waitForTimeout(15000);
  await page.screenshot({ path: 'test-results/blender-map.png' });
  console.log('DIAG screenshot saved');
});
