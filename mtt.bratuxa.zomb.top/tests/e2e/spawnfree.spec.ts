import { test, expect, type Page } from '@playwright/test';

// RED: враги не спавнятся в стенках. Бэкрумс-лабиринт — худший случай:
// плотная карта, цепочка spawnEnemy может не найти точку и уронить моба
// в дефолт (0,40) без проверки.
async function bootBackrooms(page: Page): Promise<void> {
  await page.goto('/');
  await expect(page).toHaveTitle(/42 LIVE/);
  await page.click('#guestBtn');
  await page.evaluate(() => (document.querySelector('#map-backrooms') as HTMLButtonElement).click());
  await page.click('#goBtn');
  await expect(page.locator('#fps')).toBeVisible({ timeout: 30000 });
}

test('спавн: 30 мобов в лабиринте — ни один не в стене', async ({ page }: { page: Page }) => {
  test.setTimeout(240000);
  await bootBackrooms(page);
  type M = {
    spawnKind: (k: 'walk' | 'fly' | 'boss') => number;
    foes: () => Array<{ x: number; z: number; dead: boolean }>;
    solidAt: (x: number, z: number, y: number) => boolean;
  };
  // спавним пачками: движок может капать лимит — читаем всех живых в конце каждой пачки
  const seen = new Map<number, { x: number; z: number }>();
  const bornBad: Array<{ x: number; z: number }> = [];
  for (let i = 0; i < 30; i++) {
    await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.spawnKind('walk'));
    // замер СРАЗУ в момент спавна — до того как моб пошёл (отделяет спавн в стене от захода в стену)
    const fresh = await page.evaluate(() => {
      const m = (window as unknown as { __mtt: M }).__mtt;
      const live = m.foes().filter((f) => !f.dead);
      const last = live[live.length - 1];
      if (!last) return null;
      return { x: last.x, z: last.z, inside: m.solidAt(last.x, last.z, 0) };
    });
    if (fresh?.inside) bornBad.push({ x: fresh.x, z: fresh.z });
    await page.waitForTimeout(300);
  }
  const foes = await page.evaluate(() => (window as unknown as { __mtt: M }).__mtt.foes());
  expect(foes.length).toBeGreaterThan(0);
  const embedded: Array<{ x: number; z: number }> = [];
  for (const f of foes) {
    if (f.dead) continue;
    const inside = await page.evaluate(
      ([x, z]) => (window as unknown as { __mtt: M }).__mtt.solidAt(x, z, 0),
      [f.x, f.z] as [number, number],
    );
    if (inside) embedded.push({ x: f.x, z: f.z });
    void seen;
  }
  console.log(`DIAG spawnfree foes=${foes.length} bornBad=${bornBad.length} embedded=${embedded.length} ${JSON.stringify(embedded.slice(0, 5))}`);
  expect(bornBad, `родились в стенах: ${JSON.stringify(bornBad.slice(0, 8))}`).toHaveLength(0);
  expect(embedded, `мобы в стенах: ${JSON.stringify(embedded.slice(0, 8))}`).toHaveLength(0);
});
