// Cultivation Toilet — чистая игровая логика. rng передаётся снаружи, чтобы тесты были детерминированы.
// Сервер (server.ts) владеет состоянием игрока, клиент только рисует и шлёт действия.

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface InvItem {
  id: string;
  rarity: Rarity;
  price: number;
  count: number; // сколько штук в этом слоте (стак), 1..MAX_STACK
}

export interface LogEntry {
  ts: number;
  kind: 'loot' | 'hit' | 'event' | 'sys';
  text: string;
}

export interface Player {
  login: string;
  money: number;
  dirty: number; // 0..100
  hp: number; // 0..100
  roomLevel: number;
  upg: Record<string, number>;
  inv: InvItem[];
  cells: Cell[]; // построенные клетки карты 2×2 м
  last: number; // ms, когда в последний раз применялся тик
  nextEvent: number; // ms, когда упадёт случайное событие
  log: LogEntry[];
  deaths: number;
  pulls: number;
  created: number;
}

/** Клетка карты 2×2 м. kind: toilet — главная (в ней унитаз), spawn — точка возрождения, room — построенная. */
export interface Cell {
  x: number;
  z: number;
  kind: 'toilet' | 'spawn' | 'room';
}

export interface UpgradeDef {
  id: string;
  name: string;
  desc: string;
  base: number; // базовая цена 1-го уровня
  income?: number; // денег/сек за уровень
  dirtyMul?: number; // множитель к скорости роста грязи (отрицательный = чистота)
  regen?: number; // hp/сек за уровень
  resist?: number; // снижение урона событий за уровень
  loot?: number; // прибавка к выпадающим деньгам за уровень
}

/** Апгрейды комнаты. Порядок = порядок в интерфейсе. */
export const UPGRADES: UpgradeDef[] = [
  { id: 'toilet', name: 'Унитаз «Фарфор-3000»', desc: 'Основа прокачки: больше денег за смыв', base: 40, income: 1.4, loot: 0.15 },
  { id: 'sink', name: 'Раковина с краном', desc: 'Пассивный доход', base: 65, income: 1.2 },
  { id: 'tiles', name: 'Глазурованная плитка', desc: 'Грязь растёт на 9% медленнее', base: 95, dirtyMul: -0.09 },
  { id: 'vent', name: 'Вентиляция', desc: 'Грязь растёт на 13% медленнее', base: 130, dirtyMul: -0.13 },
  { id: 'light', name: 'Свет в 200 ватт', desc: 'Светло и доходно', base: 85, income: 0.9 },
  { id: 'door', name: 'Дверь с уплотнителем', desc: 'Чуть меньше грязи и плюс к деньгам', base: 160, income: 0.4, dirtyMul: -0.07 },
  { id: 'plant', name: 'Кактус на бачке', desc: 'Комната дышит, раны затягиваются', base: 210, income: 1.0, dirtyMul: -0.05, regen: 0.03 },
  { id: 'chem', name: 'Арсенал химии', desc: 'Чистка в автономке, грязь почти не растёт', base: 280, income: 0.5, dirtyMul: -0.15 },
  { id: 'pipes', name: 'Медные трубы', desc: 'Крепость: события бьют слабее', base: 420, income: 1.6, resist: 0.08 },
  { id: 'shrine', name: 'Алтарь слива', desc: 'Ритуальный доход и удача в джекпоте', base: 950, income: 4.2, loot: 0.05 },
];

export const UPG_BY_ID: Record<string, UpgradeDef> = Object.fromEntries(UPGRADES.map((u) => [u.id, u]));

export interface ItemDef {
  id: string;
  name: string;
  rarity: Rarity;
  base: number;
}

const RARITY_PRICE: Record<Rarity, number> = { common: 1, rare: 3, epic: 8, legendary: 22 };

/** Предметы, выпадающие из унитаза и торгующиеся на площадке. */
export const ITEMS: ItemDef[] = [
  { id: 'rag', name: 'Влажная тряпка', rarity: 'common', base: 12 },
  { id: 'coin', name: 'Монета из сифона', rarity: 'common', base: 16 },
  { id: 'soap', name: 'Остаток мыла', rarity: 'common', base: 20 },
  { id: 'brush', name: 'Щётка предков', rarity: 'common', base: 24 },
  { id: 'glove', name: 'Резиновая перчатка', rarity: 'rare', base: 55 },
  { id: 'duck', name: 'Резиновая утка-мутант', rarity: 'rare', base: 70 },
  { id: 'scroll', name: 'Свиток слива', rarity: 'rare', base: 88 },
  { id: 'key', name: 'Ключ от вентиляции', rarity: 'rare', base: 96 },
  { id: 'orb', name: 'Хрустальная помпа', rarity: 'epic', base: 240 },
  { id: 'mask', name: 'Маска санитара', rarity: 'epic', base: 300 },
  { id: 'core', name: 'Ядро канализации', rarity: 'epic', base: 360 },
  { id: 'relic', name: 'Реликвия Первого Смыва', rarity: 'legendary', base: 1200 },
  { id: 'crown', name: 'Корона Обитателя', rarity: 'legendary', base: 1800 },
];

const ITEMS_BY_RARITY: Record<Rarity, ItemDef[]> = {
  common: ITEMS.filter((i) => i.rarity === 'common'),
  rare: ITEMS.filter((i) => i.rarity === 'rare'),
  epic: ITEMS.filter((i) => i.rarity === 'epic'),
  legendary: ITEMS.filter((i) => i.rarity === 'legendary'),
};

export interface GameEvent {
  id: string;
  name: string;
  text: string;
}

export const EVENTS: GameEvent[] = [
  { id: 'rats', name: 'Крысы', text: 'Крысы подрыли плитку' },
  { id: 'rot', name: 'Тухлятина', text: 'Во всём воняет тухлятиной' },
  { id: 'mutant', name: 'Мутант из трубы', text: 'Из трубы вылез мутант — но оставил деньги' },
  { id: 'clog', name: 'Засор', text: 'Труба засорилась, грязь пошла наверх' },
  { id: 'inspector', name: 'Инспектор', text: 'Инспектор оштрафовал комнату' },
  { id: 'bloom', name: 'Благоухание', text: 'Проветрили — комната засияла' },
  { id: 'find', name: 'Находка в вентиляции', text: 'В вентиляции нашли пачку купюр' },
  { id: 'leak', name: 'Прорыв', text: 'Прорвало трубу, вода залила пол' },
];

export interface PullResult {
  kind: 'money' | 'item' | 'dirty' | 'event' | 'hurt' | 'jackpot';
  text: string;
  money?: number;
  item?: InvItem;
  dirty?: number;
  hp?: number;
}

const MAX_LOG = 40;
const MAX_INV = 40;
export const MAX_STACK = 50;

/** Сколько ещё помещается в существующие стаки предмета + в пустые слоты. */
export function invRoom(p: Player, id: string): number {
  let room = 0;
  for (const st of p.inv) if (st.id === id) room += MAX_STACK - st.count;
  room += (MAX_INV - p.inv.length) * MAX_STACK;
  return room;
}

/** Добавляет qty штук предмета в инвентарь, стакая до MAX_STACK в слоте. Возвращает сколько реально добавлено. */
export function addToInv(p: Player, item: Omit<InvItem, 'count'>, qty: number): number {
  let added = 0;
  for (const st of p.inv) {
    if (st.id !== item.id || st.count >= MAX_STACK) continue;
    const take = Math.min(MAX_STACK - st.count, qty - added);
    st.count += take;
    added += take;
    if (added >= qty) return added;
  }
  while (added < qty && p.inv.length < MAX_INV) {
    const take = Math.min(MAX_STACK, qty - added);
    p.inv.push({ ...item, count: take });
    added += take;
  }
  return added;
}

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export function upgCost(base: number, level: number): number {
  return Math.round(base * Math.pow(1.62, level));
}

/** Суммарное сопротивление грязи (не ниже 0.25). */
export function dirtyFactor(p: Player): number {
  let m = 1;
  for (const u of UPGRADES) {
    const lvl = p.upg[u.id] || 0;
    if (u.dirtyMul) m += u.dirtyMul * lvl;
  }
  return clamp(m, 0.25, 1);
}

/** Скорость роста грязи, единиц/сек. */
export function dirtyRate(p: Player): number {
  return 0.07 * (1 + p.roomLevel * 0.12) * dirtyFactor(p);
}

/** Пассивный доход, денег/сек. Грязь бьёт по производительности. */
export function incomeRate(p: Player): number {
  let sum = 0;
  for (const u of UPGRADES) sum += (u.income || 0) * (p.upg[u.id] || 0);
  return sum * (1 + p.roomLevel * 0.08) * (1 - p.dirty / 180);
}

export function resistFactor(p: Player): number {
  let r = 0;
  for (const u of UPGRADES) r += (u.resist || 0) * (p.upg[u.id] || 0);
  return clamp(1 - r, 0.3, 1);
}

export function score(p: Player): number {
  const levels = Object.values(p.upg).reduce((a, b) => a + b, 0);
  const items = p.inv.reduce((s, i) => s + i.count, 0);
  return Math.floor(p.roomLevel * 1000 + levels * 120 + p.money + items * 25);
}

export function newPlayer(login: string, now: number): Player {
  return {
    login,
    money: 60,
    dirty: 0,
    hp: 100,
    roomLevel: 0,
    upg: { toilet: 1 },
    inv: [],
    cells: startCells(),
    last: now,
    nextEvent: now + 90_000,
    log: [{ ts: now, kind: 'sys', text: 'Комната заселилась. Смывай и прокачивай.' }],
    deaths: 0,
    pulls: 0,
    created: now,
  };
}

/** Стартовая карта: главная клетка с туалетом [0,0] и клетка спавна [0,1]. */
export function startCells(): Cell[] {
  return [
    { x: 0, z: 0, kind: 'toilet' },
    { x: 0, z: 1, kind: 'spawn' },
  ];
}

export type Dir = 'n' | 's' | 'e' | 'w';

const DELTA: Record<Dir, [number, number]> = { n: [0, -1], s: [0, 1], e: [1, 0], w: [-1, 0] };

/** Клетка в указанную сторону от (x, z). */
export function neighbour(x: number, z: number, dir: Dir): { x: number; z: number } {
  const [dx, dz] = DELTA[dir];
  return { x: x + dx, z: z + dz };
}

export function hasCell(cells: Cell[], x: number, z: number): boolean {
  return cells.some((c) => c.x === x && c.z === z);
}

/** Свободно ли место для новой клетки и есть ли откуда строить (from обязана быть в карте). */
export function canBuild(cells: Cell[], fromX: number, fromZ: number, dir: Dir): { ok: boolean; x?: number; z?: number } {
  if (!DELTA[dir] || !hasCell(cells, fromX, fromZ)) return { ok: false };
  const t = neighbour(fromX, fromZ, dir);
  if (hasCell(cells, t.x, t.z)) return { ok: false };
  return { ok: true, x: t.x, z: t.z };
}

/** Цена следующей клетки: 250 × 1.6^n, где n — уже построено сверх стартовых двух. */
export function buildCost(count: number): number {
  return Math.round(250 * Math.pow(1.6, Math.max(0, count - 2)));
}

export function pushLog(p: Player, kind: LogEntry['kind'], text: string, now: number): void {
  p.log.push({ ts: now, kind, text });
  if (p.log.length > MAX_LOG) p.log.splice(0, p.log.length - MAX_LOG);
}

/** Применяет пассивный доход/грязь/регенерацию за прошедшее время. Вызывается перед любым действием. */
export function tick(p: Player, now: number, rng: () => number): GameEvent | null {
  const dt = clamp((now - p.last) / 1000, 0, 3600 * 12);
  p.last = now;
  if (dt > 0) {
    p.money += incomeRate(p) * dt;
    p.dirty = clamp(p.dirty + dirtyRate(p) * dt, 0, 100);
    let regen = 0;
    for (const u of UPGRADES) regen += (u.regen || 0) * (p.upg[u.id] || 0);
    p.hp = clamp(p.hp + regen * dt, 0, 100);
  }
  let fired: GameEvent | null = null;
  if (now >= p.nextEvent) {
    fired = applyEvent(p, rng, now);
    p.nextEvent = now + 75_000 + Math.floor(rng() * 90_000);
  }
  if (p.hp <= 0) die(p, now);
  return fired;
}

/** Случайное событие: наказывает или балует, но всегда оставляет шанс на реакцию. */
export function applyEvent(p: Player, rng: () => number, now: number): GameEvent {
  const ev = EVENTS[Math.floor(rng() * EVENTS.length)];
  const R = resistFactor(p);
  switch (ev.id) {
    case 'rats':
      p.hp -= 9 * R;
      p.dirty = clamp(p.dirty + 7, 0, 100);
      break;
    case 'rot':
      p.dirty = clamp(p.dirty + 16, 0, 100);
      break;
    case 'mutant':
      p.hp -= 14 * R;
      p.money += 70 + Math.floor(rng() * 80);
      break;
    case 'clog':
      p.dirty = clamp(p.dirty + 11, 0, 100);
      p.money = Math.max(0, p.money - 35);
      break;
    case 'inspector':
      p.money = Math.max(0, p.money - 45);
      break;
    case 'bloom':
      p.dirty = clamp(p.dirty - 22, 0, 100);
      break;
    case 'find':
      p.money += 110 + Math.floor(rng() * 140);
      break;
    case 'leak':
      p.hp -= 7 * R;
      p.dirty = clamp(p.dirty + 13, 0, 100);
      break;
  }
  if (p.hp <= 0) die(p, now);
  pushLog(p, 'event', `${ev.name}: ${ev.text}`, now);
  return ev;
}

/** Смерть комнаты: платишь процентом денег, ремонт на середине. */
export function die(p: Player, now: number): void {
  p.deaths += 1;
  p.money = Math.floor(p.money * 0.7);
  p.hp = 45;
  p.dirty = 55;
  let lost = 2; // теряем до 2 штук предметов
  for (let i = p.inv.length - 1; i >= 0 && lost > 0; i--) {
    const st = p.inv[i];
    const take = Math.min(st.count, lost);
    st.count -= take;
    lost -= take;
    if (st.count <= 0) p.inv.splice(i, 1);
  }
  pushLog(p, 'hit', 'Комната сдохла: −30% денег, потеряли 2 предмета', now);
}

function rollRarity(rng: () => number): Rarity {
  const r = rng();
  if (r < 0.6) return 'common';
  if (r < 0.85) return 'rare';
  if (r < 0.97) return 'epic';
  return 'legendary';
}

/** Основная механика: клик по унитазу. Требует кулдаун (проверяет сервер). */
export function pull(p: Player, rng: () => number, now: number): PullResult {
  const toilet = p.upg.toilet || 0;
  const lootMul = (1 + p.roomLevel * 0.25) * (1 + toilet * 0.15) * (1 + (p.upg.shrine || 0) * 0.05);
  const r = rng();
  let res: PullResult;
  if (r < 0.5) {
    const money = Math.round((8 + rng() * 32) * lootMul);
    p.money += money;
    res = { kind: 'money', text: `Выпало ${money} монет`, money };
  } else if (r < 0.7) {
    const pool = ITEMS_BY_RARITY[rollRarity(rng)];
    const def = pool[Math.floor(rng() * pool.length)];
    const one: Omit<InvItem, 'count'> = { id: def.id, rarity: def.rarity, price: Math.round(def.base * (1 + p.roomLevel * 0.1)) };
    const added = addToInv(p, one, 1);
    if (added === 0) {
      const refund = Math.round(one.price / 2);
      p.money += refund;
      res = { kind: 'money', text: `Инвентарь полон — предмет продан за ${refund}`, money: refund };
    } else {
      res = { kind: 'item', text: `Выпал предмет: ${def.name}`, item: { ...one, count: added } };
    }
  } else if (r < 0.82) {
    const dirty = 5 + Math.floor(rng() * 10);
    p.dirty = clamp(p.dirty + dirty, 0, 100);
    res = { kind: 'dirty', text: `Из унитаза брызнуло грязью: +${dirty}`, dirty };
  } else if (r < 0.92) {
    const ev = applyEvent(p, rng, now);
    res = { kind: 'event', text: `Событие: ${ev.name}` };
  } else if (r < 0.97) {
    const hp = 18 + Math.floor(rng() * 26);
    p.hp = clamp(p.hp - hp * resistFactor(p), 0, 100);
    if (p.hp <= 0) die(p, now);
    res = { kind: 'hurt', text: `Что-то вырвалось: −${hp} HP`, hp };
  } else {
    const money = Math.round(200 * lootMul);
    p.money += money;
    res = { kind: 'jackpot', text: `ДЖЕКПОТ: +${money} монет!`, money };
  }
  p.pulls += 1;
  pushLog(p, res.kind === 'hurt' || res.kind === 'dirty' ? 'hit' : 'loot', res.text, now);
  return res;
}

/** Цена покупки следующего уровня апгрейда. */
export function upgradeCost(id: string, p: Player): number | null {
  const def = UPG_BY_ID[id];
  if (!def) return null;
  return upgCost(def.base, p.upg[id] || 0);
}

/** Цена расширения комнаты (следующий уровень). */
export function expandCost(p: Player): number {
  return Math.round(350 * Math.pow(1.85, p.roomLevel));
}

/** Чистка грязи за деньги. */
export function cleanCost(p: Player): number {
  return Math.ceil(Math.pow(p.dirty, 1.45));
}

/** Ремонт hp за деньги. */
export function repairCost(p: Player): number {
  return Math.ceil((100 - p.hp) * 4);
}

/** Цена продажи предмета на площадке. */
export function sellPrice(it: InvItem): number {
  return Math.max(1, Math.round(it.price * RARITY_PRICE[it.rarity] * 0.9));
}
