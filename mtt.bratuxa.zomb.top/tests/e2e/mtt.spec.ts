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
    await expect(page.locator('#authBox')).toBeVisible();
    await page.click('#guestBtn');
    await expect(page.locator('#goBtn')).toBeVisible();
    await page.click('#goBtn');
    await expect(page.locator('#menu')).toHaveCount(0);
    await expect(page.locator('#mm')).toHaveCount(0);
    await expect(page.locator('#joy')).toBeAttached();
    await expect(page.locator('#hitBtn')).toBeAttached();
  });

  test('W идёт: позиция меняется (баг Саши)', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#goBtn');
    const p0 = await page.evaluate(() => (window as unknown as { __mtt: { pos: () => object } }).__mtt.pos());
    await page.keyboard.down('w');
    // держим до сдвига (под нагрузкой кадры редкие)
    let moved = false;
    for (let i = 0; i < 30 && !moved; i++) {
      await page.waitForTimeout(300);
      const p = await page.evaluate(() => (window as unknown as { __mtt: { pos: () => object } }).__mtt.pos());
      moved = JSON.stringify(p) !== JSON.stringify(p0);
    }
    await page.keyboard.up('w');
    expect(moved).toBe(true);
  });

  test('джойстик слева двигает, кнопка справа бьёт', async ({ page }) => {
    await page.click('#guestBtn');
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
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.waitForTimeout(1500);
    const st = await page.evaluate(() => (window as unknown as { __mtt: { pos: () => { hp: number; enemies: number } } }).__mtt.pos());
    expect(st.hp).toBeGreaterThan(0);
    expect(st.enemies).toBeGreaterThan(0);
    await expect(page.locator('#hpFill')).toBeVisible();
  });

  test('без копов и тачки: нет звёзд/нитро', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#goBtn');
    const hud = await page.locator('#hud').innerText();
    expect(hud).not.toMatch(/★/);
    expect(hud).not.toMatch(/НИТРО/);
    await expect(page.locator('#camBtn')).toHaveCount(0);
  });

  test('враги не в стенах, оружие на экране', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.waitForTimeout(1000);
    const st = await page.evaluate(() => {
      const m = (window as unknown as {
        __mtt: {
          spots: () => Array<{ x: number; z: number }>;
          solids: () => Array<{ x: number; z: number; hx: number; hz: number; r: number }>;
        };
      }).__mtt;
      return { spots: m.spots(), solids: m.solids() };
    });
    expect(st.spots.length).toBeGreaterThan(0);
    expect(st.solids.length).toBeGreaterThan(10);
    for (const s of st.spots) {
      for (const o of st.solids) {
        // дистанция до коробки ровно по её размеру (AABB), запас 0.5м
        const cx = Math.max(o.x - o.hx, Math.min(s.x, o.x + o.hx));
        const cz = Math.max(o.z - o.hz, Math.min(s.z, o.z + o.hz));
        expect(Math.hypot(s.x - cx, s.z - cz)).toBeGreaterThan(0.5);
      }
    }
    await expect(page.locator('#weapon img')).toBeVisible();
  });

  test('магазин: покупка биты и выбор оружия', async ({ page }) => {
    await page.click('#guestBtn');
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
    await page.click('#guestBtn');
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
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.click('#setBtn');
    await expect(page.locator('.sheet')).toContainText('Настройки');
    await page.click('#soundBtn');
    await page.locator('#sensRange').fill('2');
    await page.click('.sheet button:has-text("ЗАКРЫТЬ")');
    await expect(page.locator('.modal')).toHaveCount(0);
  });

  test('бита закрыта на 1-й волне', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.evaluate(() => (window as unknown as { __mtt: { give: (n: number) => number } }).__mtt.give(1000));
    await page.click('#shopBtn');
    await expect(page.locator('.sheet')).toContainText('С ВОЛНЫ 2');
    await expect(page.locator('#buy-bat')).toHaveCount(0);
    await page.click('.wclose');
  });

  test('плашка нового раунда всплывает', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await expect(page.locator('#waveBanner')).toBeVisible();
    await expect(page.locator('#waveBanner')).toContainText('ВОЛНА 1');
  });

  test('управление переназначается и сохраняется', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.click('#setBtn');
    await expect(page.locator('#keysSec')).toBeVisible();
    await page.click('#key-hit');
    await page.keyboard.press('k');
    await expect(page.locator('#key-hit')).toContainText('K');
    // сейв переживает перезагрузку
    await page.reload();
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.click('#setBtn');
    await expect(page.locator('#key-hit')).toContainText('K');
    // сброс возвращает J
    await page.click('.sheet .wclose:first-of-type');
    await expect(page.locator('#key-hit')).toContainText('J');
  });

  test('прыжок поднимает игрока', async ({ page }) => {
    await page.click('#guestBtn');
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
    await page.click('#guestBtn');
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
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    await expect(page.locator('#swingFx')).toHaveCount(0);
    const box = await page.locator('#weapon').boundingBox();
    expect(box?.width ?? 0).toBeGreaterThan(500);
    // держим удар до результата (под нагрузкой кадры редкие)
    await page.keyboard.down('j');
    await expect(page.locator('#weapon.swing')).toHaveCount(1, { timeout: 8000 });
    await page.keyboard.up('j');
  });

  test('выбор персонажа сохраняется', async ({ page }) => {
    await page.click('#guestBtn');
    await expect(page.locator('#charSec .charCard')).toHaveCount(2);
    await page.click('#char-krysa');
    await expect(page.locator('#char-krysa.sel')).toHaveCount(1);
    expect(await page.evaluate(() => (window as unknown as { __mtt: { chara: () => string } }).__mtt.chara())).toBe('krysa');
    await page.reload();
    await page.click('#guestBtn');
    await expect(page.locator('#char-krysa.sel')).toHaveCount(1);
    await page.click('#char-mtt');
    await expect(page.locator('#char-mtt.sel')).toHaveCount(1);
  });

  test('рывок строго по взгляду, не вбок', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    const p0 = await page.evaluate(() => (window as unknown as { __mtt: { pos: () => { x: number; z: number } } }).__mtt.pos());
    // стрейф вправо + рывок: рывок должен унести вперёд (по взгляду, -z), а не вбок.
    // держим до результата: под нагрузкой кадры редкие
    await page.keyboard.down('d');
    await page.keyboard.down('c');
    let dz = 0;
    for (let i = 0; i < 20 && dz <= 2; i++) {
      await page.waitForTimeout(200);
      const p = await page.evaluate(() => (window as unknown as { __mtt: { pos: () => { x: number; z: number } } }).__mtt.pos());
      dz = p0.z - p.z;
    }
    await page.keyboard.up('c');
    await page.keyboard.up('d');
    expect(dz).toBeGreaterThan(2);
  });

  test('крыса прыгает в 3 раза выше', async ({ page }) => {
    await page.evaluate(() => (window as unknown as { __mtt: { charaSet: (id: string) => string } }).__mtt.charaSet('krysa'));
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    await page.keyboard.down('Space');
    // headless идёт медленнее реала (dt clamp) — долгое окно с ранним выходом
    let maxPy = 0;
    for (let i = 0; i < 90 && maxPy <= 2.2; i++) {
      await page.waitForTimeout(200);
      const py = await page.evaluate(() => (window as unknown as { __mtt: { py: () => number } }).__mtt.py());
      if (py > maxPy) maxPy = py;
    }
    await page.keyboard.up('Space');
    // МТТ ~0.96м, у Крысы ×3 ≈ 2.9м
    expect(maxPy).toBeGreaterThan(2.2);
  });

  test('крыса отпрыгивает от стены', async ({ page }) => {
    await page.evaluate(() => (window as unknown as { __mtt: { charaSet: (id: string) => string } }).__mtt.charaSet('krysa'));
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    // телепорт к коробке (0,-38), смотрим на неё (yaw 0 = взгляд на -z)
    await page.evaluate(() => (window as unknown as { __mtt: { teleport: (x: number, z: number, y: number) => void } }).__mtt.teleport(0, -28, 0));
    // бежим в стену с зажатым прыжком: добегаем, взмываем, у стены — вол-кик ещё выше
    await page.keyboard.down('w');
    await page.keyboard.down('Space');
    let maxPy = 0;
    let wallSeen = false;
    let kickSeen = false;
    let prevZ = -28;
    let backSeen = false;
    for (let i = 0; i < 120 && !(wallSeen && kickSeen && backSeen && maxPy > 3.2); i++) {
      await page.waitForTimeout(200);
      const py = await page.evaluate(() => (window as unknown as { __mtt: { py: () => number } }).__mtt.py());
      if (py > maxPy) maxPy = py;
      const w = await page.evaluate(() => (window as unknown as { __mtt: { wall: () => number } }).__mtt.wall());
      if (w > 0) wallSeen = true;
      const k = await page.evaluate(() => (window as unknown as { __mtt: { kick: () => number } }).__mtt.kick());
      if (k > 0) kickSeen = true;
      const pz = await page.evaluate(() => (window as unknown as { __mtt: { pos: () => { z: number } } }).__mtt.pos());
      // бежим вперёд (-z): рост z после кика = швырнуло назад, против движения
      if (kickSeen && pz.z - prevZ > 0.3) backSeen = true;
      prevZ = pz.z;
    }
    await page.keyboard.up('Space');
    await page.keyboard.up('w');
    expect(wallSeen).toBe(true);
    // вол-кик сработал — кд 5с взведено
    expect(kickSeen).toBe(true);
    // кик швыряет против движения (назад)
    expect(backSeen).toBe(true);
    // чистый прыжок Крысы ~2.9м, с вол-киком обязано быть выше
    expect(maxPy).toBeGreaterThan(3.2);
  });

  test('летуны парят и бьются', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    const n = await page.evaluate(() => (window as unknown as { __mtt: { spawnKind: (k: string) => number } }).__mtt.spawnKind('fly'));
    expect(n).toBe(1);
    const c = await page.evaluate(() => (window as unknown as { __mtt: { flyers: () => number } }).__mtt.flyers());
    expect(c).toBe(1);
  });

  test('рывок МТТ на C: бросок и кд', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    const p0 = await page.evaluate(() => (window as unknown as { __mtt: { pos: () => { x: number; z: number } } }).__mtt.pos());
    // держим C до срабатывания (под нагрузкой кадры редкие)
    await page.keyboard.down('c');
    let dash = 0;
    for (let i = 0; i < 40 && dash <= 0; i++) {
      await page.waitForTimeout(200);
      dash = await page.evaluate(() => (window as unknown as { __mtt: { dash: () => number } }).__mtt.dash());
    }
    await page.keyboard.up('c');
    const p1 = await page.evaluate(() => (window as unknown as { __mtt: { pos: () => { x: number; z: number } } }).__mtt.pos());
    const dist = Math.hypot(p1.x - p0.x, p1.z - p0.z);
    expect(dash).toBeGreaterThan(0);
    // headless медленный: рывок 0.18с игрового времени ≈ 1 кадр ≈ 1.1м
    expect(dist).toBeGreaterThan(0.5);
    await expect(page.locator('#hudRow2')).toContainText('⚡');
  });

  test('по союзникам урона нет и ошибок нет', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    // ставим союзника прямо перед носом (смотрим на -z) и лупим ударами
    await page.evaluate(() => (window as unknown as { __mtt: { setRemotes: (l: object[]) => void } }).__mtt.setRemotes([
      { nick: 'СОЮЗ', char: 'krysa', x: 0, z: 20, hp: 100 },
    ]));
    for (let i = 0; i < 4; i++) {
      await page.evaluate(() => (window as unknown as { __mtt: { attack: () => number } }).__mtt.attack());
      await page.waitForTimeout(500);
    }
    const mates = await page.evaluate(() => (window as unknown as { __mtt: { remoteList: () => Array<{ nick: string; hp: number }> } }).__mtt.remoteList());
    expect(mates.find((m) => m.nick === 'СОЮЗ')?.hp).toBe(100);
    expect(errors).toEqual([]);
  });

  test('качество графики переключается и сохраняется', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.click('#setBtn');
    await expect(page.locator('#qualityBtn')).toContainText('БЫСТРО');
    await page.click('#qualityBtn');
    await expect(page.locator('#qualityBtn')).toContainText('КРАСИВО');
    await page.reload();
    await page.click('#guestBtn');
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

  test('рывок вверх: смотришь в небо — летишь', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    // взгляд вверх: pitch+ (addLook: yaw -= dx*.., pitch -= dy*..)
    await page.evaluate(() => (window as unknown as { __mtt: { look: (x: number, y: number) => void } }).__mtt.look(0, -300));
    const ok = await page.evaluate(() => (window as unknown as { __mtt: { doDash: () => boolean } }).__mtt.doDash());
    expect(ok).toBe(true);
    let maxPy = 0;
    for (let i = 0; i < 20 && maxPy <= 0.5; i++) {
      await page.waitForTimeout(200);
      maxPy = Math.max(maxPy, await page.evaluate(() => (window as unknown as { __mtt: { py: () => number } }).__mtt.py()));
    }
    expect(maxPy).toBeGreaterThan(0.5);
  });

  test('рега и вход: логин+пароль', async ({ request }) => {
    const login = `pw${Date.now() % 100000}`;
    const reg = await request.post('/api/register', { data: { login, pass: 'test1234' } });
    expect(reg.ok()).toBe(true);
    const { token } = await reg.json();
    expect(typeof token).toBe('string');
    const dup = await request.post('/api/register', { data: { login, pass: 'test1234' } });
    expect(dup.status()).toBe(409);
    const bad = await request.post('/api/login', { data: { login, pass: 'wrong' } });
    expect(bad.status()).toBe(401);
    const li = await request.post('/api/login', { data: { login, pass: 'test1234' } });
    expect(li.ok()).toBe(true);
    const me = await request.get(`/api/me?token=${encodeURIComponent(((await li.json()) as { token: string }).token)}`);
    expect(me.ok()).toBe(true);
    expect((await me.json()).login).toBe(login);
  });

  test('окно входа в меню', async ({ page }) => {
    await expect(page.locator('#authBox')).toBeVisible();
    await expect(page.locator('#goBtn')).toHaveCount(0);
    const login = `ui${Date.now() % 100000}`;
    await page.fill('#authLogin', login);
    await page.fill('#authPass', 'test1234');
    await page.click('#regBtn');
    await expect(page.locator('#authWho')).toContainText(login, { timeout: 15000 });
    await expect(page.locator('#goBtn')).toBeVisible();
    await page.reload();
    await expect(page.locator('#authWho')).toContainText(login, { timeout: 15000 });
    await page.click('#authOut');
    await expect(page.locator('#authBox')).toBeVisible();
  });

  test('дуэль 1×1: раунды и победа на сервере', async ({ request }) => {
    const c = await request.post('/api/rooms', { data: { nick: 'D1', name: 'DUEL', mode: 'duel' } });
    expect(c.ok()).toBe(true);
    const { id, sid: s1 } = await c.json();
    const j = await request.post(`/api/rooms/${id}/join`, { data: { nick: 'D2' } });
    expect(j.ok()).toBe(true);
    const { sid: s2 } = await j.json();
    // третий — мимо, дуэль строго 1 на 1
    const j3 = await request.post(`/api/rooms/${id}/join`, { data: { nick: 'D3' } });
    expect(j3.status()).toBe(403);
    await request.post(`/api/rooms/${id}/beat`, { data: { sid: s1, x: 0, z: 20, hp: 100 } });
    const b2 = await request.post(`/api/rooms/${id}/beat`, { data: { sid: s2, x: 0, z: -20, hp: 100 } });
    const d = await b2.json();
    expect(d.duel.active).toBe(true);
    expect(d.duel.foe.nick).toBe('D1');
    expect(d.duel.myHp).toBe(100);
    // добиваем: 70hp за 1 удар не убить, бьём дважды
    await request.post(`/api/rooms/${id}/hit`, { data: { sid: s2, dmg: 70 } });
    const kill = await request.post(`/api/rooms/${id}/hit`, { data: { sid: s2, dmg: 70 } });
    const kd = await kill.json();
    expect(kd.wins).toBe(1);
    expect(kd.round).toBe(2);
    const b1 = await request.post(`/api/rooms/${id}/beat`, { data: { sid: s1, x: 0, z: -20, hp: 100 } });
    const d1 = await b1.json();
    expect(d1.duel.myHp).toBe(100);
    expect(d1.duel.round).toBe(2);
    await request.post(`/api/rooms/${id}/leave`, { data: { sid: s1 } });
    await request.post(`/api/rooms/${id}/leave`, { data: { sid: s2 } });
  });

  test('дуэль в клиенте: вход на новую карту', async ({ page, request }) => {
    const c = await request.post('/api/rooms', { data: { nick: 'D1', name: 'DROOM', mode: 'duel' } });
    const { id } = await c.json();
    await page.click('#guestBtn');
    await page.fill('#nick', 'D2');
    await page.click('button:has-text("ОБНОВИТЬ")');
    await page.click(`#join-${id}`);
    await expect(page.locator('#goBtn')).toContainText('ДУЭЛЬ');
    await page.click('#goBtn');
    await page.waitForTimeout(1000);
    const map = await page.evaluate(() => (window as unknown as { __mtt: { map: () => string } }).__mtt.map());
    expect(map).toBe('duel');
    const p = await page.evaluate(() => (window as unknown as { __mtt: { pos: () => { x: number; z: number } } }).__mtt.pos());
    expect(Math.abs(p.x)).toBeLessThan(2);
    expect(Math.abs(p.z - -20)).toBeLessThan(2);
    await page.click('#roomLeave');
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
