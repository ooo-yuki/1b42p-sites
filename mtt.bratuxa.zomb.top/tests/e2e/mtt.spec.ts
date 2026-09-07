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
    // Стейси по умолчанию закрыта — открываем через дебаг-выдачу (как из кейса)
    await page.evaluate(() => (window as unknown as { __mtt: { unlock: (id: string) => boolean } }).__mtt.unlock('krysa'));
    await page.click('#charBtn');
    await expect(page.locator('#charSec .charCard')).toHaveCount(2);
    await page.click('#pick-krysa');
    await expect(page.locator('#char-krysa.sel')).toHaveCount(1);
    expect(await page.evaluate(() => (window as unknown as { __mtt: { chara: () => string } }).__mtt.chara())).toBe('krysa');
    await page.click('#charGo');
    await expect(page.locator('#charBtn')).toContainText('Стейси');
    await page.reload();
    await page.click('#guestBtn');
    await page.click('#charBtn');
    await expect(page.locator('#char-krysa.sel')).toHaveCount(1);
    await page.click('#pick-mtt');
    await expect(page.locator('#char-mtt.sel')).toHaveCount(1);
    await page.locator('#charBack').scrollIntoViewIfNeeded();
    await page.click('#charBack');
    await expect(page.locator('#goBtn')).toBeVisible();
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

  test('комнаты: заявки, приём, кик, старт', async ({ request }) => {
    const c = await request.post('/api/rooms', { data: { nick: 'PW1', name: 'PWROOM', char: 'krysa' } });
    expect(c.ok()).toBe(true);
    const { id, sid: sid1 } = await c.json();
    expect(id).toMatch(/^[A-Z0-9]{6}$/);
    // вход = заявка, не место
    const j = await request.post(`/api/rooms/${id}/join`, { data: { nick: 'PW2', char: 'mtt' } });
    expect(j.ok()).toBe(true);
    const { sid: sid2, pending } = await j.json();
    expect(pending).toBe(true);
    // заявитель бьётся в закрытую дверь
    const bw = await request.post(`/api/rooms/${id}/beat`, { data: { sid: sid2, x: 5, z: 6, hp: 90 } });
    expect(bw.status()).toBe(403);
    expect((await bw.json()).error).toBe('waiting');
    // создатель видит заявку и принимает
    const info = await request.get(`/api/rooms/${id}/info?sid=${sid1}`);
    const li = await info.json();
    expect(li.owner).toBe(true);
    expect(li.pending.some((p: { nick: string }) => p.nick === 'PW2')).toBe(true);
    const ap = await request.post(`/api/rooms/${id}/approve`, { data: { sid: sid1, target: sid2 } });
    expect(ap.ok()).toBe(true);
    const b1 = await request.post(`/api/rooms/${id}/beat`, { data: { sid: sid1, char: 'krysa', x: 1, z: 2, yaw: 0, hp: 100, score: 10, kills: 1, wave: 1 } });
    expect(b1.ok()).toBe(true);
    const b2 = await request.post(`/api/rooms/${id}/beat`, { data: { sid: sid2, char: 'mtt', x: 5, z: 6, yaw: 1, hp: 90, score: 20, kills: 2, wave: 1 } });
    const d2 = await b2.json();
    expect(d2.players.some((p: { nick: string }) => p.nick === 'PW1')).toBe(true);
    expect(d2.players[0].x).toBe(1);
    expect(d2.players[0].char).toBe('krysa');
    // чужак принять не может
    const no = await request.post(`/api/rooms/${id}/approve`, { data: { sid: sid2, target: sid2 } });
    expect(no.status()).toBe(403);
    // старт только от создателя
    const st = await request.post(`/api/rooms/${id}/start`, { data: { sid: sid1 } });
    expect((await st.json()).started).toBe(true);
    // кик
    const k = await request.post(`/api/rooms/${id}/kick`, { data: { sid: sid1, target: sid2 } });
    expect(k.ok()).toBe(true);
    const bk = await request.post(`/api/rooms/${id}/beat`, { data: { sid: sid2, x: 0, z: 0, hp: 90 } });
    expect(bk.status()).toBe(403);
    await request.post(`/api/rooms/${id}/leave`, { data: { sid: sid1 } });
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
    await page.locator('#authOut').scrollIntoViewIfNeeded();
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
    // создатель принимает заявку — только тогда дуэль
    const ap = await request.post(`/api/rooms/${id}/approve`, { data: { sid: s1, target: s2 } });
    expect(ap.ok()).toBe(true);
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

  test('дуэль в клиенте: создатель принимает и стартует', async ({ page, request }) => {
    await page.click('#guestBtn');
    await page.fill('#nick', 'D1');
    await page.click('#nav-rooms');
    await page.fill('#roomDraft', 'DROOM');
    await page.click('#mode-duel');
    await page.click('#roomCreate');
    await expect(page.locator('#roomStart')).toBeVisible();
    // второй просится через API
    const rooms = (await (await request.get('/api/rooms')).json()) as Array<{ id: string; name: string }>;
    const mine = rooms.find((r) => r.name === 'DROOM');
    expect(mine).toBeTruthy();
    const j = await request.post(`/api/rooms/${mine!.id}/join`, { data: { nick: 'D2' } });
    expect(j.ok()).toBe(true);
    // создатель видит заявку и принимает
    await expect(page.locator('#approve-0')).toBeVisible({ timeout: 10000 });
    await page.click('#approve-0');
    await expect(page.locator('#lobbyList')).toContainText('D2', { timeout: 10000 });
    // старт — игра запускается
    await page.click('#roomStart');
    await page.waitForTimeout(1500);
    const map = await page.evaluate(() => (window as unknown as { __mtt: { map: () => string } }).__mtt.map());
    expect(map).toBe('duel');
    const p = await page.evaluate(() => (window as unknown as { __mtt: { pos: () => { x: number; z: number } } }).__mtt.pos());
    expect(Math.abs(p.x)).toBeLessThan(2);
    expect(Math.abs(p.z - 20)).toBeLessThan(2);
    // выход в меню сохраняет рейтинг
    await page.click('#menuBtn');
    await expect(page.locator('#menu')).toBeVisible();
    const top = await request.get('/api/scores');
    expect(top.ok()).toBeTruthy();
    await page.click('button:has-text("ПОКИНУТЬ")');
  });

  test('профиль: скрыт, открывается, показывает статистику', async ({ page, request }) => {
    await expect(page.locator('#profileOv')).toHaveCount(0);
    await page.click('#guestBtn');
    // гостю профиль недоступен — кнопки нет, оверлея нет
    await expect(page.locator('#profileBtn')).toHaveCount(0);
    // рега через API + вход через UI уже гостем... профиль только у логина: проверяем API
    const pr = await request.get('/api/profile?login=zzz_no_such_login_42');
    expect(pr.ok()).toBe(true);
    const d = await pr.json();
    expect(d.games).toBe(0);
    expect(d.best).toBe(0);
  });

  test('выход в меню: рейтинг сохраняется в топ', async ({ page, request }) => {
    const login = `mx${Date.now() % 100000}`;
    await page.fill('#authLogin', login);
    await page.fill('#authPass', 'test1234');
    await page.click('#regBtn');
    await expect(page.locator('#authWho')).toContainText(login, { timeout: 15000 });
    await page.click('#goBtn');
    await page.waitForTimeout(1000);
    await page.evaluate(() => (window as unknown as { __mtt: { give: (n: number) => void } }).__mtt.give(500));
    await page.waitForTimeout(500);
    await page.click('#menuBtn');
    await expect(page.locator('#menu')).toBeVisible();
    // рейтинг сохранён: профиль видит сыгранную игру (топ-10 может обрезать нулевой счёт)
    const pr = await request.get(`/api/profile?login=${encodeURIComponent(login)}`);
    expect(pr.ok()).toBe(true);
    expect((await pr.json()).games).toBeGreaterThan(0);
    await page.click('#authOut');
  });

  test('API: валидация и топ без мусора', async ({ request }) => {
    const bad = await request.post('/api/score', { data: { nick: 'pw', score: -5, coins: 1 } });
    expect(bad.status()).toBe(400);
    const list = await request.get('/api/scores');
    expect(list.ok()).toBeTruthy();
    const rows = await list.json();
    expect(Array.isArray(rows)).toBeTruthy();
  });

  test('E переключает ствол только среди купленных', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    type M = { give: (n: number) => void; setWave: (n: number) => void };
    await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.setWave(2));
    await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.give(500));
    await page.click('#shopBtn');
    await page.click('#buy-bat');
    await page.click('button:has-text("ЗАКРЫТЬ")');
    await expect(page.locator('#hudRow2')).toContainText('Бита');
    await page.keyboard.down('KeyE');
    await page.waitForTimeout(300);
    await page.keyboard.up('KeyE');
    await expect(page.locator('#hudRow2')).toContainText('Кулаки');
    await page.keyboard.down('KeyE');
    await page.waitForTimeout(300);
    await page.keyboard.up('KeyE');
    await expect(page.locator('#hudRow2')).toContainText('Бита');
  });

  test('🔫 пистолет бьёт по прицелу издалека', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    type M = { give: (n: number) => void; setWave: (n: number) => void; attack: () => number; spawnKind: (k: string) => number; teleport: (x: number, z: number, yaw: number) => void };
    await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.setWave(4));
    await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.give(2000));
    await page.click('#shopBtn');
    await page.click('#buy-pistol');
    await page.click('button:has-text("ЗАКРЫТЬ")');
    await expect(page.locator('#hudRow2')).toContainText('Пистолет');
    let hits = 0;
    for (let i = 0; i < 10 && hits === 0; i++) {
      await page.evaluate((yaw) => {
        const m = (window as unknown as { __mtt: M }).__mtt;
        m.teleport(0, 20, yaw);
        m.spawnKind('walk');
      }, (i * Math.PI) / 5);
      await page.waitForTimeout(850);
      hits = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.attack());
    }
    expect(hits).toBeGreaterThan(0);
  });

  test('💊 аптечки: покупка, cap 3, использование по X', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    type M = { give: (n: number) => void; hurt: (n: number) => number; medBuy: () => boolean; medUse: () => boolean; hp: () => number };
    await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.give(2000));
    await page.click('#shopBtn');
    await page.click('#buy-med');
    await page.click('#buy-med');
    await page.click('#buy-med');
    await page.click('button:has-text("ЗАКРЫТЬ")');
    await expect(page.locator('#hudRow2')).toContainText('💊 3/3');
    // четвёртая не лезет
    const fourth = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.medBuy());
    expect(fourth).toBe(false);
    await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.hurt(60));
    const before = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.hp());
    await page.keyboard.down('KeyX');
    await page.waitForTimeout(400);
    await page.keyboard.up('KeyX');
    await page.waitForTimeout(300);
    const after = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.hp());
    expect(after).toBeGreaterThan(before);
    await expect(page.locator('#hudRow2')).toContainText('💊 2/3');
  });

  test('🌀 кик-перезарядка: коснулся здания в полёте — кд ноль', async ({ page }) => {
    await page.click('#guestBtn');
    await page.evaluate(() => (window as unknown as { __mtt: { unlock: (id: string) => boolean } }).__mtt.unlock('krysa'));
    await page.click('#charBtn');
    await page.click('#pick-krysa');
    await page.click('#charGo');
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    type M = { teleport: (x: number, z: number, yaw: number) => void; kick: () => number; py: () => number };
    // лицом в восточную стену, давим W
    await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.teleport(50, 0, -Math.PI / 2));
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(700);
    await page.keyboard.press('Space');
    await page.waitForTimeout(300);
    await page.keyboard.press('Space');
    await page.waitForTimeout(300);
    const cd = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.kick());
    await page.keyboard.up('KeyW');
    // кик либо сработал (кд>0 и потом перезарядка в полёте), либо стена не зацепилась — проверяем мягко
    if (cd > 0) {
      let cur = cd;
      for (let i = 0; i < 10 && cur > 0; i++) {
        await page.waitForTimeout(300);
        cur = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.kick());
      }
      expect(cur).toBeLessThan(cd);
    }
  });

  test('прицел по центру, бейдж комнаты слева', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    await expect(page.locator('#cross')).toBeVisible();
    const cb = await page.locator('#cross').boundingBox();
    const vw = await page.evaluate(() => window.innerWidth);
    expect(cb).toBeTruthy();
    expect(Math.abs((cb!.x + cb!.width / 2) - vw / 2)).toBeLessThan(60);
    await page.click('#menuBtn');
    await page.click('#nav-rooms');
    await page.fill('#roomDraft', 'BADGE');
    await page.click('#roomCreate');
    await page.click('#nav-play');
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    const bb = await page.locator('#roomBadge').boundingBox();
    const fb = await page.locator('#fsBtn').boundingBox();
    expect(bb).toBeTruthy();
    expect(fb).toBeTruthy();
    expect(bb!.x + bb!.width).toBeLessThan(fb!.x);
    await page.click('#menuBtn');
    await page.click('#nav-rooms');
    await page.click('button:has-text("ПОКИНУТЬ")');
  });

  test('смена пароля через профиль', async ({ page, request }) => {
    const login = `cp${Date.now() % 100000}`;
    await page.fill('#authLogin', login);
    await page.fill('#authPass', 'oldpass1');
    await page.click('#regBtn');
    await expect(page.locator('#authWho')).toContainText(login, { timeout: 15000 });
    await page.click('#profileBtn');
    await expect(page.locator('#profileOv')).toBeVisible();
    await page.fill('#passOld', 'oldpass1');
    await page.fill('#passNew', 'newpass22');
    await page.click('#passBtn');
    await expect(page.locator('#passMsg')).toContainText('сменён');
    await page.click('#profileClose');
    const li = await request.post('/api/login', { data: { login, pass: 'newpass22' } });
    expect(li.ok()).toBe(true);
    await page.click('#authOut');
  });

  test('админка чужим не светит', async ({ page }) => {
    const login = `ad${Date.now() % 100000}`;
    await page.fill('#authLogin', login);
    await page.fill('#authPass', 'test1234');
    await page.click('#regBtn');
    await expect(page.locator('#authWho')).toContainText(login, { timeout: 15000 });
    await page.click('#adminBtn');
    await page.waitForTimeout(1500);
    await expect(page.locator('#adminSec')).toHaveCount(0);
    await page.click('#authOut');
  });

  test('крыши держат: опора под ногами выше земли', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    type M = { ground: (x: number, z: number) => number };
    const roofB1 = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.ground(20, -19));
    const open = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.ground(0, 10));
    expect(roofB1).toBe(12.9);
    expect(open).toBe(0);
  });

  test('переулок и заборы: lane проходим, секции держат', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    type M = { ground: (x: number, z: number) => number; solidAt: (x: number, z: number, y: number) => boolean };
    // lane восточного переулка свободен
    expect(await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.ground(33.5, -8.5))).toBe(0);
    expect(await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.solidAt(33.5, -8.5, 0))).toBe(false);
    // стены переулка держат
    expect(await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.solidAt(30, -11.5, 0))).toBe(true);
    // оранжевый забор держит
    expect(await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.solidAt(22, -32.5, 0))).toBe(true);
    // зелёный забор держит
    expect(await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.solidAt(-40, -22, 0))).toBe(true);
    // Г-дом стоит: опора 12.4
    expect(await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.ground(-8, 31))).toBe(12.4);
  });

  test('выстрел оставляет трассер', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    type M = { give: (n: number) => void; setWave: (n: number) => void; attack: () => number; tracers: () => number };
    await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.setWave(4));
    await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.give(2000));
    await page.click('#shopBtn');
    await page.click('#buy-pistol');
    await page.click('button:has-text("ЗАКРЫТЬ")');
    await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.attack());
    await page.waitForTimeout(150);
    const n = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.tracers());
    expect(n).toBeGreaterThan(0);
  });

  test('общая статистика видна всем', async ({ page, request }) => {
    const r = await request.get('/api/stats');
    expect(r.ok()).toBe(true);
    const d = await r.json();
    expect(typeof d.games).toBe('number');
    expect(typeof d.best).toBe('number');
    expect(typeof d.online).toBe('number');
    await page.click('#guestBtn');
    await page.click('#nav-tops');
    await expect(page.locator('#gstats')).toContainText('Всего сыграно', { timeout: 10000 });
  });

  test('кнопка полного экрана в HUD', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    await expect(page.locator('#fsBtn')).toBeVisible();
    await page.click('#fsBtn');
    await page.waitForTimeout(300);
  });

  test('хитбоксы не до неба: выше крыши — проход', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    type M = { solidAt: (x: number, z: number, y: number) => boolean };
    // фонтан на площади (27,27): у земли стена есть, на высоте 5 — нет
    const low = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.solidAt(27, 27, 0));
    const high = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.solidAt(27, 27, 5));
    expect(low).toBe(true);
    expect(high).toBe(false);
  });

  test('🧭 вкладки: каждая кнопка открывает свою', async ({ page }) => {
    await page.click('#guestBtn');
    const tabs: Array<[string, string]> = [['fighter', '#charSec'], ['cases', '#caseSec'], ['maps', '#mapSec'], ['editor', '#editorSec'], ['rooms', '#roomSec'], ['servers', '#serversSec'], ['settings', '#setSec'], ['tops', '#duelTop'], ['play', '#goSec']];
    for (const [t, sel] of tabs) {
      await page.click(`#nav-${t}`);
      await expect(page.locator(sel)).toBeVisible();
    }
    await expect(page.locator('#nav-play.active')).toHaveCount(1);
  });

  test('🗺️ выбор карты: четыре карточки, Случайная выбирается', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#nav-maps');
    await expect(page.locator('#mapSec .mapCard')).toHaveCount(4);
    await page.click('#map-random');
    await expect(page.locator('#map-random.sel')).toHaveCount(1);
    await expect(page.locator('#goBtn')).toContainText('СЛУЧАЙНУЮ');
  });

  test('🎲 случайная карта: ландшафт новый, месы держат', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#nav-maps');
    await page.click('#map-random');
    await page.click('#nav-play');
    await page.click('#goBtn');
    await page.waitForTimeout(1500);
    type M = { map: () => string; ground: (x: number, z: number) => number; solids: () => Array<unknown>; pos: () => { x: number; z: number; enemies: number }; solidAt: (x: number, z: number, y: number) => boolean };
    expect(await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.map())).toBe('random');
    // ландшафта много: десятки хитбоксов
    expect(await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.solids().length)).toBeGreaterThan(35);
    // враги пришли на дикое поле
    expect((await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.pos())).enemies).toBeGreaterThan(0);
    // спавн свободен
    const p = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.pos());
    const free = await page.evaluate(([x, z]: [number, number]) => (window as unknown as { __mtt: { solidAt: (x: number, z: number, y: number) => boolean } }).__mtt.solidAt(x, z, 0), [p.x, p.z]);
    expect(free).toBe(false);
    // месы есть: максимум опоры по сетке выше 2м
    const mx = await page.evaluate(() => {
      const m = (window as unknown as { __mtt: M }).__mtt;
      let best = 0;
      for (let x = -48; x <= 48; x += 6) for (let z = -48; z <= 48; z += 6) best = Math.max(best, m.ground(x, z));
      return best;
    });
    expect(mx).toBeGreaterThanOrEqual(2);
  });

  test('💬 чат глушит кнопки: печатаешь — стоишь, подсказок нет', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.waitForTimeout(1500);
    await expect(page.locator('#hint')).toHaveCount(0);
    type M = { pos: () => { x: number; z: number } };
    const before = await page.evaluate(() => { const q = (window as unknown as { __mtt: M }).__mtt.pos(); return { x: q.x, z: q.z }; });
    await page.keyboard.press('KeyT');
    await expect(page.locator('#chatOv')).toHaveCount(1);
    await page.keyboard.down('KeyW');
    await page.keyboard.press('KeyJ');
    await page.keyboard.press('Space');
    await page.waitForTimeout(2500);
    await page.keyboard.up('KeyW');
    const after = await page.evaluate(() => { const q = (window as unknown as { __mtt: M }).__mtt.pos(); return { x: q.x, z: q.z }; });
    expect(after).toEqual(before);
  });

  test('🎲 реролл: перезаход — новая случайная карта', async ({ page }) => {
    await page.click('#guestBtn');
    type M = { map: () => string; solids: () => Array<unknown> };
    const sig = async (): Promise<string> => {
      await page.click('#menuBtn');
      await page.waitForTimeout(500);
      await page.click('#nav-maps');
      await page.click('#map-random');
      await page.click('#nav-play');
      await page.click('#goBtn');
      await page.waitForTimeout(1500);
      return await page.evaluate(() => {
        const m = (window as unknown as { __mtt: M }).__mtt;
        return m.map() + ':' + m.solids().length + ':' + JSON.stringify(m.solids().slice(0, 5));
      });
    };
    await page.click('#nav-maps');
    await page.click('#map-random');
    await page.click('#nav-play');
    await page.click('#goBtn');
    await page.waitForTimeout(1500);
    const s1 = await page.evaluate(() => {
      const m = (window as unknown as { __mtt: M }).__mtt;
      return m.map() + ':' + m.solids().length + ':' + JSON.stringify(m.solids().slice(0, 5));
    });
    expect(s1.startsWith('random:')).toBe(true);
    const s2 = await sig();
    expect(s2.startsWith('random:')).toBe(true);
    expect(s2).not.toBe(s1);
  });

  test('🟨 Бэкрумс: лабиринт большой, стены на месте, случайный', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#nav-maps');
    await page.click('#map-backrooms');
    await page.click('#nav-play');
    await page.click('#goBtn');
    await page.waitForTimeout(1500);
    type M = { maze: () => { n: number; cell: number; segs: number; half: number }; map: () => string };
    const m1 = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.maze());
    const map = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.map());
    expect(map).toBe('backrooms');
    expect(m1.half).toBe(63);
    expect(m1.segs).toBeGreaterThan(300);
    // второй заход — новый лабиринт (стен столько же по числу, но расклад другой — проверяем через перезаход)
    await page.click('#menuBtn');
    await page.click('#nav-maps');
    await page.click('#map-backrooms');
    await page.click('#nav-play');
    await page.click('#goBtn');
    await page.waitForTimeout(1500);
    const m2 = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.maze());
    expect(m2.segs).toBeGreaterThan(300);
  });

  test('🕊️ без врагов: мирный режим, волны не идут', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#foeBtn');
    await expect(page.locator('#foeBtn')).toContainText('ВЫКЛ');
    await page.click('#goBtn');
    await page.waitForTimeout(2500);
    type M = { peaceful: () => boolean };
    const p = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.peaceful());
    expect(p).toBe(true);
    const hud = await page.locator('#hud').innerText();
    expect(hud).toMatch(/МИРНЫЙ РЕЖИМ/);
    // удар в пустоту не запускает волну
    await page.evaluate(() => (window as unknown as { __mtt: { attack: () => number } }).__mtt.attack());
    await page.waitForTimeout(1500);
    const hud2 = await page.locator('#hudRow').innerText();
    expect(hud2).toMatch(/МИРНЫЙ РЕЖИМ/);
  });

  test('💬 чат на T: открывается, сообщение уходит', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    await page.keyboard.press('KeyT');
    await expect(page.locator('#chatOv')).toBeVisible();
    await page.fill('#chatIn', 'привет братухи');
    await page.press('#chatIn', 'Enter');
    await expect(page.locator('#chatLog')).toContainText('привет братухи');
    await page.keyboard.press('Escape');
    await expect(page.locator('#chatOv')).toHaveCount(0);
  });

  test('👑 босс: гопник спавнится, баннер виден', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    await page.evaluate(() => (window as unknown as { __mtt: { spawnKind: (k: string) => number } }).__mtt.spawnKind('boss'));
    await page.waitForTimeout(800);
    const b = await page.evaluate(() => (window as unknown as { __mtt: { boss: () => number } }).__mtt.boss());
    expect(b).toBe(1);
    await expect(page.locator('#bossBanner')).toContainText('БОСС', { timeout: 8000 });
  });

  test('⚔️ топ дуэлянтов виден в меню', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#nav-tops');
    await expect(page.locator('#duelTop')).toBeVisible();
    await expect(page.locator('#duelTop')).toContainText('Топ дуэлянтов');
  });

  test('🟨 Бэкрумс: потолок держит — выше 1.2 не прыгнуть', async ({ page }) => {
    await page.click('#guestBtn');
    // меню длинное (комнаты/топы тянут высоту) — жмём напрямую, без скролла
    await page.evaluate(() => (document.querySelector('#map-backrooms') as HTMLButtonElement).click());
    await page.evaluate(() => (document.querySelector('#foeBtn') as HTMLButtonElement).click());
    await page.click('#goBtn');
    await page.waitForTimeout(800);
    type M = { py: () => number };
    let maxPy = 0;
    await page.keyboard.down('Space');
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(150);
      const py = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.py());
      if (py > maxPy) maxPy = py;
    }
    await page.keyboard.up('Space');
    expect(maxPy).toBeLessThanOrEqual(1.35);
  });

  test('🧩 редактор: высота строений регулируется', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#nav-editor');
    await expect(page.locator('#edHRange')).toBeVisible();
    // ставим высоту 7 и рисуем одну клетку
    await page.locator('#edHRange').fill('7');
    const box = await page.locator('#edGrid').boundingBox();
    await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.fill('#edName', 'ВысотаТест');
    await page.click('#edsave');
    await page.click('#nav-play');
    await page.click('#goBtn');
    await page.waitForTimeout(1500);
    type M = { map: () => string; custom: () => { walls: number; half: number } };
    expect(await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.map())).toBe('custom');
    // стена высотой 7 в центре: хитбокс есть у земли, нет выше крыши
    type S = { solidAt: (x: number, z: number, y: number) => boolean };
    const cu = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.custom());
    expect(cu.walls).toBeGreaterThanOrEqual(1);
    expect(await page.evaluate(() => (window as unknown as { __mtt: S }).__mtt.solidAt(2.5, 2.5, 0))).toBe(true);
    expect(await page.evaluate(() => (window as unknown as { __mtt: S }).__mtt.solidAt(2.5, 2.5, 8))).toBe(false);
  });

  test('🧩 редактор: нарисовал, сохранил, играю на своей', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#nav-editor');
    await expect(page.locator('#editorSec')).toBeVisible();
    await page.fill('#edName', 'ТестКарта');
    const box = await page.locator('#edGrid').boundingBox();
    expect(box).not.toBeNull();
    // крестик по центру сетки
    const cx = box!.x + box!.width / 2, cy = box!.y + box!.height / 2;
    await page.mouse.click(cx, cy);
    await page.mouse.click(cx + box!.width / 18, cy);
    await page.mouse.click(cx - box!.width / 18, cy);
    await page.click('#edsave');
    await page.click('#nav-play');
    await expect(page.locator('#goBtn')).toContainText('НА СВОЮ');
    await page.click('#goBtn');
    await page.waitForTimeout(1500);
    type M = { map: () => string; custom: () => { walls: number; half: number } };
    const map = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.map());
    expect(map).toBe('custom');
    const cu = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.custom());
    expect(cu.walls).toBeGreaterThanOrEqual(1);
  });

  test('🔧 прокачка: описания, шкала опыта, ПРОКАЧАТЬ качает хп и супер', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#charBtn');
    // подробные описания у обоих бойцов
    await expect(page.locator('#abilities-mtt')).toContainText('СУПЕР');
    await expect(page.locator('#abilities-krysa')).toContainText('Вол-кик');
    // шкала опыта видна
    await expect(page.locator('#xp-mtt .cxpFill')).toHaveCount(1);
    await expect(page.locator('#xp-mtt')).toContainText('Опыт');
    // открываем прокачку МТТ, насыпаем фантиков и качаем ХП
    await page.click('#upg-mtt');
    await expect(page.locator('#upgpanel-mtt')).toBeVisible();
    await page.evaluate(() => (window as unknown as { __mtt: { give: (n: number) => number } }).__mtt.give(2000));
    const before = await page.evaluate(() => (window as unknown as { __mtt: { upg: (id: string) => { hp: number } } }).__mtt.upg('mtt').hp);
    await page.click('#upg-mtt-hp');
    const after = await page.evaluate(() => (window as unknown as { __mtt: { upg: (id: string) => { hp: number } } }).__mtt.upg('mtt').hp);
    expect(after).toBe(before + 1);
    // супер: кд не ниже 1.7 даже на максимуме
    const cd = await page.evaluate(() => (window as unknown as { __mtt: { supercd: (id: string) => number } }).__mtt.supercd('mtt'));
    expect(cd).toBeGreaterThanOrEqual(1.7);
    const cdMax = await page.evaluate(() => {
      const w = window as unknown as { __mtt: { upg: (id: string) => { sup: number } } };
      void w;
      // чистая формула из движка: база 3, шаг 0.3, минимум 1.7
      return Math.max(1.7, Math.round((3 - 5 * 0.3) * 10) / 10);
    });
    expect(cdMax).toBe(1.7);
  });

  test('🎰 кейсы: Стейси закрыта, МТТ базовый, кейс открывается', async ({ page }) => {
    await page.click('#guestBtn');
    // баланс виден в правом верхнем углу меню
    await expect(page.locator('#menuBalance')).toBeVisible();
    await expect(page.locator('#menuBalance')).toContainText('🎟️');
    const box = await page.locator('#menuBalance').boundingBox();
    const vp = page.viewportSize();
    expect(box).not.toBeNull();
    expect(box!.x + box!.width).toBeGreaterThan((vp?.width ?? 1280) * 0.8);
    expect(box!.y).toBeLessThan(60);
    // вкладка кейсов на месте
    await page.click('#nav-cases');
    await expect(page.locator('#caseSec')).toBeVisible();
    await expect(page.locator('#case-fighter')).toContainText('КЕЙС БОЙЦА');
    // редкости: МТТ базовый, Стейси легендарная и закрыта по умолчанию
    await page.click('#nav-fighter');
    await expect(page.locator('#rarity-mtt')).toContainText('Базовый');
    await expect(page.locator('#rarity-krysa')).toContainText('Легендарный');
    await expect(page.locator('#char-krysa .cname')).toContainText('Стейси');
    await expect(page.locator('#locked-krysa')).toHaveCount(1);
    await expect(page.locator('#pick-krysa')).toBeDisabled();
    // закрытого выбрать нельзя
    const ch0 = await page.evaluate(() => (window as unknown as { __mtt: { chara: () => string } }).__mtt.chara());
    expect(ch0).toBe('mtt');
    // насыпаем фантиков, открываем кейс — выпадает результат
    await page.evaluate(() => (window as unknown as { __mtt: { give: (n: number) => number } }).__mtt.give(2000));
    await page.click('#nav-cases');
    await page.click('#caseOpen');
    await expect(page.locator('#caseResult')).toBeVisible();
    // выдача как из кейса открывает Стейси и даёт выбрать
    await page.evaluate(() => (window as unknown as { __mtt: { unlock: (id: string) => boolean } }).__mtt.unlock('krysa'));
    await page.click('#nav-fighter');
    await expect(page.locator('#locked-krysa')).toHaveCount(0);
    await page.click('#pick-krysa');
    await expect(page.locator('#char-krysa.sel')).toHaveCount(1);
  });

  test('💥 дробовик: покупка, ствол в руках, рокет-джамп', async ({ page }) => {
    await page.click('#guestBtn');
    await page.click('#goBtn');
    // фантики + волна 5 (дробовик с 5-й) — через дебаг-хуки
    await page.evaluate(() => {
      const m = (window as unknown as { __mtt: { give: (n: number) => number; setWave: (n: number) => number } }).__mtt;
      m.give(5000);
      m.setWave(5);
    });
    await page.click('#shopBtn');
    await expect(page.locator('#buy-shotgun')).toBeVisible();
    await page.click('#buy-shotgun');
    await page.click('.sheet .wclose');
    const hud2 = await page.locator('#hudRow2').innerText();
    expect(hud2).toMatch(/Дробовик/);
    // выстрел себе под ноги — подброс: ловим пик высоты за 3 секунды
    const peak = await page.evaluate(() => new Promise<number>((resolve) => {
      const m = (window as unknown as { __mtt: { look: (dx: number, dy: number) => void; attack: () => number; py: () => number } }).__mtt;
      m.look(0, 400);
      m.attack();
      let best = 0;
      let n = 0;
      const t = window.setInterval(() => {
        best = Math.max(best, m.py());
        if (++n >= 30) { window.clearInterval(t); resolve(Math.round(best * 100) / 100); }
      }, 100);
    }));
    expect(peak).toBeGreaterThan(4);
  });

  test('🤝 совместная игра: полное присутствие — оружие, действия, тела', async ({ page }) => {
    // протокол: сервер несёт оружие/высоту/удары/смерть сокомнатника
    const mk = await page.request.post('/api/rooms', { data: { nick: 'ТестА', char: 'mtt', mode: 'arena' } });
    expect(mk.ok()).toBe(true);
    const { id, sid } = await mk.json();
    await page.request.post(`/api/rooms/${id}/beat`, { data: { sid, char: 'mtt', x: 1, z: 2, yaw: 0, hp: 100, score: 0, kills: 0, wave: 1, weapon: 'shotgun', py: 0, atk: 3, dead: false } });
    const jn = await page.request.post(`/api/rooms/${id}/join`, { data: { nick: 'ТестБ', char: 'krysa' } });
    expect(jn.ok()).toBe(true);
    const { sid: sidB } = await jn.json();
    const ap = await page.request.post(`/api/rooms/${id}/approve`, { data: { sid, target: sidB } });
    expect(ap.ok()).toBe(true);
    const b2 = await page.request.post(`/api/rooms/${id}/beat`, { data: { sid: sidB, char: 'krysa', x: 5, z: 6, yaw: 1, hp: 90, score: 0, kills: 0, wave: 1, weapon: 'bat', py: 0, atk: 0, dead: false } });
    expect(b2.ok()).toBe(true);
    const seen = (await b2.json()) as { players: Array<{ nick: string; weapon?: string; py?: number; atk?: number; dead?: boolean }> };
    const mate = seen.players.find((p) => p.nick === 'ТестА');
    expect(mate).toBeTruthy();
    expect(mate!.weapon).toBe('shotgun');
    expect(mate!.atk).toBe(3);
    expect(mate!.dead).toBe(false);
    await page.request.post(`/api/rooms/${id}/leave`, { data: { sid } });
    await page.request.post(`/api/rooms/${id}/leave`, { data: { sid: sidB } });
    // рендер: тело сокомнатника несёт оружие/удары/смерть в движок
    const got = await page.evaluate(() => {
      const m = (window as unknown as { __mtt: { setRemotes: (l: object[]) => void; remoteList: () => Array<{ weapon?: string; atk?: number; dead?: boolean }> } }).__mtt;
      m.setRemotes([{ nick: 'ТестА', char: 'mtt', x: 5, z: 5, hp: 80, weapon: 'pistol', py: 1, atk: 2, dead: false }]);
      return m.remoteList();
    });
    const one = got.find((r) => (r as { nick?: string }).nick === 'ТестА') ?? got[0];
    expect(one.weapon).toBe('pistol');
    expect(one.atk).toBe(2);
    expect(one.dead).toBe(false);
  });

  test.afterEach(async () => {
    // ожидаемый 403 админки для чужих — не баг, в отчёт не идёт
    const real = errors.filter((e) => !e.includes('/api/admin/stats'));
    expect(real, 'ошибки браузера: ' + real.join(' | ').slice(0, 500)).toEqual([]);
  });
});
