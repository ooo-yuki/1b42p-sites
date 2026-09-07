import { test, expect } from '@playwright/test';

// Хост видит фраги гостей: гость добивает общего моба через mobhit —
// локальная копия хоста должна погаснуть (без двойной награды), иначе
// хост бьёт труп, а его волна встаёт навсегда.
test.use({ viewport: { width: 800, height: 450 } });

type Foe = { id: number; x: number; z: number; hp: number; dead: boolean };
type Mob = { id: number; kind: string; x: number; z: number; hp: number; dead: boolean; wave: number };

test('сеть: фраг гостя гаснет у хоста (общий моб)', async ({ page, request }) => {
  test.setTimeout(300000);
  const errs: string[] = [];
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message.slice(0, 160)));
  await page.goto('/');
  await expect(page).toHaveTitle(/42 LIVE/);
  await page.click('#guestBtn');
  const room = 'FRAG' + Date.now().toString().slice(-5);
  await page.fill('#nick', 'ХостУрон');
  await page.click('#nav-rooms');
  await page.fill('#roomDraft', room);
  await page.click('#roomCreate');
  await expect(page.locator('#roomStart')).toBeVisible({ timeout: 15000 });
  const secText = await page.locator('#roomSec').innerText();
  const id = secText.match(/\(([A-Z0-9]{6})\)/)![1];
  // гость: заявка из страницы (sid), дальше бьёт раннер
  const gs = await page.evaluate(async (roomId) => {
    const j = await fetch(`/api/rooms/${roomId}/join`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nick: 'ГостьФраг', char: 'mtt' }),
    }).then((r) => r.json()) as { sid: string };
    return { sid: j.sid };
  }, id);
  const guestSid = (gs as { sid: string }).sid;
  expect(guestSid).toBeTruthy();
  await expect(page.locator('#approve-0')).toBeVisible({ timeout: 30000 });
  await page.click('#approve-0');
  await page.click('#roomStart');
  await expect(page.locator('#hudRow2')).toBeVisible({ timeout: 60000 });
  // ждём: хост запушил мобов (раннер видит слепок в ответе бита)
  let mobs: Mob[] = [];
  for (let i = 0; i < 40 && mobs.length === 0; i++) {
    const r = await request.post(`/api/rooms/${id}/beat`, {
      data: { sid: guestSid, char: 'mtt', x: 0, z: 22, yaw: 0, hp: 100, score: 0, kills: 0, wave: 1, weapon: 'fists', py: 0, atk: 0, dead: false },
    });
    const d = (await r.json()) as { players?: unknown[]; mobs?: Mob[] };
    if (Array.isArray(d.mobs)) mobs = d.mobs.filter((m) => !m.dead);
    if (mobs.length === 0) await new Promise((r2) => setTimeout(r2, 1000));
  }
  console.log('HOSTKILLS-MOBS', mobs.length);
  expect(mobs.length).toBeGreaterThan(0);
  const target = mobs.find((m) => m.kind === 'walk') ?? mobs[0];
  // гость добивает одним ударом сервера
  const kh = await request.post(`/api/rooms/${id}/mobhit`, { data: { sid: guestSid, id: target.id, dmg: 500 } });
  const kd = (await kh.json()) as { dead?: boolean; freshKill?: boolean };
  console.log('HOSTKILLS-KILL', JSON.stringify(kd));
  expect(kd.dead).toBe(true);
  expect(kd.freshKill).toBe(true);
  // хост должен погасить копию: ждём исчезновения id из живых (бит 500мс + запас)
  let gone = false;
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(1000);
    const foes = (await page.evaluate(() => (window as unknown as { __mtt: { foes: () => Foe[] } }).__mtt.foes())) as Foe[];
    if (!foes.some((f) => f.id === target.id)) { gone = true; break; }
  }
  console.log('HOSTKILLS-ERRS', JSON.stringify(errs.slice(0, 8)));
  expect(gone).toBe(true);
});
