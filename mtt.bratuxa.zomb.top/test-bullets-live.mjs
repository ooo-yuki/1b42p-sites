import { chromium } from '@playwright/test';
const browser = await chromium.launch({ executablePath: '/usr/local/bin/chromium', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
const errs = [];
page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));
await page.goto('http://localhost:8097/', { waitUntil: 'load', timeout: 60000 });
await page.waitForFunction(() => window.__mtt, null, { timeout: 60000 });
await page.waitForTimeout(1500);
await page.click('#guestBtn');
await page.evaluate(() => document.querySelector('#nav-play')?.click());
await page.waitForTimeout(300);
await page.click('#goBtn');
await page.waitForTimeout(4000);
console.log('MAP:', await page.evaluate(() => window.__mtt.map()));
await page.evaluate(() => { const m = window.__mtt; m.devgod(true); m.weapon('pistol'); });
// ждём живого моба
let mob = null;
for (let k = 0; k < 20 && !mob; k++) {
  mob = await page.evaluate(() => {
    const m = window.__mtt;
    const p = m.pos();
    const alive = m.mobs().filter((e) => !e.dead);
    let best = null, bd = 1e9;
    for (const e of alive) { const d = Math.hypot(e.x - p.x, e.z - p.z); if (d < bd && d > 4 && d < 25) { bd = d; best = e; } }
    return best ? { ...best, px: p.x, pz: p.z, pitch: p.pitch } : null;
  });
  if (!mob) await page.waitForTimeout(1000);
}
console.log('MOB:', JSON.stringify(mob));
if (!mob) { console.log('NO-MOB RED'); await browser.close(); process.exit(0); }
// встаём в 6м от моба лицом к нему и стреляем сразу — без пауз (мобы ходят)
const shot = await page.evaluate(() => {
  const m = window.__mtt;
  const p = m.pos();
  const alive = m.mobs().filter((e) => !e.dead);
  let best = null, bd = 1e9;
  for (const e of alive) { const d = Math.hypot(e.x - p.x, e.z - p.z); if (d < bd && d > 3) { bd = d; best = e; } }
  if (!best) return null;
  const dx = best.x - p.x, dz = best.z - p.z;
  const d = Math.hypot(dx, dz) || 1;
  const nx = dx / d, nz = dz / d;
  const yaw = Math.atan2(-nx, -nz);
  m.teleport(best.x - nx * 6, best.z - nz * 6, yaw);
  m.resetcd(); m.attack();
  return { id: best.id, hp: best.hp, d: Math.round(d * 10) / 10 };
});
console.log('SHOT:', JSON.stringify(shot));
await page.waitForTimeout(150);
const mid = await page.evaluate(() => window.__mtt.bullets());
await page.screenshot({ path: '/tmp/bullets-live.png' });
await page.waitForTimeout(1500);
const after = await page.evaluate((id) => ({ b: window.__mtt.bullets(), hp: window.__mtt.mobs().filter((e) => !e.dead).map((e) => ({ id: e.id, hp: Math.round(e.hp) })) }), shot && shot.id);
const hitMob = shot && after.hp.find((e) => e.id === shot.id);
console.log('PISTOL: hp-before=', shot && shot.hp, 'bullets-midflight=', mid, 'hitmob-after=', JSON.stringify(hitMob), 'bullets=', after.b);
console.log(mid >= 1 ? 'FLIGHT GREEN (пуля летит)' : 'FLIGHT RED');
console.log(after.b === 0 ? 'DESPAWN GREEN (пуля долетела/умерла)' : 'DESPAWN RED');
// дробовик: веер из 8 живых дробин
await page.evaluate(() => { const m = window.__mtt; m.weapon('shotgun'); m.resetcd(); m.attack(); });
let peak = 0;
for (let k = 0; k < 10; k++) { const b = await page.evaluate(() => window.__mtt.bullets()); if (b > peak) peak = b; await page.waitForTimeout(60); }
await page.screenshot({ path: '/tmp/bullets-shotgun.png' });
console.log('SHOTGUN-PEAK:', peak, peak >= 6 ? 'GREEN (веер летит)' : 'RED');
console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
await browser.close();
