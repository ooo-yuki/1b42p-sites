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

interface IntroSnap {
  title: string; go: string; foeNick: string; foeUpg: string; meNick: string; meUpg: string;
  foeY: number; meY: number; find: boolean;
}

/** Интро живёт всего 3с, а вторая страница в это время грузит карту и тормозит рендер —
    поэтому карточки пишем в момент первого рендера через MutationObserver, а не щёлкаем
    по локаторам (иначе проверки не укладываются в окно и интро успевает уйти). */
const armIntro = (p: Page) => p.evaluate(() => {
  const w = window as unknown as { __introSnap?: IntroSnap | null };
  w.__introSnap = null;
  const y = (e: Element | null) => (e ? e.getBoundingClientRect().y : -1);
  const obs = new MutationObserver(() => {
    const title = document.querySelector('#duelIntroTitle');
    const foe = document.querySelector('.dqCard.foe');
    const me = document.querySelector('.dqCard.me');
    if (!title || !foe || !me) return;
    w.__introSnap = {
      title: title.textContent ?? '',
      go: document.querySelector('#duelGo')?.textContent ?? '',
      foeNick: foe.querySelector('.dqNick')?.textContent ?? '',
      foeUpg: foe.querySelector('.dqUpg')?.textContent ?? '',
      meNick: me.querySelector('.dqNick')?.textContent ?? '',
      meUpg: me.querySelector('.dqUpg')?.textContent ?? '',
      foeY: y(foe), meY: y(me),
      find: !!document.querySelector('#duelFind'),
    };
    obs.disconnect();
  });
  obs.observe(document.body, { childList: true, subtree: true, characterData: true });
});

async function readIntro(p: Page): Promise<IntroSnap> {
  // ждём именно снимок: waitForFunction отдаёт то, что вернула функция
  const h = await p.waitForFunction(
    () => {
      const v = (window as unknown as { __introSnap?: IntroSnap | null }).__introSnap;
      return v == null ? undefined : v;
    },
    null, { timeout: 30000, polling: 100 },
  );
  return await h.jsonValue<IntroSnap>();
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
  await armIntro(page);
  await page.click('#goBtn');
  await expect(page.locator('#duelFind')).toBeVisible();
  await expect(page.locator('#duelFindTitle')).toContainText('ПОИСК');
  await expect(page.locator('#duelCancel')).toBeVisible();
  await expect(page.locator('#menu')).toBeVisible();

  // B заходит: его join сразу получает пару, интро показывается сразу
  await guestOnDuel(b, 'DuelB');
  await armIntro(b);
  await b.click('#goBtn');
  const bSnap = await readIntro(b);

  // A узнаёт о паре на ближайшем поллинге (раз в 1.5с)
  const aSnap = await readIntro(page);
  await expect(page.locator('#duelFind')).toHaveCount(0);

  // оба экрана одинаковые: заголовок, отмена ушла, обратный отсчёт идёт
  for (const [who, s] of [['DuelA', aSnap], ['DuelB', bSnap]] as Array<[string, IntroSnap]>) {
    expect(s.title).toContain('ПРОТИВНИК НАЙДЕН');
    expect(s.find).toBe(false);
    expect(s.go).toContain('Старт через');
    expect(s.meNick).toContain(who);
    // строка прокачки — как в карточке бойца: ❤️💪💨 и эмодзи супера
    for (const upg of [s.foeUpg, s.meUpg]) {
      expect(upg).toContain('🔧');
      expect(upg).toContain('❤️×');
      expect(upg).toContain('💪×');
      expect(upg).toContain('💨×');
    }
  }

  // карточки: враг сверху, ты снизу; соперники поменяны местами
  expect(aSnap.foeY).toBeLessThan(aSnap.meY);
  expect(bSnap.foeY).toBeLessThan(bSnap.meY);
  expect(aSnap.foeNick).toContain('DuelB');
  expect(aSnap.meNick).toContain('DuelA');
  expect(bSnap.foeNick).toContain('DuelA');
  expect(bSnap.meNick).toContain('DuelB');

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
