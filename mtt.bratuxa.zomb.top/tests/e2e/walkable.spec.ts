import { test, expect, type Page } from '@playwright/test';

// RED: маршрут должен быть ПРОХОДИМ телом (r=0.9) по каждому сегменту.
// Диагонали BFS сквозь угловые щели дают сегменты, где моб клинит.
test('маршрут проходим телом (без среза углов)', async ({ page }: { page: Page }) => {
  test.setTimeout(300000);
  await page.goto('/');
  await expect(page).toHaveTitle(/42 LIVE/);
  await page.click('#guestBtn');
  await page.click('#goBtn');
  await expect(page.locator('#fps')).toBeVisible({ timeout: 30000 });
  const res = await page.evaluate(() => {
    const m = (window as unknown as { __mtt: {
      solidAt: (x: number, z: number, y: number) => boolean;
      path: (fx: number, fz: number, tx: number, tz: number) => Array<{ x: number; z: number }>;
    } }).__mtt;
    const segBlocked = (ax: number, az: number, bx: number, bz: number): boolean => {
      const d = Math.hypot(bx - ax, bz - az);
      const n = Math.max(1, Math.ceil(d / 0.5));
      for (let i = 0; i <= n; i++) {
        if (m.solidAt(ax + ((bx - ax) * i) / n, az + ((bz - az) * i) / n, 0)) return true;
      }
      return false;
    };
    let seed = 7;
    const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    let checked = 0, bad = 0;
    const badEx: Array<string> = [];
    for (let i = 0; i < 80 && checked < 30; i++) {
      const fx = (rnd() * 2 - 1) * 48, fz = (rnd() * 2 - 1) * 48;
      const tx = (rnd() * 2 - 1) * 48, tz = (rnd() * 2 - 1) * 48;
      if (Math.hypot(tx - fx, tz - fz) < 15) continue;
      if (m.solidAt(fx, fz, 0) || m.solidAt(tx, tz, 0)) continue;
      const wps = m.path(fx, fz, tx, tz);
      if (wps.length === 0) continue;
      checked++;
      const pts = [{ x: fx, z: fz }, ...wps];
      let blocked = false;
      for (let k = 0; k + 1 < pts.length; k++) {
        if (segBlocked(pts[k].x, pts[k].z, pts[k + 1].x, pts[k + 1].z)) { blocked = true; break; }
      }
      if (blocked) {
        bad++;
        if (badEx.length < 4) badEx.push(`${Math.round(fx)},${Math.round(fz)}→${Math.round(tx)},${Math.round(tz)}`);
      }
    }
    return { checked, bad, badEx };
  });
  console.log('DIAG walkable ' + JSON.stringify(res));
  expect(res.checked).toBeGreaterThan(10);
  expect(res.bad, 'маршрутов сквозь стены').toBe(0);
});
