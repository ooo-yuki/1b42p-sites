import { test, expect, type Page, type APIRequestContext } from '@playwright/test';

const API = 'https://mtt.bratuxa.zomb.top';

async function joinPvp(request: APIRequestContext, nick: string): Promise<string> {
  const r = await request.post(`${API}/api/rooms/PVP42X/join`, { data: { nick, char: 'mtt' } });
  expect(r.ok(), `join ${nick}`).toBe(true);
  return ((await r.json()) as { sid: string }).sid;
}

test('античит: труп не бьёт, наблюдатель не бьёт мобов и не воскресает', async ({ request }: { request: APIRequestContext }) => {
  test.setTimeout(120000);
  const sidA = await joinPvp(request, 'Киллер');
  const sidB = await joinPvp(request, 'Труп');
  const sidC = await joinPvp(request, 'Глаз');
  try {
    // двое дерутся: Киллер кладёт Труп (80×2)
    for (const [sid, nick] of [[sidA, 'Киллер'], [sidB, 'Труп']] as Array<[string, string]>) {
      await request.post(`${API}/api/rooms/PVP42X/beat`, { data: { sid, nick, x: 0, z: 0, hp: 100 } });
    }
    let r = await request.post(`${API}/api/rooms/PVP42X/pvphit`, { data: { sid: sidA, target: sidB, dmg: 80 } });
    expect(r.ok()).toBe(true);
    r = await request.post(`${API}/api/rooms/PVP42X/pvphit`, { data: { sid: sidA, target: sidB, dmg: 80 } });
    expect((await r.json()) as { dead: boolean }).toEqual(expect.objectContaining({ dead: true }));
    // труп пытается бить в ответ — 403 corpse
    r = await request.post(`${API}/api/rooms/PVP42X/pvphit`, { data: { sid: sidB, target: sidA, dmg: 80 } });
    expect(r.status(), 'труп не бьёт').toBe(403);
    expect(((await r.json()) as { error: string }).error).toBe('corpse');
    // труп пытается добивать моба — 403 corpse (а не 404)
    r = await request.post(`${API}/api/rooms/PVP42X/mobhit`, { data: { sid: sidB, id: 1, dmg: 10 } });
    expect(r.status(), 'труп не бьёт мобов').toBe(403);
    // наблюдатель: в watch, затем бьёт моба — 403 spec
    r = await request.post(`${API}/api/rooms/PVP42X/watch`, { data: { sid: sidC, target: '' } });
    expect(r.ok(), 'watch').toBe(true);
    r = await request.post(`${API}/api/rooms/PVP42X/mobhit`, { data: { sid: sidC, id: 1, dmg: 10 } });
    expect(r.status(), 'наблюдатель не бьёт мобов').toBe(403);
    expect(((await r.json()) as { error: string }).error).toBe('spec');
    // наблюдатель пытается воскреснуть через /play — 403 norespawn
    r = await request.post(`${API}/api/rooms/PVP42X/play`, { data: { sid: sidC } });
    expect(r.status(), 'наблюдатель не воскресает').toBe(403);
    expect(((await r.json()) as { error: string }).error).toBe('norespawn');
  } finally {
    for (const sid of [sidA, sidB, sidC]) {
      await request.post(`${API}/api/rooms/PVP42X/leave`, { data: { sid } }).catch(() => undefined);
    }
  }
});

type M = {
  pvpRespawn: (x: number, z: number) => boolean;
  pos: () => { x: number; z: number };
  solidAt: (x: number, z: number, y: number) => boolean;
  solids: () => Array<{ x: number; z: number; hx: number; hz: number; h: number }>;
};

test('ресаун из стены выдёргивает на свободное', async ({ page }: { page: Page }) => {
  test.setTimeout(180000);
  await page.goto('/');
  await expect(page).toHaveTitle(/42 LIVE/);
  await page.click('#guestBtn');
  await page.click('#goBtn');
  await expect(page.locator('#fps')).toBeVisible({ timeout: 30000 });
  // воскрешаем прямо в центр первого большого дома
  const res = await page.evaluate(() => {
    const m = (window as unknown as { __mtt: M }).__mtt;
    const house = m.solids().find((s) => s.hx >= 2 && s.hz >= 2 && s.h >= 3)!;
    m.pvpRespawn(house.x, house.z);
    const p = m.pos();
    return { hx: house.x, hz: house.z, px: p.x, pz: p.z, free: !m.solidAt(p.x, p.z, 0) };
  });
  console.log('DIAG respawn ' + JSON.stringify(res));
  expect(res.free, 'после ресауна стоим на свободном').toBe(true);
});
