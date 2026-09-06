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
    expect(hp).toBe(120);
  });

  test('настройки: звук и чувствительность', async ({ page }) => {
    await page.click('#goBtn');
    await page.click('#setBtn');
    await expect(page.locator('.sheet')).toContainText('Настройки');
    await page.click('#soundBtn');
    await page.locator('#sensRange').fill('2');
    await page.click('.sheet button:has-text("ЗАКРЫТЬ")');
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

  test('управление переназначается и сохраняется', async ({ page }) => {
    await page.click('#goBtn');
    await page.click('#setBtn');
    await expect(page.locator('#keysSec')).toBeVisible();
    await page.click('#key-hit');
    await page.keyboard.press('k');
    await expect(page.locator('#key-hit')).toContainText('K');
    // сейв переживает перезагрузку
    await page.reload();
    await page.click('#goBtn');
    await page.click('#setBtn');
    await expect(page.locator('#key-hit')).toContainText('K');
    // сброс возвращает J
    await page.click('.sheet .wclose:first-of-type');
    await expect(page.locator('#key-hit')).toContainText('J');
  });

  test('прыжок поднимает игрока', async ({ page }) => {
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    await page.keyboard.down('Space');
    // опрашиваем: под нагрузкой headless-кадры редкие, одного замера мало
    let py = 0;
    for (let i = 0; i < 20 && py <= 0; i++) {
      await page.waitForTimeout(200);
      py = await page.evaluate(() => (window as unknown as { __mtt: { py: () => number } }).__mtt.py());
    }
    await page.keyboard.up('Space');
    expect(py).toBeGreaterThan(0);
  });

  test('враги прыгают', async ({ page }) => {
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    let seen = false;
    for (let i = 0; i < 60 && !seen; i++) {
      await page.waitForTimeout(300);
      const hops = await page.evaluate(() => (window as unknown as { __mtt: { hops: () => number[] } }).__mtt.hops());
      seen = hops.some((h) => h > 0.05);
    }
    expect(seen).toBe(true);
  });

  test('ствол огромный, белых полос нет, замах живёт', async ({ page }) => {
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    await expect(page.locator('#swingFx')).toHaveCount(0);
    const box = await page.locator('#weapon').boundingBox();
    expect(box?.width ?? 0).toBeGreaterThan(500);
    // держим удар (press слишком короткий для редких headless-кадров)
    await page.keyboard.down('j');
    await page.waitForTimeout(500);
    await page.keyboard.up('j');
    await expect(page.locator('#weapon.swing')).toHaveCount(1);
  });

  test('выбор персонажа сохраняется', async ({ page }) => {
    await expect(page.locator('#charSec .charCard')).toHaveCount(2);
    await page.click('#char-krysa');
    await expect(page.locator('#char-krysa.sel')).toHaveCount(1);
    expect(await page.evaluate(() => (window as unknown as { __mtt: { chara: () => string } }).__mtt.chara())).toBe('krysa');
    await page.reload();
    await expect(page.locator('#char-krysa.sel')).toHaveCount(1);
    await page.click('#char-mtt');
    await expect(page.locator('#char-mtt.sel')).toHaveCount(1);
  });

  test('качество графики переключается и сохраняется', async ({ page }) => {
    await page.click('#goBtn');
    await page.click('#setBtn');
    await expect(page.locator('#qualityBtn')).toContainText('БЫСТРО');
    await page.click('#qualityBtn');
    await expect(page.locator('#qualityBtn')).toContainText('КРАСИВО');
    await page.reload();
    await page.click('#goBtn');
    await page.click('#setBtn');
    await expect(page.locator('#qualityBtn')).toContainText('КРАСИВО');
    await page.click('#qualityBtn');
    await expect(page.locator('#qualityBtn')).toContainText('БЫСТРО');
  });

  test('комнаты: создать/войти/пульс/выйти', async ({ request }) => {
    const c = await request.post('/api/rooms', { data: { nick: 'PW1', name: 'PWROOM', char: 'krysa' } });
    expect(c.ok()).toBe(true);
    const { id, sid: sid1 } = await c.json();
    expect(id).toMatch(/^[A-Z0-9]{6}$/);
    const j = await request.post(`/api/rooms/${id}/join`, { data: { nick: 'PW2', char: 'mtt' } });
    expect(j.ok()).toBe(true);
    const { sid: sid2 } = await j.json();
    const b1 = await request.post(`/api/rooms/${id}/beat`, { data: { sid: sid1, char: 'krysa', x: 1, z: 2, yaw: 0, hp: 100, score: 10, kills: 1, wave: 1 } });
    expect(b1.ok()).toBe(true);
    const b2 = await request.post(`/api/rooms/${id}/beat`, { data: { sid: sid2, char: 'mtt', x: 5, z: 6, yaw: 1, hp: 90, score: 20, kills: 2, wave: 1 } });
    const d2 = await b2.json();
    expect(d2.players.some((p: { nick: string }) => p.nick === 'PW1')).toBe(true);
    expect(d2.players[0].x).toBe(1);
    expect(d2.players[0].char).toBe('krysa');
    await request.post(`/api/rooms/${id}/leave`, { data: { sid: sid1 } });
    await request.post(`/api/rooms/${id}/leave`, { data: { sid: sid2 } });
    const list = await request.get('/api/rooms');
    const rooms = (await list.json()) as Array<{ id: string }>;
    expect(rooms.some((r) => r.id === id)).toBe(false);
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
