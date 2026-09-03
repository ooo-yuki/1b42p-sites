// MIQQIL TANKS — чистая игровая логика (без DOM и three.js).
// Используется и браузером (index.html), и bun-тестами.
// Стиль 42: Мы уже победили 🏆

// ---- Техника: 3 танка + корабль + самолёт ----
export const VEHICLES = {
  t42:     { id: 't42',     name: 'Т-42 «Братуха»',    type: 'tank',  hp: 100, speed: 14, turn: 2.2, damage: 25, reload: 1.1, range: 120, desc: 'Сбалансированный средний танк батальона.' },
  pyat:    { id: 'pyat',    name: 'ИС «Пятёрка»',      type: 'tank',  hp: 165, speed: 9,  turn: 1.6, damage: 42, reload: 1.9, range: 110, desc: 'Тяжёлая броня. Медленный, но бьёт как Пятёрка.' },
  vihr:    { id: 'vihr',    name: 'БТ «Вихрь»',        type: 'tank',  hp: 70,  speed: 21, turn: 2.9, damage: 16, reload: 0.7, range: 100, desc: 'Лёгкий и дерзкий. Успей первым.' },
  avrora:  { id: 'avrora',  name: '«Аврора-42»',       type: 'ship',  hp: 230, speed: 7,  turn: 1.2, damage: 58, reload: 2.5, range: 150, desc: 'Плавучая крепость. Дом-корабль на суше.' },
  yastreb: { id: 'yastreb', name: '«Ястреб»',          type: 'plane', hp: 60,  speed: 27, turn: 3.4, damage: 20, reload: 0.9, range: 130, fly: 8, desc: 'Штурмовик. Высота 8, скорость — жизнь.' },
};

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
