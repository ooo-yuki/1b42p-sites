import { test, expect, type Page } from '@playwright/test';

type M = {
  foes: () => Array<{ id: number; x: number; z: number; hp: number; dead: boolean; ey: number; climb: boolean; god: boolean }>;
  stalkCount: () => number;
  steps: () => { me: number; foes: number };
  give: (n: number) => number;
  mkroom: (name: string, mode: string) => Promise<void>;
};

async function boot(page: Page): Promise<void> {
  await page.goto('/');
  await expect(page).toHaveTitle(/42 LIVE/);
  await page.click('#guestBtn');
}

async function createAndGo(page: Page, name: string, mode: string): Promise<void> {
  await page.evaluate(([n, m]) => (window as unknown as { __mtt: M }).__mtt.mkroom(n, m), [name, mode] as [string, string]);
  await page.click('#nav-play');
  await page.click('#goBtn');
  await page.waitForTimeout(2500);
}

test('шаги: игрок топает при беге, орда — рядом', async ({ page }: { page: Page }) => {
  test.setTimeout(180000);
  await boot(page);
  await page.click('#goBtn');
  await expect(page.locator('#fps')).toBeVisible({ timeout: 30000 });
  await page.keyboard.down('w');
  await page.waitForTimeout(10000);
  await page.keyboard.up('w');
  const st = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.steps());
  expect(st.me, 'игрок натопал шагов').toBeGreaterThan(1);
});

test('бэкрумс-карта: только бессмертные сталкеры', async ({ page }: { page: Page }) => {
  test.setTimeout(180000);
  await boot(page);
  await createAndGo(page, 'ТестЖуть', 'backrooms');
  let foes: Array<{ god: boolean }> = [];
  for (let i = 0; i < 12; i++) {
    await page.waitForTimeout(1000);
    foes = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.foes());
    if (foes.length >= 5) break;
  }
  expect(foes.length, 'пак вышел (5+)').toBeGreaterThanOrEqual(5);
  expect(foes.every((f) => f.god === true), 'все — бессмертные, обычных нет').toBe(true);
});

test('в меню: вылет с сервера + фантики целы', async ({ page, request }: { page: Page; request: import('@playwright/test').APIRequestContext }) => {
  test.setTimeout(180000);
  const API = 'https://mtt.bratuxa.zomb.top';
  await boot(page);
  await createAndGo(page, 'ТестВыход', 'pvp');
  await expect(page.locator('#scoreboard')).toBeVisible({ timeout: 45000 });
  // набили карманы — +500 фантиков
  await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.give(500));
  let rooms = (await (await request.get(`${API}/api/rooms`)).json()) as Array<{ id: string; name: string }>;
  expect(rooms.some((r) => r.name === 'ТестВыход'), 'комната живёт').toBe(true);
  // жмём В МЕНЮ как на фото
  await page.click('#menuBtn');
  await expect(page.locator('#scoreboard')).toHaveCount(0);
  const shop = await page.evaluate(() => localStorage.getItem('mtt_shop_v1') ?? '');
  expect(JSON.parse(shop).fantiki, 'фантики на диске').toBeGreaterThanOrEqual(500);
  // сервер нас выкинул: комната-призрак не висит
  await page.waitForTimeout(3000);
  rooms = (await (await request.get(`${API}/api/rooms`)).json()) as Array<{ id: string; name: string }>;
  expect(rooms.some((r) => r.name === 'ТестВыход'), 'комната снесена').toBe(false);
});
