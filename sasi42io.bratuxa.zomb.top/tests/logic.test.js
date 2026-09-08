'use strict';
// Task 2: тест чистой логики sasi42io через window.__hook.
// Headless: стабы document/window/localStorage/requestAnimationFrame,
// грузим РЕАЛЬНЫЙ инлайн-скрипт из index.html, в конце process.exit(0)
// (игра крутит requestAnimationFrame — без exit node висит).
// Запуск: timeout 10 node tests/logic.test.js (ждём exit 0).
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// --- стабы ---
function makeEl() {
  return {
    style: {},
    textContent: '',
    innerHTML: '',
    width: 800,
    height: 600,
    addEventListener() {},
    getContext() {
      return new Proxy({}, { get: (t, p) => (p === 'canvas' ? {} : () => {}) });
    },
  };
}
const els = {};
const sandbox = {
  console,
  Math,
  JSON,
  parseInt,
  isNaN,
  Infinity,
  Array: Array,
  Object: Object,
  Uint8Array: Uint8Array,
  crypto: { getRandomValues: (a) => a },
  localStorage: { getItem: () => null, setItem: () => {} },
  requestAnimationFrame() { return 0; }, // НЕ запускаем игровой цикл
  setInterval() { return 0; },
  setTimeout: setTimeout,
  fetch: () => Promise.resolve({}),
  window: null,
  document: { getElementById: (id) => (els[id] || (els[id] = makeEl())) },
};
sandbox.window = {
  innerWidth: 800,
  innerHeight: 600,
  addEventListener() {},
  __hook: null,
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

// --- грузим реальный игровой скрипт (первый инлайн <script>) ---
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
assert.ok(scripts.length >= 1, 'inline script not found');
vm.runInContext(scripts[0], sandbox, { filename: 'game-inline.js' });
const __hook = sandbox.window.__hook;
assert.ok(__hook, 'window.__hook missing');

// --- очки еды: банан 5, связка 25, торнадо 70 (через spawnFood веса 70/25/5) ---
assert.strictEqual(__hook.spawnFood(0.0).pts, 5);
assert.strictEqual(__hook.spawnFood(0.69).pts, 5);
assert.strictEqual(__hook.spawnFood(0.70).pts, 25);
assert.strictEqual(__hook.spawnFood(0.94).pts, 25);
assert.strictEqual(__hook.spawnFood(0.95).pts, 70);
assert.strictEqual(__hook.spawnFood(0.99).pts, 70);
assert.strictEqual(__hook.eatFood(0, 5, 1), 5); // банан
assert.strictEqual(__hook.eatFood(0, 25, 1), 25); // связка
assert.strictEqual(__hook.eatFood(0, 70, 1), 70); // торнадо

// --- бустер x2: очки удваиваются (банан со звездой даёт 10) ---
assert.strictEqual(__hook.eatFood(0, 5, 2), 10);

// --- столкновение головой с телом = смерть ---
assert.strictEqual(__hook.collide(100, 100, 100, 100, 12), true); // голова в теле
assert.strictEqual(__hook.collide(100, 100, 105, 100, 12), true); // рядом — задевает
assert.strictEqual(__hook.collide(0, 0, 500, 500, 12), false); // далеко — мимо

// --- stepBot: возвращает угол, охотник идёт на слабого игрока ---
const W = 3000, H = 3000;
const a0 = __hook.stepBot(
  { x: 1500, y: 1500, angle: Math.PI, score: 50, kind: 'normal' },
  [{ x: 100, y: 100 }],
  { x: 2000, y: 2000, score: 10 },
  W, H
);
assert.ok(Number.isFinite(a0), 'stepBot must return finite angle');
const hunterWeak = __hook.stepBot(
  { x: 1500, y: 1500, angle: 0, score: 50, kind: 'hunter' },
  [{ x: 100, y: 100 }],
  { x: 1600, y: 1500, score: 10 }, // игрок слабее — цель: восток (0 рад)
  W, H
);
assert.ok(Math.abs(hunterWeak - 0) < 0.13, 'hunter chases weaker player, got ' + hunterWeak);

console.log('logic.test.js: OK (5/25/70, x2=10, collide, stepBot)');

// --- __hook API: направление + пауза ---
assert.ok(__hook.getDir().x === 1 && __hook.getDir().y === 0, 'дефолт: восток'); // getDir отдаёт живой объект — сравниваем поля, не ссылки
const d1 = __hook.setDir(3, 4);
assert.ok(Math.abs(d1.x - 0.6) < 1e-9 && Math.abs(d1.y - 0.8) < 1e-9, 'setDir normalizes');
assert.ok(__hook.getDir().x === d1.x && __hook.getDir().y === d1.y, 'getDir отдаёт текущий вектор');
const d0 = __hook.setDir(0, 0); // ноль игнорируем — направление не меняется
assert.ok(d0.x === d1.x && d0.y === d1.y, 'ноль не меняет направление');

assert.strictEqual(__hook.isPaused(), false); // дефолт: не на паузе
assert.strictEqual(__hook.setPaused(true), true);
assert.strictEqual(__hook.isPaused(), true);
assert.strictEqual(__hook.togglePause(), false); // сняли
assert.strictEqual(__hook.isPaused(), false);
assert.strictEqual(__hook.togglePause(), true); // поставили
assert.strictEqual(__hook.setPaused(false), false); // сброс для остальных тестов

// --- фриз мира паузой: tickTimers не тикает, frame не двигает змейку ---
const tickTimers = sandbox.tickTimers;
assert.strictEqual(typeof tickTimers, 'function', 'tickTimers must be reachable');
__hook.setPaused(true);
const frozen = { star: 1, starT: 5, bolt: 1, boltT: 5 };
tickTimers(frozen, 60);
assert.strictEqual(frozen.starT, 5, 'paused: starT frozen');
assert.strictEqual(frozen.boltT, 5, 'paused: boltT frozen');
__hook.setPaused(false);
tickTimers(frozen, 60);
assert.ok(frozen.starT < 5 && frozen.boltT < 5, 'unpaused: timers tick');
assert.ok(
  html.includes('if (!alive || isPaused()) { last = t; return; }'),
  'frame must freeze world on pause and refresh last (no dt jump after resume)'
);

console.log('logic.test.js: OK hook API (setDir/getDir/setPaused/togglePause/isPaused, pause freeze)');

// --- стены-убийцы: hitsWall в __hook, граница x<=10||x>=W-10||y<=10||y>=H-10 ---
assert.strictEqual(typeof __hook.hitsWall, 'function', 'hitsWall must be in __hook');
assert.strictEqual(__hook.hitsWall(1500, 1500, W, H), false); // центр — жив
assert.strictEqual(__hook.hitsWall(10, 1500, W, H), true); // x<=10 — смерть
assert.strictEqual(__hook.hitsWall(11, 1500, W, H), false);
assert.strictEqual(__hook.hitsWall(W - 10, 1500, W, H), true); // x>=W-10 — смерть
assert.strictEqual(__hook.hitsWall(W - 11, 1500, W, H), false);
assert.strictEqual(__hook.hitsWall(1500, 10, W, H), true); // y<=10 — смерть
assert.strictEqual(__hook.hitsWall(1500, 11, W, H), false);
assert.strictEqual(__hook.hitsWall(1500, H - 10, W, H), true); // y>=H-10 — смерть
assert.strictEqual(__hook.hitsWall(1500, H - 11, W, H), false);
assert.ok(
  html.includes('if (alive && hitsWall(player.x, player.y, W, H)) playerDie();'),
  'wall death must go through common flow (playerDie)'
);

// --- игрок не клемпится, боты клемпятся ---
__hook.setDir(1, 0); // строго на восток
const mkP = { x: W - 11, y: 1500, angle: 0, segs: [{ x: W - 11, y: 1500 }], score: 10, star: 0, bolt: 0, starT: 0, boltT: 0 };
sandbox.moveDir(mkP, 10);
assert.ok(mkP.x > W - 10, 'player must NOT clamp (wall = death), got ' + mkP.x);
const mkB = { x: W - 11, y: 1500, angle: 0, segs: [{ x: W - 11, y: 1500 }], score: 10, star: 0, bolt: 0, starT: 0, boltT: 0 };
sandbox.moveSnake(mkB, W + 500, 1500, 10);
assert.ok(mkB.x <= W - 10, 'bots stay clamped, got ' + mkB.x);

// --- дроп с ботов: dropLoot в __hook, веса 70/25/5 ---
assert.strictEqual(typeof __hook.dropLoot, 'function', 'dropLoot must be in __hook');
assert.strictEqual(__hook.dropLoot(0, () => 0.5).length, 0);
assert.ok(__hook.dropLoot(3, () => 0.0).every((t) => t === 0), 'rnd=0 -> all type 0');
assert.ok(__hook.dropLoot(3, () => 0.7).every((t) => t === 1), 'rnd=0.7 -> all type 1');
assert.ok(__hook.dropLoot(3, () => 0.99).every((t) => t === 2), 'rnd=0.99 -> all type 2');
let __i = 0;
const loot1000 = __hook.dropLoot(1000, () => (__i++) / 1000); // равномерный проход [0,1)
const c0 = loot1000.filter((t) => t === 0).length;
const c1 = loot1000.filter((t) => t === 1).length;
const c2 = loot1000.filter((t) => t === 2).length;
assert.strictEqual(c0, 700, 'weight type0 ~70%, got ' + c0);
assert.strictEqual(c1, 250, 'weight type1 ~25%, got ' + c1);
assert.strictEqual(c2, 50, 'weight type2 ~5%, got ' + c2);
assert.ok(
  html.includes('dropLoot(n, Math.random)') && html.includes('FOOD[types[i]].pts'),
  'die(s) must drop weighted loot (count as before)'
);

// --- сдаться: кнопка «Завершить игру» в оверлее паузы → общий flow ---
assert.ok(html.includes('id="giveup"'), 'pause overlay must have giveup button');
assert.ok(html.includes('>Завершить игру<'), 'giveup button label');
assert.ok(html.includes("getElementById('giveup')"), 'giveup must be wired');
assert.ok(
  html.includes("playerDie();") && html.includes('function playerDie()'),
  'giveup/wall must use common playerDie flow (score + record)'
);

console.log('logic.test.js: OK walls (hitsWall, no-clamp player, clamped bots), dropLoot 700/250/50, giveup');

// --- магазин: цены, баффы, скины, щит (чистая логика в __hook) ---
assert.strictEqual(Object.keys(__hook.SHOP_PRICES).sort().join(','), 'buff_magnet,buff_score,buff_speed,shield,skin_crimson,skin_gold,skin_ocean,skin_violet');
assert.strictEqual(__hook.SHOP_PRICES.skin_crimson, 5000);
assert.strictEqual(__hook.SHOP_PRICES.skin_ocean, 5000);
assert.strictEqual(__hook.SHOP_PRICES.skin_violet, 5000);
assert.strictEqual(__hook.SHOP_PRICES.skin_gold, 5000);
assert.strictEqual(__hook.SHOP_PRICES.buff_speed, 10000);
assert.strictEqual(__hook.SHOP_PRICES.buff_score, 15000);
assert.strictEqual(__hook.SHOP_PRICES.buff_magnet, 20000);
assert.strictEqual(__hook.SHOP_PRICES.shield, 3000);
assert.strictEqual(__hook.shopGain(10, 1, false), 10); // без баффа
assert.strictEqual(__hook.shopGain(10, 1, true), 25); // очки ×2.5
assert.strictEqual(__hook.shopGain(5, 2, true), 25); // звезда × бафф
assert.strictEqual(__hook.shopSpeed(10, false), 10);
assert.ok(Math.abs(__hook.shopSpeed(10, true) - 14) < 1e-9, 'speed x1.4'); // скорость ×1.4
assert.strictEqual(__hook.shopPickupR(false), 36);
assert.strictEqual(__hook.shopPickupR(true), 108); // магнит: 3 клетки (36×3)
assert.strictEqual(__hook.shopSkinColor('skin_crimson'), '#dc2626');
assert.strictEqual(__hook.shopSkinColor('skin_gold'), '#ffd700');
assert.strictEqual(__hook.shopSkinColor('nope'), '#fbbf24'); // дефолт
assert.strictEqual(__hook.shieldHas({}), false);
assert.strictEqual(__hook.shieldHas({ shield: 1 }), true);
const __inv = { shield: 1 };
assert.strictEqual(__hook.shieldUse(__inv), true); // consume: qty-1
assert.strictEqual(__inv.shield, 0);
assert.strictEqual(__hook.shieldUse(__inv), false); // пусто — не гасит

// --- магазин в паузе: блок, баланс, 8 товаров, ник-подсказка, скин, баффы, щит ---
assert.ok(html.includes('id="shop"'), 'pause must contain shop block');
assert.ok(html.includes('id="shopCoins"'), 'shop must show coin balance');
assert.ok(html.includes('id="coins"'), 'HUD must show coin balance');
assert.ok(html.includes('>Купить<'), 'shop items must have buy buttons');
assert.ok(html.includes('sasi42io_skin'), 'skin choice must persist in sasi42io_skin');
assert.ok(html.includes('shopHint'), 'no-nick hint must exist');
assert.ok(html.includes("'/wallet?site='") && html.includes("'/shop/buy'") && html.includes("'/shop/consume'"), 'shop must use wallet/buy/consume API');
assert.ok(html.includes("shopHas('buff_speed')") && html.includes('shopSpeed(base, true)'), 'speed buff x1.4 must apply');
assert.ok(html.includes("shopHas('buff_score')"), 'score buff x2.5 must apply');
assert.ok(html.includes('shopPickupR(mag)'), 'magnet pickup must apply');
assert.ok(html.includes('shieldBlock()'), 'shield must cancel one death');

console.log('logic.test.js: OK shop (prices, x1.4/x2.5/magnet/shield, pause block, HUD coins)');
// --- умный ИИ: dodgeTurn (увёрт) + bestFood (приоритет торнадо) ---
assert.strictEqual(typeof __hook.dodgeTurn, 'function', 'dodgeTurn must be in __hook');
assert.strictEqual(typeof __hook.bestFood, 'function', 'bestFood must be in __hook');
assert.strictEqual(__hook.dodgeTurn({ x: 1500, y: 1500, angle: 0 }, [], W, H), 0); // центр — чисто
assert.strictEqual(__hook.dodgeTurn({ x: 1500, y: 1500, angle: 0 }, [{ x: 2900, y: 2900 }], W, H), 0); // далеко — 0
// стена: у левой стены курсом на запад — поправка до 0.25 (разворот на 180°)
const dw = __hook.dodgeTurn({ x: 50, y: 1500, angle: Math.PI }, [], W, H);
assert.ok(dw !== 0 && Math.abs(dw) <= 0.25, 'wall dodge turns away, got ' + dw);
// stepBot применяет увёрт первым: еда за стеной не перебивает выживание
const sbw = __hook.stepBot(
  { x: 50, y: 1500, angle: Math.PI, score: 10, kind: 'normal' },
  [{ x: 0, y: 1500, type: 0 }],
  { x: 2000, y: 2000, score: 1 },
  W, H, []
);
assert.ok(Math.abs(sbw - (Math.PI + dw)) < 1e-9, 'stepBot applies dodge first, got ' + sbw);
// тело: чужак по курсу в 100px — увёрт, за спиной/мёртвая зона — 0
const db = __hook.dodgeTurn({ x: 1500, y: 1500, angle: 0 }, [{ x: 1600, y: 1500 }], W, H);
assert.ok(Math.abs(db) > 0 && Math.abs(db) <= 0.25, 'body dodge turns away, got ' + db);
assert.strictEqual(__hook.dodgeTurn({ x: 1500, y: 1500, angle: 0 }, [{ x: 1400, y: 1500 }], W, H), 0); // за спиной — 0
assert.strictEqual(__hook.dodgeTurn({ x: 1500, y: 1500, angle: 0 }, [{ x: 1700, y: 1500 }], W, H), 0); // 200px — далеко
// змейка как угроза (segs) + себя игнорируем
const me = { x: 1500, y: 1500, angle: 0, segs: [{ x: 1500, y: 1500 }, { x: 1490, y: 1500 }, { x: 1480, y: 1500 }, { x: 1600, y: 1500 }] };
assert.ok(__hook.dodgeTurn(me, [me], W, H) === 0, 'self ignored');
assert.ok(Math.abs(__hook.dodgeTurn({ x: 1500, y: 1500, angle: 0 }, [me], W, H)) > 0, 'snake body dodged');
// торнадо type 2 в 300px бьёт банан в 100px (300/4=75 < 100)
const bf = __hook.bestFood(
  { x: 1500, y: 1500, angle: -Math.PI / 2 },
  [{ x: 1600, y: 1500, type: 0 }, { x: 1500, y: 1200, type: 2 }]
);
assert.strictEqual(bf.type, 2, 'tornado wins over closer banana');
const sbt = __hook.stepBot(
  { x: 1500, y: 1500, angle: -Math.PI / 2, score: 10, kind: 'normal' },
  [{ x: 1600, y: 1500, type: 0 }, { x: 1500, y: 1200, type: 2 }],
  { x: 2900, y: 2900, score: 1 },
  W, H, []
);
assert.ok(Math.abs(sbt - -Math.PI / 2) < 0.13, 'stepBot steers to tornado, got ' + sbt);

console.log('logic.test.js: OK smart AI (dodgeTurn wall/body, bestFood tornado x4)');

// --- звук и мясорубка: рыг/труба молча no-op в vm, BOT_N=25, топ общий ---
assert.strictEqual(__hook.BOT_N, 25, 'meatgrinder: 25 bots');
assert.strictEqual(typeof __hook.burp, 'function', 'burp must be in __hook');
assert.strictEqual(typeof __hook.clang, 'function', 'clang must be in __hook');
assert.strictEqual(__hook.burp(true), undefined, 'burp no-op without AudioContext');
assert.strictEqual(__hook.clang(), undefined, 'clang no-op without AudioContext');
assert.ok(html.includes('if (s === player) burp(true)'), 'burp only when YOU eat');
assert.ok(html.includes('if (all[q] === player) clang()'), 'clang only when bot dies on YOU');
assert.ok(!html.includes('Mute') && !html.includes('muteBtn'), 'no mute button by design (video muted attr is autoplay requirement, not a button)');
assert.ok(html.includes('var n = BOT_N') && html.includes('bots.length < BOT_N'), 'spawn + respawn keep 25');
assert.ok(
  html.includes('bots.concat([player])') && html.includes('.slice(0, 10)'),
  'top-10 already shared: bots compete'
);

console.log('logic.test.js: OK sound (burp/clang) + meatgrinder (25 bots, shared top-10)');

// --- тиры жадности: еда растёт со счётом (границы 1500/3000/5500) ---
assert.strictEqual(__hook.scoreTier(0), 1);
assert.strictEqual(__hook.scoreTier(1499), 1);
assert.strictEqual(__hook.scoreTier(1500), 2);
assert.strictEqual(__hook.scoreTier(2999), 2);
assert.strictEqual(__hook.scoreTier(3000), 2.5);
assert.strictEqual(__hook.scoreTier(5499), 2.5);
assert.strictEqual(__hook.scoreTier(5500), 3.5);
assert.strictEqual(__hook.scoreTier(99999), 3.5);
assert.strictEqual(__hook.eatFood(0, 70, __hook.scoreTier(0)), 70); // торнадо до 1500
assert.strictEqual(__hook.eatFood(0, 70, __hook.scoreTier(2000)), 140); // торнадо x2
assert.strictEqual(__hook.eatFood(0, 70, __hook.scoreTier(4000)), 175); // торнадо x2.5
assert.strictEqual(__hook.eatFood(0, 70, __hook.scoreTier(6000)), 245); // торнадо x3.5
assert.ok(html.includes('scoreTier(s.score) *'), 'eatCheck must apply tier multiplier');

console.log('logic.test.js: OK tiers (x1/x2/x2.5/x3.5)');

// --- фиолет-подлянка: шанс 5%, -500 ровно, в ноль, без множителей ---
assert.strictEqual(__hook.PURPLE_P, 0.05, 'purple chance 5%');
assert.strictEqual(__hook.purpleRoll(0.0), true);
assert.strictEqual(__hook.purpleRoll(0.049), true);
assert.strictEqual(__hook.purpleRoll(0.05), false);
assert.strictEqual(__hook.purpleRoll(0.99), false);
assert.strictEqual(__hook.eatPurple(2900), 2400);
assert.strictEqual(__hook.eatPurple(500), 0);
assert.strictEqual(__hook.eatPurple(100), 0, 'floor zero, no negative');
assert.ok(html.includes('type: 3, pts: -500'), 'placeFood must spawn purple type 3');
assert.ok(html.includes('eatPurple(s.score)'), 'eatCheck must apply flat -500');

console.log('logic.test.js: OK purple (5%, -500, floor 0)');

// --- интро: сначала видео + кнопка, игра только после ▶ Играть ---
assert.ok(html.includes('id="intro"'), 'intro overlay must exist');
assert.ok(html.includes('id="introVideo"') && html.includes('src="intro.mp4"'), 'intro video must be intro.mp4');
assert.ok(html.includes('id="playBtn"') && html.includes('Играть'), 'center play button');
assert.ok(html.includes("getElementById('playBtn')"), 'play must be wired');
assert.ok(!/^newGame\(\);/m.test(html), 'no autostart: game begins only on Play');

console.log('logic.test.js: OK intro (video + play gate)');
process.exit(0);
