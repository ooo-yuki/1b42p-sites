/* КЕЙСЫ — данные арсенала. Цены, дропы и веса СВЯТЫ (PRODUCT.md).
   Менять можно только оформление и helpers вокруг. */

export type Drop = { icon: string; label: string; amount: number; w: number };
export type CaseDef = {
  id: string; icon: string; name: string; price: number; desc: string; drops: Drop[];
};

export const CASES: CaseDef[] = [
  { id: 'barracks', icon: 'barracks', name: 'Казарма', price: 100, desc: 'Скромно, но со вкусом',
    drops: [
      { icon: 'hardhat', label: 'Каска', amount: 50, w: 35 },
      { icon: 'boots', label: 'Берцы', amount: 80, w: 30 },
      { icon: 'medal', label: 'Медалька', amount: 120, w: 20 },
      { icon: 'flame', label: 'Запал', amount: 200, w: 11 },
      { icon: 'coins', label: 'Касса части', amount: 500, w: 4 },
    ] },
  { id: 'arsenal', icon: 'arsenal', name: 'Арсенал', price: 300, desc: 'Для тех, кто в теме',
    drops: [
      { icon: 'glock', label: 'Глок', amount: 150, w: 32 },
      { icon: 'vest', label: 'Броник', amount: 250, w: 28 },
      { icon: 'truck', label: 'Урал', amount: 400, w: 22 },
      { icon: 'rocket', label: 'Ракета', amount: 700, w: 13 },
      { icon: 'crown', label: 'Звезда генерала', amount: 1500, w: 5 },
    ] },
  { id: 'hq42', icon: 'hq42', name: 'Штаб 42', price: 1000, desc: 'Олл-ин по-батальонному',
    drops: [
      { icon: 'radio', label: 'Рация', amount: 500, w: 30 },
      { icon: 'map', label: 'Карта', amount: 800, w: 27 },
      { icon: 'anchor', label: 'Якорь Авроры', amount: 1200, w: 23 },
      { icon: 'eagle', label: 'Орёл', amount: 2500, w: 14 },
      { icon: 'jackpot', label: 'Джекпот 42', amount: 10000, w: 6 },
    ] },
];

export const LANE_LEN = 30;
export const HIT_INDEX = 24;
export const CELL_STEP = 94; // 86px cell + 8px gap — синхронно с strip.css

/** Суммарный вес кейса (знаменатель шансов). */
export function totalWeight(c: CaseDef): number {
  return c.drops.reduce((s, d) => s + d.w, 0);
}

/** Честный шанс дропа в процентах, округление — только для показа. */
export function chancePct(c: CaseDef, d: Drop): number {
  const t = totalWeight(c);
  return t > 0 ? (d.w / t) * 100 : 0;
}

/** Матожидание кейса в фишках — для подписи «окупится в среднем». */
export function evOf(c: CaseDef): number {
  const t = totalWeight(c);
  if (t <= 0) return 0;
  return c.drops.reduce((s, d) => s + d.amount * (d.w / t), 0);
}

/** Лучший дроп кейса (по сумме). */
export function bestOf(c: CaseDef): Drop {
  return c.drops.reduce((a, b) => (b.amount > a.amount ? b : a), c.drops[0]);
}

/** Инварианты святыни: цены/веса/суммы. Возвращает список нарушений (пусто — ок). */
export function validateCases(list: CaseDef[]): string[] {
  const bad: string[] = [];
  const prices: Record<string, number> = { barracks: 100, arsenal: 300, hq42: 1000 };
  for (const c of list) {
    if (prices[c.id] !== undefined && c.price !== prices[c.id])
      bad.push(`${c.id}: цена ${c.price}, святая ${prices[c.id]}`);
    if (c.drops.length !== 5) bad.push(`${c.id}: дропов ${c.drops.length}, святых 5`);
    for (const d of c.drops) {
      if (!(d.w > 0)) bad.push(`${c.id}/${d.label}: вес ${d.w}`);
      if (!(d.amount > 0)) bad.push(`${c.id}/${d.label}: сумма ${d.amount}`);
    }
  }
  return bad;
}

/** Взвешенный ролл. rnd инжектится ради тестов/детерминизма. */
export function pickDrop(drops: Drop[], rnd: () => number = Math.random): Drop {
  const total = drops.reduce((s, d) => s + d.w, 0);
  let x = rnd() * total;
  for (const d of drops) { x -= d.w; if (x < 0) return d; }
  return drops[drops.length - 1];
}

/** Строит ленту: мусор + гарантированный выигрыш на HIT_INDEX. */
export function buildLane(c: CaseDef, win: Drop, rnd: () => number = Math.random): Drop[] {
  const lane: Drop[] = Array.from({ length: LANE_LEN }, () => pickDrop(c.drops, rnd));
  lane[HIT_INDEX] = win;
  return lane;
}

/** Куда крутить ленту, чтобы HIT_INDEX встал под иглу (центр витрины). */
export function targetX(wrapW: number): number {
  return -(HIT_INDEX * CELL_STEP - Math.max(0, wrapW / 2 - 43));
}
