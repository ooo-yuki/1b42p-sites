import { test, expect, type Page, type APIRequestContext } from '@playwright/test';

// Синхрон без второго рендера: один живой клиент + API-призрак на Node-пульсе
// (два SwiftShader-рендера душат друг друга — таймеры фона встают, это стенд, не игра).
async function boot(page: Page, nick: string): Promise<void> {
  await page.goto('/');
  await expect(page).toHaveTitle(/42 LIVE/);
  await page.fill('#nick', nick);
  await page.click('#guestBtn');
}

type R = { nick: string; x: number; z: number; fid: number };

async function mkPvp(page: Page): Promise<string> {
  await page.evaluate(() => (window as unknown as { __mtt: { mkroom: (n: string, m: string) => Promise<void> } }).__mtt.mkroom('Синхрум', 'pvp'));
  await page.click('#nav-rooms');
  const sec = await page.locator('#roomSec').innerText({ timeout: 15000 });
  const id = sec.match(/\(([A-Z0-9]{6})\)/)?.[1] ?? '';
  expect(id).toMatch(/^[A-Z0-9]{6}$/);
  return id;
}

test('синхрон: рендер видит гостя, урон и табло общие', async ({ page, request }: { page: Page; request: APIRequestContext }) => {
  test.setTimeout(240000);
  await boot(page, 'Рендер');
  const id = await mkPvp(page);
  const API = 'https://mtt.bratuxa.zomb.top';

  // призрак входит (пользовательская комната — через заявку) и идёт битами (10,10)
  let r = await request.post(`${API}/api/rooms/${id}/join`, { data: { nick: 'Гость', char: 'mtt' } });
  expect(r.ok()).toBe(true);
  const { sid } = (await r.json()) as { sid: string };
  let stop = false;
  const gx = { x: -30, z: -30 };
  const ghostLoop = (async () => {
    while (!stop) {
      gx.x = Math.min(10, gx.x + 2.5);
      gx.z = Math.min(10, gx.z + 2.5);
      await request.post(`${API}/api/rooms/${id}/beat`, {
        data: { sid, nick: 'Гость', x: gx.x, z: gx.z, hp: 100 },
      }).catch(() => undefined);
      await page.waitForTimeout(500);
    }
  })();

  // создатель принимает заявку и идёт в бой (призрак уже в строю)
  await expect(page.locator('#approve-0')).toBeVisible({ timeout: 20000 });
  await page.click('#approve-0');
  await page.click('#nav-play');
  await page.click('#goBtn');
  await expect(page.locator('#scoreboard')).toBeVisible({ timeout: 45000 });

  // рендер видит куклу гостя рядом с (10,10)
  let seen: R | undefined;
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(1000);
    const list = await page.evaluate(() => (window as unknown as { __mtt: { remoteList: () => R[] } }).__mtt.remoteList());
    seen = list.find((q) => q.nick === 'Гость');
    if (seen && Math.abs(seen.x - 10) < 5 && Math.abs(seen.z - 10) < 5) break;
    seen = undefined;
  }
  expect(seen, 'рендер видит Гостя в (10,10)').toBeDefined();
  expect(seen!.fid).toBeGreaterThanOrEqual(0);

  // гость бьёт рендера через серверный pvphit — у рендера падает hp
  r = await request.post(`${API}/api/rooms/${id}/beat`, { data: { sid, nick: 'Гость', x: 10, z: 10, hp: 100 } });
  const beat = (await r.json()) as { players: Array<{ nick: string; fid: number }> };
  const me = beat.players.find((p) => p.nick === 'Рендер');
  expect(me, 'гость видит Рендера в строю').toBeDefined();
  await request.post(`${API}/api/rooms/${id}/pvphit`, { data: { sid, target: me!.fid, dmg: 80 } });
  let hp = 100;
  for (let i = 0; i < 10; i++) {
    await page.waitForTimeout(1000);
    hp = await page.evaluate(() => (window as unknown as { __mtt: { hp: () => number } }).__mtt.hp());
    if (hp < 100) break;
  }
  expect(hp).toBeLessThan(100);

  // табло и бирка Tab знают обоих
  const sb = await page.locator('#scoreboard').innerText();
  expect(sb).toContain('Гость');
  await page.keyboard.press('Tab');
  await expect(page.locator('#matesList')).toBeVisible({ timeout: 5000 });
  expect(await page.locator('#matesList').innerText()).toContain('Гость');

  stop = true;
  await ghostLoop.catch(() => undefined);
  await request.post(`${API}/api/rooms/${id}/leave`, { data: { sid } }).catch(() => undefined);
});
