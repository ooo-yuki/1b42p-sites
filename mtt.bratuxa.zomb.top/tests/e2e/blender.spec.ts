import { test, expect, type Page } from '@playwright/test';

// Blender-карта (DEV): игрок может находиться во всех частях карты,
// спавн свободен, за периметр не выйти.
async function bootBlender(page: Page): Promise<void> {
  await page.addInitScript(() => localStorage.setItem('mtt_dev', '1'));
  await page.goto('/');
  await expect(page).toHaveTitle(/42 LIVE/);
  await page.click('#guestBtn');
  await page.click('#nav-maps');
  // карта видна только с DEV-доступом
  await expect(page.locator('#map-blender')).toBeVisible({ timeout: 15000 });
  await page.evaluate(() => (document.querySelector('#map-blender') as HTMLButtonElement).click());
  await page.click('#nav-play');
  await page.click('#goBtn');
  await expect(page.locator('#fps')).toBeVisible({ timeout: 30000 });
  // ждём загрузку GLB (25+ МБ): солиды появляются после парса
  await page.waitForFunction(
    () => (window as unknown as { __mtt: { solids: () => unknown[] } }).__mtt.solids().length > 100,
    null,
    { timeout: 180000, polling: 2000 },
  );
}

type M = {
  pos: () => { x: number; z: number };
  solids: () => Array<{ x: number; z: number; hx: number; hz: number; r: number; h: number }>;
  solidAt: (x: number, z: number, y: number) => boolean;
  foes: () => Array<{ dead: boolean }>;
};

test('blender: хитбоксы загружены, спавн свободен', async ({ page }: { page: Page }) => {
  test.setTimeout(300000);
  await bootBlender(page);
  const res = await page.evaluate(() => {
    const m = (window as unknown as { __mtt: M }).__mtt;
    const solids = m.solids();
    const p = m.pos();
    return { n: solids.length, spawnFree: !m.solidAt(p.x, p.z, 0), px: p.x, pz: p.z };
  });
  console.log('DIAG blender solids=' + res.n + ' spawn=(' + res.px.toFixed(1) + ',' + res.pz.toFixed(1) + ') free=' + res.spawnFree);
  expect(res.n, 'хитбоксы карты не загрузились').toBeGreaterThan(490);
  expect(res.spawnFree, 'спавн внутри стены').toBe(true);
});

test('blender: все четверти карты проходимы, периметр держит', async ({ page }: { page: Page }) => {
  test.setTimeout(300000);
  await bootBlender(page);
  const res = await page.evaluate(() => {
    const m = (window as unknown as { __mtt: M }).__mtt;
    const solids = m.solids();
    // bbox по обычным хитбоксам (периметр-стены исключаем — они огромные)
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    for (const s of solids) {
      if (Math.max(s.hx, s.hz) > 60) continue;
      const ex = Math.max(s.hx, s.hz);
      if (s.x - ex < x0) x0 = s.x - ex;
      if (s.x + ex > x1) x1 = s.x + ex;
      if (s.z - ex < z0) z0 = s.z - ex;
      if (s.z + ex > z1) z1 = s.z + ex;
    }
    // внутрь от стен: отступ 8м
    const ix0 = x0 + 8, ix1 = x1 - 8, iz0 = z0 + 8, iz1 = z1 - 8;
    const step = 6;
    let total = 0, free = 0;
    const quad = [0, 0, 0, 0];
    const qx = (ix0 + ix1) / 2, qz = (iz0 + iz1) / 2;
    for (let x = ix0; x <= ix1; x += step) {
      for (let z = iz0; z <= iz1; z += step) {
        total++;
        if (!m.solidAt(x, z, 0)) {
          free++;
          quad[(x >= qx ? 1 : 0) + (z >= qz ? 2 : 0)]++;
        }
      }
    }
    // выход с карты: луч из спавна в 8 направлениях обязан упереться в стену
    const p = m.pos();
    const rays = [0, Math.PI / 2, Math.PI, -Math.PI / 2, Math.PI / 4, -Math.PI / 4, (3 * Math.PI) / 4, (-3 * Math.PI) / 4];
    const out = rays.map((a) => {
      const dx = Math.cos(a), dz = Math.sin(a);
      for (let d = 1; d <= 300; d += 1) {
        if (m.solidAt(p.x + dx * d, p.z + dz * d, 0)) return d;
      }
      return -1;
    });
    return { total, free, quad, out, bbox: [x0, z0, x1, z1] };
  });
  console.log('DIAG blender grid ' + JSON.stringify(res));
  expect(res.total).toBeGreaterThan(50);
  expect(res.free / res.total, 'слишком мало проходимых клеток').toBeGreaterThan(0.25);
  for (let i = 0; i < 4; i++) {
    expect(res.quad[i], `четверть ${i} полностью заблокирована`).toBeGreaterThan(2);
  }
  expect(res.out.every((d) => d > 0), `периметр не держит: лучи без стен ${JSON.stringify(res.out)}`).toBe(true);
});

test('blender: мирная карта — ноль мобов, нет волны в HUD', async ({ page }: { page: Page }) => {
  test.setTimeout(300000);
  await bootBlender(page);
  // волны спавнятся в первые секунды — ждём, чтобы возможный пак успел появиться
  await page.waitForTimeout(20000);
  const live = await page.evaluate(
    () => (window as unknown as { __mtt: M }).__mtt.foes().filter((f) => !f.dead).length,
  );
  expect(live, 'на blender-карте завелись мобы').toBe(0);
  const hudRow = await page.locator('#hudRow').innerText();
  expect(hudRow, 'нет бейджа команды').toMatch(/КРАСНЫЕ|СИНИЕ/);
  expect(hudRow, 'в HUD висит волна').not.toContain('Волна');
  expect(await page.locator('#waveBanner').count(), 'баннер волны на мирной карте').toBe(0);
});

test('blender CTF: подбор, штрафы, захват, дроп при смерти', async ({ page }: { page: Page }) => {
  test.setTimeout(300000);
  await bootBlender(page);
  type C = M & {
    ctf: () => { team: 'red' | 'blue' | null; carrying: 'red' | 'blue' | null; captures: number; red: { x: number; z: number; home: boolean } | null; blue: { x: number; z: number; home: boolean } | null };
    teleport: (x: number, z: number) => { x: number; z: number };
    attack: () => number;
    atkcd: () => number;
    doDash: () => boolean;
    hurt: (n: number) => number;
    revive: () => boolean;
  };
  const st0 = await page.evaluate(() => (window as unknown as { __mtt: C }).__mtt.ctf());
  expect(st0.team === 'red' || st0.team === 'blue', 'нет команды').toBe(true);
  expect(!!(st0.red && st0.blue), 'нет обоих флагов').toBe(true);
  const foe = st0.team === 'red' ? 'blue' : 'red';
  const foeFlag = (foe === 'red' ? st0.red : st0.blue)!;
  const myBase = (st0.team === 'red' ? st0.red : st0.blue)!;
  // контроль: без флага атака взводит кд — ждём пока кд сойдёт (игровое время под SwiftShader идёт медленнее)
  await page.evaluate(() => (window as unknown as { __mtt: C }).__mtt.attack());
  await page.waitForFunction(
    () => (window as unknown as { __mtt: C }).__mtt.atkcd() <= 0,
    null,
    { timeout: 60000, polling: 500 },
  );
  // телепорт к вражескому флагу — подбор
  await page.evaluate(([x, z]) => (window as unknown as { __mtt: C }).__mtt.teleport(x, z), [foeFlag.x, foeFlag.z]);
  await page.waitForTimeout(1000);
  const st1 = await page.evaluate(() => (window as unknown as { __mtt: C }).__mtt.ctf());
  expect(st1.carrying, 'флаг не подобрался').toBe(foe);
  // штрафы носителя: атака не взводит кд, рывок запрещён
  await page.evaluate(() => (window as unknown as { __mtt: C }).__mtt.attack());
  const cd = await page.evaluate(() => (window as unknown as { __mtt: C }).__mtt.atkcd());
  expect(cd, 'носитель смог атаковать').toBe(0);
  const dash = await page.evaluate(() => (window as unknown as { __mtt: C }).__mtt.doDash());
  expect(dash, 'носитель смог рывануться').toBe(false);
  // доставка на свою базу — захват
  await page.evaluate(([x, z]) => (window as unknown as { __mtt: C }).__mtt.teleport(x, z), [myBase.x, myBase.z]);
  await page.waitForTimeout(1000);
  const st2 = await page.evaluate(() => (window as unknown as { __mtt: C }).__mtt.ctf());
  expect(st2.carrying, 'флаг не сброшен после захвата').toBe(null);
  expect(st2.captures, 'захват не засчитан').toBe(1);
  // снова взял — умер — флаг брошен там, где умер
  await page.evaluate(([x, z]) => (window as unknown as { __mtt: C }).__mtt.teleport(x, z), [foeFlag.x, foeFlag.z]);
  await page.waitForTimeout(800);
  await page.evaluate(() => (window as unknown as { __mtt: C }).__mtt.hurt(99999));
  await page.waitForTimeout(800);
  const st3 = await page.evaluate(() => (window as unknown as { __mtt: C }).__mtt.ctf());
  expect(st3.carrying, 'флаг не выпал при смерти').toBe(null);
  const dropped = (foe === 'red' ? st3.red : st3.blue)!;
  expect(dropped.home, 'флаг вернулся домой вместо дропа').toBe(false);
  await page.evaluate(() => (window as unknown as { __mtt: C }).__mtt.revive());
  console.log('DIAG ctf team=' + st0.team + ' captures=' + st2.captures + ' dropped@' + dropped.x + ',' + dropped.z);
});
