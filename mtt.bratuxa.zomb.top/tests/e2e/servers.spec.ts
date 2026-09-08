import { test, expect, type Page } from '@playwright/test';

type M = {
  pos: () => { x: number; z: number; yaw: number };
  hp: () => number;
  py: () => number;
  attack: () => number;
  hurt: (n: number) => number;
  foes: () => Array<{ id: number; x: number; z: number; hp: number; dead: boolean; ey: number; climb: boolean; god: boolean }>;
  stalkCount: () => number;
  stalkers: () => number;
  specOn: () => boolean;
  keys: () => { jump: string };
  fps: () => number;
};

async function boot(page: Page): Promise<void> {
  await page.goto('/');
  await expect(page).toHaveTitle(/42 LIVE/);
  await page.click('#guestBtn');
}

async function createAndGo(page: Page, mode: string): Promise<void> {
  // официальные режимы создаются только кодом (из вкладки комнат кнопки убраны)
  await page.evaluate((m) => (window as unknown as { __mtt: { mkroom: (name: string, mode: string) => Promise<void> } }).__mtt.mkroom('Тест', m), mode);
  await page.click('#nav-play');
  await page.click('#goBtn');
  await page.waitForTimeout(2500);
}

function mtt(page: Page): Promise<M> {
  return page.evaluate(() => (window as unknown as { __mtt: M }).__mtt);
}

test('сервера: официальные только во вкладке серверов, плашки красивые', async ({ page }) => {
  await boot(page);
  await page.click('#nav-rooms');
  await expect(page.locator('#join-PVP42X')).toHaveCount(0);
  await expect(page.locator('#join-END42X')).toHaveCount(0);
  await expect(page.locator('#join-INV42X')).toHaveCount(0);
  await page.click('#nav-servers');
  await expect(page.locator('.srvcard').first()).toBeVisible({ timeout: 15000 });
  const cards = await page.locator('.srvcard').count();
  expect(cards).toBeGreaterThanOrEqual(3);
  const txt = await page.locator('#serversSec').innerText();
  expect(txt).toContain('PvP-арена');
  expect(txt).toContain('Бэкрумс');
  expect(txt).toContain('Нашествие');
  // кнопка входа на месте
  expect(await page.locator('#srv-PVP42X').count()).toBe(1);
});

test('перф: счётчик FPS внизу экрана, кадры идут', async ({ page }) => {
  await boot(page);
  await page.click('#goBtn');
  await expect(page.locator('#fps')).toBeVisible({ timeout: 30000 });
  await page.waitForTimeout(3000);
  const txt = await page.locator('#fps').innerText();
  const fps = Number((txt.match(/(\d+)/) ?? ['0', '0'])[1]);
  expect(fps).toBeGreaterThan(0);
});

test('бэкрумс: 5 сталкеров у хоста, потолок держит', async ({ page }) => {
  await boot(page);
  await createAndGo(page, 'endless');
  // хост выпускает сталкеров через пульс
  let n = 0;
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(1000);
    n = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.stalkCount());
    if (n >= 5) break;
  }
  expect(n).toBe(5);
  // потолок: прыгаем 6 секунд, py не улетает выше 1.7
  const jumpKey = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.keys().jump);
  let maxPy = 0;
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press(jumpKey);
    await page.waitForTimeout(1000);
    const py = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.py());
    if (py > maxPy) maxPy = py;
  }
  expect(maxPy).toBeLessThan(1.7);
});

test('нашествие: орда 11 скалолазов на 1-й волне', async ({ page }) => {
  await boot(page);
  await createAndGo(page, 'invasion');
  let foes: Array<{ id: number; climb: boolean }> = [];
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(1000);
    foes = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.foes());
    if (foes.length >= 11) break;
  }
  expect(foes.length).toBeGreaterThanOrEqual(11);
  expect(foes.some((f) => f.climb)).toBe(true);
});

test('наблюдатель: смерть → watch → без вмешательства → выход в лобби', async ({ page }) => {
  await boot(page);
  await createAndGo(page, 'endless');
  // гасим щит выстрелом, потом смертельный урон
  await page.evaluate(() => {
    const m = (window as unknown as { __mtt: M }).__mtt;
    m.attack();
    m.hurt(9999);
  });
  await expect(page.locator('#specWatchBtn')).toBeVisible({ timeout: 10000 });
  await page.click('#specWatchBtn');
  await expect(page.locator('#specBar')).toBeVisible({ timeout: 10000 });
  const on = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.specOn());
  expect(on).toBe(true);
  // наблюдатель не вмешивается: удары в пустоту
  const hits = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.attack());
  expect(hits).toBe(0);
  // возрождения нет — только выход в лобби (в меню, не обратно на сервер)
  await page.click('#specLobbyBtn2');
  await expect(page.locator('#menu')).toBeVisible({ timeout: 10000 });
});
