import type { Page } from '@playwright/test';
import { test, expect, started } from './fixture';

/** Гость со своим ником: карта Duel выбирается на вкладке карт, кнопка — на «ИГРАТЬ». */
async function guestOnDuel(page: Page, nick: string): Promise<void> {
  await page.goto('/');
  await expect(page).toHaveTitle(/42 LIVE/);
  await page.click('#guestBtn');
  await page.fill('#nick', nick);
  await page.click('#nav-maps');
  await page.click('#map-duel');
  await page.click('#nav-play');
  await expect(page.locator('#goBtn')).toContainText('В ДУЭЛЬ');
}

test('подбор дуэли: пара, интро с карточками и автостарт через 3с', async ({ page, browser }) => {
  test.setTimeout(240000);
  const errs: string[] = [];
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message.slice(0, 160)));
  const ctxB = await browser.newContext();
  // те же заглушки, что и в fixture: перерыв глушим, хабу отвечаем пустым 200
  await ctxB.route('**/api/maintenance', (r) => r.fulfill({ json: { ok: true, on: false } }));
  await ctxB.route('**/hub.bratuxa.zomb.top/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
  const b = await ctxB.newPage();
  b.on('pageerror', (e) => errs.push('pageerror: ' + e.message.slice(0, 160)));

  // A заходит первым: вместо соло на карте — экран поиска с кнопкой отмены
  await guestOnDuel(page, 'DuelA');
  await page.click('#goBtn');
  await expect(page.locator('#duelFind')).toBeVisible();
  await expect(page.locator('#duelFindTitle')).toContainText('ПОИСК');
  await expect(page.locator('#duelCancel')).toBeVisible();
  await expect(page.locator('#menu')).toBeVisible();

  // B заходит: его join сразу получает пару
  await guestOnDuel(b, 'DuelB');
  await b.click('#goBtn');
  await expect(b.locator('#duelIntro')).toBeVisible({ timeout: 20000 });
  await expect(b.locator('#duelFind')).toHaveCount(0);

  // A узнаёт о паре на ближайшем поллинге (раз в 1.5с)
  await expect(page.locator('#duelIntro')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('#duelFind')).toHaveCount(0);
  await expect(page.locator('#duelIntroTitle')).toContainText('ПРОТИВНИК НАЙДЕН');

  // карточки: враг сверху, ты снизу, у каждой своя строка прокачки как в меню бойца
  const foeBox = await page.locator('.dqCard.foe').boundingBox();
  const meBox = await page.locator('.dqCard.me').boundingBox();
  expect(foeBox && meBox ? foeBox.y : 1e9).toBeLessThan(meBox ? meBox.y : -1e9);
  await expect(page.locator('.dqCard.foe .dqNick')).toContainText('DuelB');
  await expect(page.locator('.dqCard.me .dqNick')).toContainText('DuelA');
  await expect(b.locator('.dqCard.foe .dqNick')).toContainText('DuelA');
  await expect(b.locator('.dqCard.me .dqNick')).toContainText('DuelB');
  for (const p of [page, b]) {
    for (const cls of ['.dqCard.foe .dqUpg', '.dqCard.me .dqUpg']) {
      await expect(p.locator(cls)).toContainText('🔧 ❤️×');
      await expect(p.locator(cls)).toContainText('💪×');
      await expect(p.locator(cls)).toContainText('💨×');
    }
    await expect(p.locator('#duelGo')).toContainText('Старт через');
  }

  // автостарт: интро живёт 3с, потом оба уходят в бой сами
  await expect(page.locator('#menu')).toHaveCount(0, { timeout: 30000 });
  await expect(b.locator('#menu')).toHaveCount(0, { timeout: 30000 });
  await started(page);
  await started(b);

  // спавны по разные стороны: первый вошёл — z=+20, второй — z=-20 (телепорт приходит с битом)
  const near = (p: Page, want: number) => p.waitForFunction((z) => {
    const m = (window as unknown as { __mtt: { pos: () => { x: number; z: number } } }).__mtt;
    const q = m.pos();
    return Math.abs(q.x) < 3 && Math.abs(q.z - z) < 4;
  }, want, { timeout: 40000, polling: 500 });
  await near(page, 20);
  await near(b, -20);

  type M = { map: () => string; pos: () => { x: number; z: number } };
  const at = async (p: Page) => p.evaluate(() => {
    const m = (window as unknown as { __mtt: M }).__mtt;
    return { map: m.map(), x: m.pos().x, z: m.pos().z };
  });
  expect((await at(page)).map).toBe('duel');
  expect((await at(b)).map).toBe('duel');

  expect(errs).toEqual([]);
  await ctxB.close();
});

test('подбор дуэли: отмена возвращает в меню, поиск можно начать заново', async ({ page }) => {
  test.setTimeout(90000);
  await guestOnDuel(page, 'DuelC');
  await page.click('#goBtn');
  await expect(page.locator('#duelFind')).toBeVisible();
  await page.click('#duelCancel');
  await expect(page.locator('#duelFind')).toHaveCount(0);
  await expect(page.locator('#menu')).toBeVisible();
  await expect(page.locator('#goBtn')).toBeEnabled();
  await expect(page.locator('#goBtn')).toContainText('В ДУЭЛЬ');
  // очередь чиста — второй заход снова ищет соперника, а не выкидывает в старую комнату
  await page.click('#goBtn');
  await expect(page.locator('#duelFind')).toBeVisible();
  await page.click('#duelCancel');
  await expect(page.locator('#duelFind')).toHaveCount(0);
});
