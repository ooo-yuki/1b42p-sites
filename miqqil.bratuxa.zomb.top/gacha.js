// MIQQIL GACHA «ПРЫЖОК 42» — чистая логика гачи (без DOM).
// Импортируется index.html и bun-тестами. Стиль 42: Мы уже победили 🏆
//
// Пул: вся техника кроме стартового Т-42 «Братуха» (он твой с начала).
// Повторка ничего не даёт — только первое выпадение открывает машину.

// id -> звёзды и шанс (%). Сумма обязана быть 100.
export const GACHA_POOL = [
  { id: 'avrora',  stars: 5, rate: 3 },
  { id: 'pyat',    stars: 4, rate: 10 },
  { id: 'yastreb', stars: 4, rate: 14 },
  { id: 'vihr',    stars: 3, rate: 73 },
];

export const STARTER = 't42';
export const START_SPINS = 5;
export const PITY_4 = 10; // каждые 10 прыжков без 4★+ — принудительно 4★
export const PITY_5 = 90; // каждые 90 прыжков без 5★ — принудительно 5★

// Состояние гачи игрока. Хранится в localStorage ключом miqqil_gacha.
export function defaultGacha() {
  return { spins: START_SPINS, owned: [], pity4: 0, pity5: 0, total: 0 };
}

export function poolTotal() {
  return GACHA_POOL.reduce((s, p) => s + p.rate, 0);
}

function pickWeighted(rng) {
  const total = poolTotal();
  let x = rng() * total;
  for (const p of GACHA_POOL) {
    x -= p.rate;
    if (x < 0) return p;
  }
  return GACHA_POOL[GACHA_POOL.length - 1];
}

function pickForcedStars(stars, rng) {
  const cands = GACHA_POOL.filter(p => p.stars === stars);
  if (!cands.length) return pickWeighted(rng);
  const total = cands.reduce((s, p) => s + p.rate, 0);
  let x = rng() * total;
  for (const p of cands) {
    x -= p.rate;
    if (x < 0) return p;
  }
  return cands[cands.length - 1];
}

// Один прыжок. Мутирует st. Возвращает {id, stars, isNew} или {error:'no-spins'}.
export function rollOnce(st, rng = Math.random) {
  if (!st || st.spins <= 0) return { error: 'no-spins' };
  st.spins -= 1;
  st.total += 1;
  st.pity4 += 1;
  st.pity5 += 1;
  let p;
  if (st.pity5 >= PITY_5) p = pickForcedStars(5, rng);
  else if (st.pity4 >= PITY_4) p = pickForcedStars(4, rng);
  else p = pickWeighted(rng);
  if (p.stars >= 4) st.pity4 = 0;
  if (p.stars >= 5) st.pity5 = 0;
  const isNew = !st.owned.includes(p.id);
  if (isNew) st.owned.push(p.id);
  return { id: p.id, stars: p.stars, isNew };
}

// +1 пропуск за сыгранную битву.
export function grantSpin(st, n = 1) {
  st.spins += n;
  return st.spins;
}

export function isUnlocked(st, id) {
  if (id === STARTER) return true;
  return (st.owned || []).includes(id);
}
