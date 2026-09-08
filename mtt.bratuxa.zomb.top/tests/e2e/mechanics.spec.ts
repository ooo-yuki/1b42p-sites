import { test, expect, type Page } from '@playwright/test';

async function boot(page: Page): Promise<void> {
  await page.goto('/');
  await expect(page).toHaveTitle(/42 LIVE/);
  await page.click('#guestBtn');
  await page.click('#goBtn');
  await expect(page.locator('#fps')).toBeVisible({ timeout: 30000 });
}

test('оружейка: фантики тратятся, аптечка покупается', async ({ page }: { page: Page }) => {
  test.setTimeout(180000);
  await boot(page);
  const r = await page.evaluate(() => {
    const m = (window as unknown as { __mtt: {
      give: (n: number) => number;
      medBuy: () => boolean;
    } }).__mtt;
    const afterGive = m.give(500);
    const bought = m.medBuy();
    const shop = JSON.parse(localStorage.getItem('mtt_shop_v1') ?? '{}') as { fantiki?: number; med?: number };
    return { afterGive, bought, fantiki: shop.fantiki, med: shop.med };
  });
  console.log('DIAG shop ' + JSON.stringify(r));
  expect(r.bought, 'аптечка купилась').toBe(true);
  expect(r.fantiki, 'фантики списались и легли на диск').toBeLessThan(r.afterGive);
  expect(r.med, 'аптечка в сейве').toBeGreaterThanOrEqual(1);
  await expect(page.locator('#hudRow2')).toContainText('💊', { timeout: 15000 });
});

test('рывок МТТ: рывок двигает на метры', async ({ page }: { page: Page }) => {
  test.setTimeout(180000);
  await boot(page);
  const d = await page.evaluate(async () => {
    const m = (window as unknown as { __mtt: {
      pos: () => { x: number; z: number };
      doDash: () => void;
      teleport: (x: number, z: number, yaw?: number) => void;
      solidAt: (x: number, z: number, y: number) => boolean;
    } }).__mtt;
    // свободная точка + взгляд в самый длинный свободный коридор (иначе рывок в стену = 0м)
    const cands = [[0, 30], [0, -30], [30, 0], [-30, 0], [0, 0]];
    let sx = 0, sz = 30;
    for (const [cx, cz] of cands) {
      if (!m.solidAt(cx, cz, 0)) { sx = cx; sz = cz; break; }
    }
    let bestYaw = 0, bestRun = -1;
    for (let k = 0; k < 8; k++) {
      const yaw = (k / 8) * Math.PI * 2;
      const dx = -Math.sin(yaw), dz = -Math.cos(yaw);
      let run = 0;
      for (let t = 1; t <= 12; t++) {
        if (m.solidAt(sx + dx * t, sz + dz * t, 0)) break;
        run = t;
      }
      if (run > bestRun) { bestRun = run; bestYaw = yaw; }
    }
    m.teleport(sx, sz, bestYaw);
    const p0 = m.pos();
    m.doDash();
    // арена в headless тяжёлая (1-2 кадра/с) — рывку 0.18 игровых секунды нужно реальное время
    await new Promise((res) => setTimeout(res, 5000));
    const p1 = m.pos();
    return { d: Math.hypot(p1.x - p0.x, p1.z - p0.z), run: bestRun };
  });
  console.log('DIAG dash ' + d.d.toFixed(1) + ' runway ' + d.run);
  expect(d.run, 'есть куда рвануть').toBeGreaterThan(3);
  expect(d.d, 'рывок пронёс').toBeGreaterThan(2);
});
