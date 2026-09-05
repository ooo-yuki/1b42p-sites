import { test, expect } from '@playwright/test';

test.describe('МТТ VI — арена от 1-го лица', () => {
  let errors: string[] = [];
  test.beforeEach(async ({ page }) => {
    errors = [];
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 200));
    });
    await page.goto('/');
    await expect(page).toHaveTitle(/42 LIVE/);
  });

  test('меню грузится, GO стартует игру', async ({ page }) => {
    await expect(page.locator('#goBtn')).toBeVisible();
    await page.click('#goBtn');
    await expect(page.locator('#menu')).toHaveCount(0);
    await expect(page.locator('#mm')).toHaveCount(0);
    await expect(page.locator('#joy')).toBeAttached();
    await expect(page.locator('#hitBtn')).toBeAttached();
  });

  test('W идёт: позиция меняется (баг Саши)', async ({ page }) => {
    await page.click('#goBtn');
    const p0 = await page.evaluate(() => (window as unknown as { __mtt: { pos: () => object } }).__mtt.pos());
    await page.keyboard.down('w');
    await page.waitForTimeout(2500);
    await page.keyboard.up('w');
    const p1 = await page.evaluate(() => (window as unknown as { __mtt: { pos: () => { x: number; z: number } } }).__mtt.pos());
    expect(p1).not.toEqual(p0);
  });

  test('джойстик слева двигает, кнопка справа бьёт', async ({ page }) => {
    await page.click('#goBtn');
    const p0 = await page.evaluate(() => (window as unknown as { __mtt: { pos: () => object } }).__mtt.pos());
    await page.evaluate(() => (window as unknown as { __mtt: { joy: (x: number, y: number) => void } }).__mtt.joy(0, -1));
    await page.waitForTimeout(2000);
    await page.evaluate(() => (window as unknown as { __mtt: { joy: (x: number, y: number) => void } }).__mtt.joy(0, 0));
    const p1 = await page.evaluate(() => (window as unknown as { __mtt: { pos: () => object } }).__mtt.pos());
    expect(p1).not.toEqual(p0);
    await page.click('#hitBtn');
    await page.waitForTimeout(600);
    const hud = await page.locator('#hud').innerText();
    expect(hud).toMatch(/❤️ \d+/);
  });

  test('HP игрока и враги на месте', async ({ page }) => {
    await page.click('#goBtn');
    await page.waitForTimeout(1500);
    const st = await page.evaluate(() => (window as unknown as { __mtt: { pos: () => { hp: number; enemies: number } } }).__mtt.pos());
    expect(st.hp).toBeGreaterThan(0);
    expect(st.enemies).toBeGreaterThan(0);
    await expect(page.locator('#hpFill')).toBeVisible();
  });

  test('без копов и тачки: нет звёзд/нитро', async ({ page }) => {
    await page.click('#goBtn');
    const hud = await page.locator('#hud').innerText();
    expect(hud).not.toMatch(/★/);
    expect(hud).not.toMatch(/НИТРО/);
    await expect(page.locator('#camBtn')).toHaveCount(0);
  });

  test('враги не в стенах, оружие на экране', async ({ page }) => {
    await page.click('#goBtn');
    await page.waitForTimeout(1000);
    const st = await page.evaluate(() => {
      const m = (window as unknown as {
        __mtt: {
          spots: () => Array<{ x: number; z: number }>;
          solids: () => Array<{ x: number; z: number; r: number }>;
        };
      }).__mtt;
      return { spots: m.spots(), solids: m.solids() };
    });
    expect(st.spots.length).toBeGreaterThan(0);
    for (const s of st.spots) {
      for (const o of st.solids) {
        expect(Math.hypot(s.x - o.x, s.z - o.z)).toBeGreaterThan(o.r + 0.5);
      }
    }
    await expect(page.locator('#weapon img')).toBeVisible();
  });

  test('магазин: покупка биты и выбор оружия', async ({ page }) => {
    await page.click('#goBtn');
    await page.evaluate(() => (window as unknown as { __mtt: { give: (n: number) => number } }).__mtt.give(1000));
    await page.evaluate(() => (window as unknown as { __mtt: { setWave: (n: number) => number } }).__mtt.setWave(2));
    await page.click('#shopBtn');
    await expect(page.locator('.sheet')).toContainText('Оружейка');
    await page.click('#buy-bat');
    await expect(page.locator('#hud')).toContainText('Бита');
    await page.click('#sel-fists');
    await expect(page.locator('#hud')).toContainText('Кулаки');
    await page.click('.wclose');
  });

  test('возрождение поднимает после завала', async ({ page }) => {
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    await page.evaluate(() => (window as unknown as { __mtt: { hurt: (n: number) => number } }).__mtt.hurt(500));
    await expect(page.locator('#reviveBtn')).toBeVisible();
    await page.click('#reviveBtn');
    await expect(page.locator('#reviveBtn')).toHaveCount(0);
    const hp = await page.evaluate(() => (window as unknown as { __mtt: { hp: () => number } }).__mtt.hp());
    expect(hp).toBe(100);
  });

  test('настройки: звук и чувствительность', async ({ page }) => {
    await page.click('#goBtn');
    await page.click('#setBtn');
    await expect(page.locator('.sheet')).toContainText('Настройки');
    await page.click('#soundBtn');
    await page.locator('#sensRange').fill('2');
    await page.click('.wclose');
    await expect(page.locator('.modal')).toHaveCount(0);
  });

  test('бита закрыта на 1-й волне', async ({ page }) => {
    await page.click('#goBtn');
    await page.evaluate(() => (window as unknown as { __mtt: { give: (n: number) => number } }).__mtt.give(1000));
    await page.click('#shopBtn');
    await expect(page.locator('.sheet')).toContainText('С ВОЛНЫ 2');
    await expect(page.locator('#buy-bat')).toHaveCount(0);
    await page.click('.wclose');
  });

  test('плашка нового раунда всплывает', async ({ page }) => {
    await page.click('#goBtn');
    await expect(page.locator('#waveBanner')).toBeVisible();
    await expect(page.locator('#waveBanner')).toContainText('ВОЛНА 1');
  });

  test('API: валидация и топ без мусора', async ({ request }) => {
    const bad = await request.post('/api/score', { data: { nick: 'pw', score: -5, coins: 1 } });
    expect(bad.status()).toBe(400);
    const list = await request.get('/api/scores');
    expect(list.ok()).toBeTruthy();
    const rows = await list.json();
    expect(Array.isArray(rows)).toBeTruthy();
  });

  test.afterEach(async () => {
    expect(errors, 'ошибки браузера: ' + errors.join(' | ').slice(0, 500)).toEqual([]);
  });
});
