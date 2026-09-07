import { test, expect } from '@playwright/test';

// Один игрок в браузере + второй (призрак) бьётся через fetch из той же страницы:
// проверяет ВЕСЬ конвейер видимости (сервер сводит, клиент рисует) без второй 3D-страницы.
test('probe ghost visibility', async ({ page }) => {
  test.setTimeout(300000);
  await page.goto('/');
  await expect(page).toHaveTitle(/42 LIVE/);
  await page.click('#guestBtn');
  const room = 'GHOST' + Date.now().toString().slice(-5);
  await page.fill('#nick', 'Альфа');
  await page.click('#nav-rooms');
  await page.fill('#roomDraft', room);
  await page.click('#roomCreate');
  await expect(page.locator('#roomStart')).toBeVisible({ timeout: 15000 });
  const secText = await page.locator('#roomSec').innerText();
  const id = secText.match(/\(([A-Z0-9]{6})\)/)![1];
  console.log('ROOM', id);
  // призрак просится и ДЫШИТ пульсом как настоящий клиент (иначе заявка протухает)
  const gs = await page.evaluate(async (roomId) => {
    const j = await fetch(`/api/rooms/${roomId}/join`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nick: 'Призрак', char: 'krysa' }),
    }).then((r) => r.json()) as { sid: string };
    let gx = 5;
    const beat = () => fetch(`/api/rooms/${roomId}/beat`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sid: j.sid, char: 'krysa', x: gx, z: 6, yaw: 1, hp: 90, score: 0, kills: 0, wave: 1, weapon: 'bat', py: 0, atk: 0, dead: false }),
    }).then((r) => r.json()).catch(() => ({}));
    await beat();
    const timer = window.setInterval(() => { gx += 1; void beat(); }, 2000);
    (window as unknown as { __ghostTimer?: number }).__ghostTimer = timer;
    return { sid: j.sid };
  }, id);
  console.log('GHOST', JSON.stringify(gs));
  // создатель видит заявку и принимает
  await expect(page.locator('#approve-0')).toBeVisible({ timeout: 30000 });
  await page.click('#approve-0');
  // старт и вход
  await page.click('#roomStart');
  await expect(page.locator('#hudRow2')).toBeVisible({ timeout: 60000 });
  // призрак двигается: 5 пульсов со смещением
  for (let i = 0; i < 5; i++) {
    await page.evaluate(([roomId, sid, x]: [string, string, number]) => fetch(`/api/rooms/${roomId}/beat`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sid, char: 'krysa', x, z: 6, yaw: 1, hp: 90, score: 0, kills: 0, wave: 1, weapon: 'bat', py: 0, atk: 0, dead: false }),
    }), [id, (gs as { sid: string }).sid, 5 + i] as [string, string, number]);
    await page.waitForTimeout(700);
  }
  const seen = await page.evaluate(() => (window as unknown as { __mtt: { remoteList: () => Array<{ nick: string; x: number; weapon?: string }> } }).__mtt.remoteList());
  console.log('A-SEES', JSON.stringify(seen));
  expect(seen.some((r) => r.nick === 'Призрак')).toBe(true);
});
