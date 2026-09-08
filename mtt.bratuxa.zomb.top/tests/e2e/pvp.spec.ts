import { test, expect } from '@playwright/test';

/** Вход на официальный PvP-сервер через вкладку Сервера; ждём табло. */
async function joinOfficialPvp(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/');
  await expect(page).toHaveTitle(/42 LIVE/);
  await page.click('#guestBtn');
  await page.click('#nav-servers');
  await page.click('#srv-PVP42X');
  // официальный сервер уже идёт — автовход через пульс лобби + загрузка
  await expect(page.locator('#scoreboard')).toBeVisible({ timeout: 45000 });
}

test('pvp: табло и таймер рестарта на официальном сервере', async ({ page }) => {
  await joinOfficialPvp(page);
  await expect(page.locator('#scoreTitle')).toContainText('ТЫ:', { timeout: 15000 });
  // сервер отдаёт restartIn ~1200с — таймер виден
  await expect(page.locator('#scoreTitle')).toContainText('♻️', { timeout: 15000 });
});

test('pvp: удар по игроку уходит на сервер с fid', async ({ page }) => {
  await joinOfficialPvp(page);
  // болван с fid 5 в 2.5м строго по курсу
  await page.evaluate(() => {
    const m = (window as unknown as { __mtt: {
      pos: () => { x: number; z: number; yaw: number };
      setRemotes: (l: Array<{ nick: string; x: number; z: number; hp: number; char: string; fid: number }>) => void;
    } }).__mtt;
    const p = m.pos();
    const bx = p.x + (-Math.sin(p.yaw)) * 2.5;
    const bz = p.z + (-Math.cos(p.yaw)) * 2.5;
    m.setRemotes([{ nick: 'Bot5', x: bx, z: bz, hp: 100, char: 'mtt', fid: 5 }]);
  });
  const hitReq = page.waitForRequest(
    (r) => r.url().includes('/pvphit') && r.method() === 'POST',
    { timeout: 15000 },
  );
  await page.evaluate(() => (window as unknown as { __mtt: { attack: () => number } }).__mtt.attack());
  const req = await hitReq;
  const body = JSON.parse(req.postData() ?? '{}') as { target?: number; dmg?: number };
  expect(body.target).toBe(5);
  expect(body.dmg).toBeGreaterThan(0);
});

test('pvp: жертва видит смерть и возрождается', async ({ page }) => {
  await joinOfficialPvp(page);
  const myNick = await page.evaluate(() => {
    const el = document.querySelector('#scoreboard');
    return el ? el.textContent ?? '' : '';
  });
  expect(myNick).toContain('ТЫ:');
  // киллер через API: входит, находит fid страницы по нику из табло не выйдет — ищем любого кроме себя
  const api = page.request;
  let r = await api.post('https://mtt.bratuxa.zomb.top/api/rooms/PVP42X/join', { data: { nick: 'KillerBot' } });
  expect(r.ok()).toBe(true);
  const { sid } = (await r.json()) as { sid: string };
  r = await api.post('https://mtt.bratuxa.zomb.top/api/rooms/PVP42X/beat', { data: { sid, nick: 'KillerBot', x: 0, z: 0, hp: 100 } });
  expect(r.ok()).toBe(true);
  const beat = (await r.json()) as { players: Array<{ nick: string; fid: number }> };
  const victims = beat.players.filter((p) => p.nick !== 'KillerBot' && typeof p.fid === 'number');
  expect(victims.length).toBeGreaterThan(0);
  // валим ВСЕХ кроме киллера (страница среди них): 2×80 = смерть
  for (const v of victims) {
    await api.post('https://mtt.bratuxa.zomb.top/api/rooms/PVP42X/pvphit', { data: { sid, target: v.fid, dmg: 80 } });
    await api.post('https://mtt.bratuxa.zomb.top/api/rooms/PVP42X/pvphit', { data: { sid, target: v.fid, dmg: 80 } });
  }
  // страница принимает серверный hp через пульс → экран смерти
  await expect(page.locator('#pvpRespawn')).toBeVisible({ timeout: 20000 });
  await page.click('#pvpRespawn');
  await expect(page.locator('#pvpRespawn')).toBeHidden({ timeout: 10000 });
  const hp = await page.evaluate(() => (window as unknown as { __mtt: { hp: () => number } }).__mtt.hp());
  expect(hp).toBeGreaterThan(0);
  await api.post('https://mtt.bratuxa.zomb.top/api/rooms/PVP42X/leave', { data: { sid } });
});
