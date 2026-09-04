// MIQQIL TANKS — чистая игровая логика (без DOM и three.js).
// Используется и браузером (index.html), и bun-тестами.
// Стиль 42: Мы уже победили 🏆

// ---- Техника: 3 танка + корабль + самолёт ----
export const VEHICLES = {
  t42:     { id: 't42',     name: 'Т-42 «Братуха»',    type: 'tank',  hp: 100, speed: 14, turn: 2.2, turretTurn: 2.4, damage: 25, reload: 1.1, range: 120, desc: 'Сбалансированный средний танк батальона.' },
  pyat:    { id: 'pyat',    name: 'ИС «Пятёрка»',      type: 'tank',  hp: 165, speed: 9,  turn: 1.6, turretTurn: 1.7, damage: 42, reload: 1.9, range: 110, desc: 'Тяжёлая броня. Медленный, но бьёт как Пятёрка.' },
  vihr:    { id: 'vihr',    name: 'БТ «Вихрь»',        type: 'tank',  hp: 70,  speed: 21, turn: 2.9, turretTurn: 3.2, damage: 16, reload: 0.7, range: 100, desc: 'Лёгкий и дерзкий. Успей первым.' },
  avrora:  { id: 'avrora',  name: '«Аврора-42»',       type: 'ship',  hp: 230, speed: 7,  turn: 1.2, turretTurn: 1.3, damage: 58, reload: 2.5, range: 150, desc: 'Плавучая крепость. Дом-корабль на суше.' },
  yastreb: { id: 'yastreb', name: '«Ястреб»',          type: 'plane', hp: 60,  speed: 27, turn: 3.4, turretTurn: 2.6, damage: 20, reload: 0.9, range: 130, fly: 8, desc: 'Штурмовик. Высота 8, скорость — жизнь.' },
};

// ---- Детерминированный ГСЧ (mulberry32) — общий сид даёт одинаковую арену на сервере и клиенте ----
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function vehicleList() {
  return Object.values(VEHICLES);
}

export function getVehicle(id) {
  const v = VEHICLES[id];
  if (!v) throw new Error('unknown vehicle: ' + id);
  return v;
}

// ---- Урон: линейное падение до 40% на предельной дальности, дальше 0 ----
export function calcDamage(base, dist, range) {
  if (dist < 0) dist = 0;
  if (dist > range) return 0;
  const fall = 1 - 0.6 * (dist / range);
  return Math.max(1, Math.round(base * fall));
}

export function applyHit(hp, dmg) {
  const rest = Math.max(0, hp - dmg);
  return { hp: rest, dead: rest <= 0 };
}

// ---- Зона battle royale: урон в секунду по фазе сужения ----
export function zoneDps(phase) {
  return 4 + phase * 4; // фаза 0..N: 4, 8, 12...
}

export function zoneRadius(startR, phase, minR = 12) {
  const r = startR * Math.pow(0.62, phase);
  return Math.max(minR, r);
}

// ---- Рейтинг (Elo-подобный): победа растит, поражение роняет, киллы добавляют ----
export function placementScore(placement, total) {
  if (placement <= 1) return 1;
  const q = placement / total;
  if (q <= 0.25) return 0.6;
  if (q <= 0.5) return 0.35;
  return 0.15;
}

export function updateRating(playerRating, avgEnemy, placement, total, kills) {
  const expected = 1 / (1 + Math.pow(10, (avgEnemy - playerRating) / 400));
  const score = placementScore(placement, total);
  const delta = Math.round(32 * (score - expected) + kills * 4);
  return { newRating: Math.max(100, playerRating + delta), delta };
}

// ---- Меткость ботов: крутится этими четырьмя числами ----
// Бот мажет физически — ствол реально уходит мимо конуса попадания (0.14 рад в sim.js),
// а не «попал, но мы бросили кубик и решили, что нет».
export const BOT_AIM = {
  // Конус попадания в sim.js — 0.14 рад, так что разброс шире него:
  // ~40% попаданий в упор и ~28% на пределе огня. Раньше боты били почти в точку.
  errNear: 0.34,   // разброс наведения в упор, рад
  errFar: 0.50,    // разброс на предельной дальности, рад
  reactMin: 0.4,   // задержка реакции на новую цель, с
  reactMax: 0.8,
  rangeFrac: 0.8,  // дальше range*rangeFrac бот вообще не открывает огонь
};

// Знаковая ошибка наведения: чем дальше цель, тем сильнее бот мажет.
export function botAimError(rng, dist, range) {
  const q = Math.max(0, Math.min(1, (dist || 0) / (range || 1)));
  const spread = BOT_AIM.errNear + (BOT_AIM.errFar - BOT_AIM.errNear) * q;
  return (rng() * 2 - 1) * spread;
}

export function botReactionTime(rng) {
  return BOT_AIM.reactMin + rng() * (BOT_AIM.reactMax - BOT_AIM.reactMin);
}

const BOT_NICKS = ['Кизяк', 'Чаев', 'Свят', 'Денчик', 'Бротовод', 'Слай', 'Винлайн', 'Дамафан', 'Триавзерос', 'Хасан'];

export function pickBots(n, seedFn = Math.random) {
  const pool = [...BOT_NICKS];
  const out = [];
  while (out.length < n && pool.length) {
    out.push(pool.splice(Math.floor(seedFn() * pool.length), 1)[0]);
  }
  return out;
}

export function botVehicleIds(n, seedFn = Math.random) {
  const ids = Object.keys(VEHICLES);
  return Array.from({ length: n }, () => ids[Math.floor(seedFn() * ids.length)]);
}
