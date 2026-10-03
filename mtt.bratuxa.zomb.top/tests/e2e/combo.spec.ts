import { test, expect, started } from './fixture';

interface Combo { n: number; mult: number; t: number; max: number }
interface ProfileResp { login: string; medals?: string[] }

// 🔥 комбо-множитель + цифры урона + килфид + медали — один поток вовлечения.
// Фраги подряд без урона по себе → comboMultOf(combo) на счёт; урон ломает комбо;
// первый фраг выдаёт медаль «Первый фраг» (тост + витрина профиля + /api/profile).
// Тост живёт 4с, комбо — 3с: первые 4 фрага идут пачкой без пауз, потом чеки.
test('🔥 комбо-множитель, цифры урона, килфид и медаль «Первый фраг»', async ({ page, request }) => {
  test.setTimeout(180000);
  const login = `cb${Date.now().toString(36)}`;
  await page.goto('/');
  await page.fill('#authLogin', login);
  await page.fill('#authPass', 'test1234');
  await page.click('#regBtn');
  await expect(page.locator('#authWho')).toContainText(login, { timeout: 30000 });
  await page.click('#goBtn');
  await started(page);

  type M = {
    give: (n: number) => void;
    combo: () => Combo;
    score: () => { score: number; kills: number };
    attack: () => number;
    spawnKind: (k: string) => number;
    teleport: (x: number, z: number, yaw: number) => void;
    pos: () => { x: number; z: number; hp: number };
    foes: () => Array<{ x: number; z: number; hp: number; dead: boolean }>;
    resetcd: () => void;
    devgod: (on: boolean) => void;
    devdmg: (on: boolean) => void;
    hurt: (n: number) => number;
    hp: () => number;
  };

  // убить одного врага кулаками в упор: сброс кд → свежий враг → телепорт в створ → удар.
  // devdmg включён заранее — один удар = фраг, каждый фраг детерминирован.
  const killOne = () => page.evaluate(() => {
    const m = (window as unknown as { __mtt: M }).__mtt;
    m.resetcd();
    m.spawnKind('walk');
    const live = m.foes().filter((f) => !f.dead);
    if (live.length === 0) return -1;
    const f = live[live.length - 1];
    const p = m.pos();
    let dx = f.x - p.x, dz = f.z - p.z;
    const L = Math.hypot(dx, dz) || 1;
    dx /= L; dz /= L;
    m.teleport(f.x - dx * 1.5, f.z - dz * 1.5, Math.atan2(-dx, -dz));
    return m.attack();
  });

  // в бессмертии, чтобы орда не сбила комбо уроном: проверяем наградную механику
  await page.evaluate(() => {
    const m = (window as unknown as { __mtt: M }).__mtt;
    m.devgod(true);
    m.devdmg(true);
    m.give(1000);
  });

  // ---- 4 фрага пачкой (комбо живёт 3с — без пауз между ударами) ----
  expect(await killOne()).toBeGreaterThan(0);
  const s1 = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.score().score);
  expect(await killOne()).toBeGreaterThan(0);
  expect(await killOne()).toBeGreaterThan(0);
  expect(await killOne()).toBeGreaterThan(0);
  const res = await page.evaluate(() => {
    const m = (window as unknown as { __mtt: M }).__mtt;
    return { c: m.combo(), score: m.score().score };
  });
  expect(res.c.n, 'четыре фрага подряд — комбо 4').toBe(4);
  expect(res.c.mult, 'комбо 4 → множитель ×1.5').toBeCloseTo(1.5, 5);
  expect(res.score, 'счёт с комбо растёт').toBeGreaterThan(s1);

  // ---- медаль «Первый фраг»: тост с первого фрага (жизнь 4с) ----
  await expect(page.locator('#medalToast')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('#medalToast')).toContainText('Первый фраг');

  // ---- счётчик комбо на экране: n>=2 и множитель ----
  await expect(page.locator('#comboTag')).toBeVisible();
  await expect(page.locator('#comboTag')).toContainText('×1.5');

  // ---- цифры урона и килфид: свежий фраг оставляет DOM-следы ----
  expect(await killOne()).toBeGreaterThan(0);
  await expect.poll(async () => page.locator('#fxLayer .dmgNum').count(), { timeout: 5000 })
    .toBeGreaterThan(0);
  await expect.poll(async () => page.locator('#killFeed .kf').count(), { timeout: 5000 })
    .toBeGreaterThan(0);

  // ---- урон по себе ломает комбо, рекорд остаётся ----
  await page.evaluate(() => {
    const m = (window as unknown as { __mtt: M }).__mtt;
    m.devgod(false);
    m.attack(); // щит спавна гасит урон — снимаем атакой
    m.hurt(10);
  });
  await page.waitForFunction(() => {
    const m = (window as unknown as { __mtt?: M }).__mtt;
    return !!m && m.combo().n === 0;
  }, null, { timeout: 10000, polling: 100 });
  const c0 = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.combo());
  expect(c0.n, 'урон по себе обнуляет комбо').toBe(0);
  expect(c0.max, 'рекорд комбо сохранён').toBeGreaterThanOrEqual(4);
  // комбо уже сломан — возвращаем бессмертие, чтобы орда не добила до выхода в меню
  await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.devgod(true));

  // ---- витрина: медаль светится в профиле, сервер знает о ней ----
  await page.click('#menuBtn');
  await expect(page.locator('#menu')).toBeVisible();
  await page.click('#profileBtn');
  await expect(page.locator('#medalGrid')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('#medalGrid .medal.on').first()).toBeVisible();
  await expect(page.locator('#medalGrid .medal.on').first()).toContainText('Первый фраг');
  await page.click('#profileClose');

  // сервер: медаль записана за логином (POST /api/medal при разблокировке)
  const pr = await request.get(`/api/profile?login=${encodeURIComponent(login)}`);
  expect(pr.ok()).toBe(true);
  const pd = (await pr.json()) as ProfileResp;
  expect(pd.medals ?? [], 'сервер отдал медали профиля').toContain('first_kill');
});
