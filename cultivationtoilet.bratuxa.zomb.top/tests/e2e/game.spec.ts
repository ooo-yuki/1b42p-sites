import { expect, test, type Page } from '@playwright/test';

const run = Date.now().toString(36);

interface CtState {
  pulls: number;
  money: number;
  inv: { id: string; sell: number }[];
  upg: Record<string, number>;
  login: string;
  cells: { x: number; z: number; kind: string }[];
  buildCost: number;
}

interface CtApi {
  state: () => CtState | null;
  sid: () => string;
  pull: () => void;
  look: (yaw: number, pitch: number) => void;
  promptVisible: () => boolean;
  world: () => { toilet: unknown } | null;
}

async function st(page: Page): Promise<CtState> {
  const s = await page.evaluate(() => (window as unknown as { __ct: CtApi }).__ct.state());
  if (!s) throw new Error('state is null');
  return s;
}
const ct = (page: Page, fn: string, ...args: unknown[]) =>
  page.evaluate(
    ([f, a]) => (window as unknown as { __ct: Record<string, (...x: unknown[]) => unknown> }).__ct[f as string](...(a as unknown[])),
    [fn, args],
  );

async function register(page: Page, nick: string): Promise<void> {
  await page.goto('/');
  await page.fill('#nick', nick);
  await page.fill('#pass', 'test1234');
  await page.click('#regBtn');
  await expect(page.locator('#menu')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('#whoami')).toHaveText(nick);
}

async function start(page: Page): Promise<void> {
  await page.click('#startBtn');
  await expect(page.locator('#game')).toBeVisible({ timeout: 15000 });
  const ok = await page.evaluate(() => {
    const w = (window as unknown as { __ct: CtApi }).__ct.world();
    return !!w && !!w.toilet;
  });
  expect(ok, 'мир построен, унитаз на месте').toBe(true);
}

test('вход, мир от первого лица, бирка у туалета, смыв, кулдаун и апгрейд', async ({ page }) => {
  const nick = 'a' + run;
  await register(page, nick);
  await start(page);

  // смотрим на унитаз — появляется бирка «ПОПЫТАТЬ УДАЧУ»
  await ct(page, 'look', 0, -0.6);
  await expect(page.locator('#prompt')).toBeVisible({ timeout: 10000 });

  // смыв клавишей E двигает счётчик
  const before = (await st(page)).pulls;
  await page.keyboard.press('e');
  await expect.poll(async () => (await st(page)).pulls, { timeout: 10000 }).toBe(before + 1);
  await expect(page.locator('.toast').first()).toBeVisible();

  // серверный кулдаун: два прямых вызова подряд — второй 429
  await page.waitForTimeout(1300);
  const sid = await page.evaluate(() => (window as unknown as { __ct: CtApi }).__ct.sid());
  const codes = await page.evaluate(async (s) => {
    const call = async () =>
      fetch('/api/pull', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sid: s }) }).then((r) => r.status);
    return [await call(), await call()];
  }, sid);
  expect(codes).toEqual([200, 429]);

  // пассивный доход: деньги позволяют купить прокачку
  // Tab снимает захват мыши — иначе клики уходят в canvas
  await page.keyboard.press('Tab');
  await page.click('.tab[data-tab="upg"]');
  await expect(page.locator('#buy-toilet')).toBeEnabled({ timeout: 40000 });
  await page.click('#buy-toilet');
  await expect.poll(async () => (await st(page)).upg.toilet).toBeGreaterThanOrEqual(2);

  // журнал заполняется
  await page.click('.tab[data-tab="log"]');
  await expect(page.locator('#logList .logline').first()).toBeVisible();
});

test('стройка клетки 2×2 м за ресурсы — кнопкой направления', async ({ page }) => {
  const nick = 'b' + run;
  await register(page, nick);
  await start(page);

  // копим монеты смывами, пока не хватит на клетку
  await expect
    .poll(
      async () => {
        const s = await st(page);
        if (s && s.money >= s.buildCost) return true;
        await ct(page, 'pull');
        await page.waitForTimeout(1300);
        return false;
      },
      { timeout: 70000 },
    )
    .toBe(true);

  const before = (await st(page)).cells.length;
  await page.keyboard.press('Tab'); // снять захват мыши, чтобы дойти до кнопок стройки
  await page.click('.btn.dir[data-dir="s"]');
  await expect.poll(async () => (await st(page)).cells.length, { timeout: 15000 }).toBe(before + 1);
  // на юге от клетки спавна появилась обычная клетка
  const cells = (await st(page)).cells;
  expect(cells.some((c) => c.kind === 'room')).toBe(true);
});

test('общая площадка: A выставляет лот, B покупает', async ({ page, browser }) => {
  const nickA = 'sa' + run;
  const nickB = 'sb' + run;

  await register(page, nickA);
  // смывим, пока в инвентаре не появится предмет
  let inv = (await st(page)).inv;
  for (let i = 0; i < 25 && inv.length === 0; i++) {
    await ct(page, 'pull');
    await page.waitForTimeout(1300);
    inv = (await st(page)).inv;
  }
  expect(inv.length, 'после смывов должен выпасть предмет').toBeGreaterThan(0);

  const sell = await page.evaluate(async (arg) => {
    const sid = (window as unknown as { __ct: CtApi }).__ct.sid();
    const r = await fetch('/api/market/sell', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sid, idx: arg.idx, price: 10 }),
    });
    return r.status;
  }, { idx: 0 });
  expect(sell).toBe(200);

  const ctxB = await browser.newContext();
  const pageB = await ctxB.newPage();
  await register(pageB, nickB);
  await pageB.click('.tab[data-tab="market"]');
  const lot = pageB.locator('#marketList .row').filter({ hasText: nickA });
  await expect(lot.first()).toBeVisible({ timeout: 15000 });
  await lot.first().locator('button').click();

  await expect.poll(async () => (await st(pageB)).inv.length, { timeout: 15000 }).toBeGreaterThan(0);

  await page.reload();
  await expect(page.locator('#menu')).toBeVisible({ timeout: 15000 });
  expect((await st(page)).inv.length).toBe(0);
  await ctxB.close();
});

test('рейтинг показывает игрока, вкладки переключаются из меню', async ({ page }) => {
  const nick = 'r' + run;
  await register(page, nick);
  await page.click('.tab[data-tab="rating"]');
  await expect(page.locator(`#ratingList .row[data-nick="${nick}"]`)).toBeVisible({ timeout: 15000 });
  await page.click('.tab[data-tab="inv"]');
  await expect(page.locator('#tab-inv')).toBeVisible();
  await page.click('.tab[data-tab="market"]');
  await expect(page.locator('#marketList')).toBeVisible();
});
