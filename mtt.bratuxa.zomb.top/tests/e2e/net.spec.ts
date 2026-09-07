import { test, expect } from '@playwright/test';

// Сетевые тесты: плавность, волны, общий урон. Пилоты идут через живой API,
// призрак — через fetch из страницы (паттерн probe.spec.ts).
test.use({ viewport: { width: 800, height: 450 } });

test('сеть: сокомнатник скользит без остановок (снапшот-интерполяция)', async ({ page, request }) => {
  test.setTimeout(300000);
  const errs: string[] = [];
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message.slice(0, 160)));
  await page.goto('/');
  await expect(page).toHaveTitle(/42 LIVE/);
  await page.click('#guestBtn');
  const room = 'GLIDE' + Date.now().toString().slice(-5);
  await page.fill('#nick', 'Хост');
  await page.click('#nav-rooms');
  await page.fill('#roomDraft', room);
  await page.click('#roomCreate');
  await expect(page.locator('#roomStart')).toBeVisible({ timeout: 15000 });
  const secText = await page.locator('#roomSec').innerText();
  const id = secText.match(/\(([A-Z0-9]{6})\)/)![1];
  // призрак: join из страницы (sid), а биты шлёт РАННЕР ровными 500мс —
  // отдельный процесс, его таймеры не душит рендер страницы
  const gs = await page.evaluate(async (roomId) => {
    const j = await fetch(`/api/rooms/${roomId}/join`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nick: 'Бегун', char: 'mtt' }),
    }).then((r) => r.json()) as { sid: string };
    await fetch(`/api/rooms/${roomId}/beat`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sid: j.sid, char: 'mtt', x: 0, z: 6, yaw: 0, hp: 100, score: 0, kills: 0, wave: 1, weapon: 'fists', py: 0, atk: 0, dead: false }),
    }).catch(() => undefined);
    return { sid: j.sid };
  }, id);
  const ghostSid = (gs as { sid: string }).sid;
  expect(ghostSid).toBeTruthy();
  // насос призрака: ровные биты 2м/с из раннера всё время теста
  let gx = 0, dir = 1;
  const pumpStop = { stop: false };
  const pump = (async () => {
    while (!pumpStop.stop) {
      gx += dir; if (gx > 20) dir = -1; if (gx < -20) dir = 1;
      try {
        await request.post(`/api/rooms/${id}/beat`, { data: { sid: ghostSid, char: 'mtt', x: gx, z: 6, yaw: 0, hp: 100, score: 0, kills: 0, wave: 1, weapon: 'fists', py: 0, atk: 0, dead: false } });
      } catch { /* noop */ }
      await new Promise((r) => setTimeout(r, 500));
    }
  })();
  await expect(page.locator('#approve-0')).toBeVisible({ timeout: 30000 });
  await page.click('#approve-0');
  await page.click('#roomStart');
  await expect(page.locator('#hudRow2')).toBeVisible({ timeout: 60000 });
  // шпион пульса: сколько битов ушло, что сервер вернул (диагностика флейка)
  await page.evaluate(() => {
    const w = window as unknown as { __beatLog?: Array<{ t: number; n: number }>; __ghostBeats?: number };
    w.__beatLog = [];
    const of = window.fetch.bind(window);
    window.fetch = ((u: unknown, o?: unknown) => {
      const p = of(u as string, o as RequestInit);
      if (String(u).includes('/beat')) {
        const t0 = Date.now();
        void p.then((r) => r.clone().json().then((d) => {
          w.__beatLog!.push({ t: t0, n: Array.isArray((d as { players?: unknown[] }).players) ? (d as { players: unknown[] }).players.length : -1 });
          if (w.__beatLog!.length > 40) w.__beatLog!.shift();
        }).catch(() => undefined));
      }
      return p;
    }) as typeof fetch;
  });
  // ждём куклу в рендере (старт/аппрув могут гонять — сэмплируем только живую)
  try {
    await page.waitForFunction(() => (window as unknown as { __mtt: { remoteList: () => Array<{ nick: string }> } }).__mtt.remoteList().some((r) => r.nick === 'Бегун'), null, { timeout: 30000 });
  } catch (e) {
    const spy = await page.evaluate(() => JSON.stringify((window as unknown as { __beatLog?: Array<{ t: number; n: number }> }).__beatLog ?? []));
    console.log('GLIDE-SPY', spy);
    console.log('GLIDE-ERRS', JSON.stringify(errs.slice(0, 8)));
    throw e;
  }
  // покадровые замеры 6с: время + x куклы на каждом rAF (рендер-независимо от сети)
  const frames = await page.evaluate(() => new Promise<Array<{ t: number; x: number }>>((resolve) => {
    const m = window as unknown as { __mtt: { remoteList: () => Array<{ nick: string; x: number }> } };
    const out: Array<{ t: number; x: number }> = [];
    const t0 = performance.now();
    const step = () => {
      const g = m.__mtt.remoteList().find((r) => r.nick === 'Бегун');
      if (g) out.push({ t: performance.now() - t0, x: g.x });
      if (performance.now() - t0 < 6000) requestAnimationFrame(step);
      else resolve(out);
    };
    requestAnimationFrame(step);
  }));
  console.log('GLIDE-FRAMES', frames.length);
  expect(frames.length).toBeGreaterThanOrEqual(10);
  // первые кадры — прогрев буфера (кукла только встала), меряем устоявшееся
  const warm = frames.slice(4);
  // скорость между кадрами: рваный движок даёт всплеск/ноль, скользящий — ровную
  const vels: number[] = [];
  let path = 0;
  for (let i = 1; i < warm.length; i++) {
    const dt = (warm[i].t - warm[i - 1].t) / 1000;
    const dx = Math.abs(warm[i].x - warm[i - 1].x);
    if (dt > 0.02) vels.push(dx / dt);
    path += dx;
  }
  console.log('GLIDE-VELS', JSON.stringify(vels.map((v) => Math.round(v * 100) / 100)));
  console.log('GLIDE-ERRS', JSON.stringify(errs.slice(0, 8)));
  expect(Math.max(...vels)).toBeGreaterThan(1);
  expect(path).toBeGreaterThan(6);
  const ratio = Math.min(...vels) / Math.max(...vels);
  console.log('GLIDE-RATIO', Math.round(ratio * 100) / 100);
  // старое «догнал—стою» даёт 0.04–0.06, ровное скольжение — 0.2+; порог между с запасом
  expect(ratio).toBeGreaterThan(0.12);
  pumpStop.stop = true;
  await pump;
});

test('сеть: тихий вылет — клиент возвращается сам (грейс-возврат)', async ({ page, request }) => {
  test.setTimeout(300000);
  // комната и хост-насос из раннера: комната жива, прунинг работает
  const c = await request.post('/api/rooms', { data: { nick: 'Хост', name: 'BACKROOM', mode: 'arena' } });
  expect(c.ok()).toBe(true);
  const { id, sid: host } = await c.json() as { id: string; sid: string };
  const hctl = { stop: false };
  const hpump = (async () => {
    while (!hctl.stop) {
      try { await request.post(`/api/rooms/${id}/beat`, { data: { sid: host, x: 0, z: 22, yaw: 0, hp: 100, score: 0, kills: 0, wave: 1, weapon: 'fists', py: 0, atk: 0, dead: false } }); } catch { /* noop */ }
      await new Promise((r) => setTimeout(r, 1000));
    }
  })();
  // страница — гость через UI
  await page.goto('/');
  await expect(page).toHaveTitle(/42 LIVE/);
  await page.click('#guestBtn');
  await page.fill('#nick', 'Гость');
  await page.click('#nav-rooms');
  await page.click('button:has-text("ОБНОВИТЬ")');
  await expect(page.locator(`#join-${id}`)).toBeVisible({ timeout: 15000 });
  await page.click(`#join-${id}`);
  const info = await request.get(`/api/rooms/${id}/info?sid=${host}`);
  const ij = await info.json() as { pending?: Array<{ sid: string }> };
  const guest = ij.pending?.[0]?.sid ?? '';
  expect(guest).toBeTruthy();
  await request.post(`/api/rooms/${id}/approve`, { data: { sid: host, target: guest } });
  await request.post(`/api/rooms/${id}/start`, { data: { sid: host } });
  await expect(page.locator('#hudRow2')).toBeVisible({ timeout: 60000 });
  // гость виден хосту
  const seen1 = async () => {
    const b = await request.post(`/api/rooms/${id}/beat`, { data: { sid: host, x: 0, z: 22, hp: 100 } });
    const bj = await b.json() as { players?: Array<{ nick: string }> };
    return (bj.players ?? []).some((p) => p.nick === 'Гость');
  };
  expect(await seen1()).toBe(true);
  // тихий вылет: режем пульс страницы на 14с — сервер чистит протухшего
  await page.route('**/api/rooms/**/beat', (r) => r.abort());
  await new Promise((r) => setTimeout(r, 14000));
  await page.unroute('**/api/rooms/**/beat');
  // клиент вернулся сам: хост снова видит гостя, страница из игры не вылетала
  let back = false;
  for (let i = 0; i < 30 && !back; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    back = await seen1().catch(() => false);
  }
  expect(back).toBe(true);
  await expect(page.locator('#hudRow2')).toBeVisible();
  hctl.stop = true;
  await hpump;
});
