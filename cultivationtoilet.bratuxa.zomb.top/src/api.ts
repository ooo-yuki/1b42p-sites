// API + типы состояния. Всё, что приходит с сервера, фронт только рисует.
export interface Cell { x: number; z: number; kind: 'toilet' | 'spawn' | 'room' }

export interface InvItem { id: string; rarity: string; price: number; sell: number; count: number }

export interface LogEntry { ts: number; kind: string; text: string }

export interface GameState {
  login: string;
  money: number;
  dirty: number;
  hp: number;
  roomLevel: number;
  upg: Record<string, number>;
  cells: Cell[];
  buildCost: number;
  inv: InvItem[];
  log: LogEntry[];
  deaths: number;
  pulls: number;
  score: number;
  income: number;
  dirtyRate: number;
  upgCost: Record<string, number>;
  expandCost: number;
  cleanCost: number;
  repairCost: number;
  nextEventIn: number;
  serverTime: number;
}

export interface UpgradeDef { id: string; name: string; desc: string; base: number }
export interface ItemDef { id: string; name: string; rarity: string }
export interface Catalog { upgrades: UpgradeDef[]; items: ItemDef[]; events: { id: string; name: string; text: string }[] }

export interface PullResult { kind: string; text: string; money?: number }

let sid = localStorage.getItem('ct_sid') || '';

export function getSid(): string { return sid; }
export function setSid(v: string): void {
  sid = v;
  if (v) localStorage.setItem('ct_sid', v);
  else localStorage.removeItem('ct_sid');
}

export async function api<T = Record<string, unknown>>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data: T | null = null;
  try { data = (await res.json()) as T; } catch { /* пусто */ }
  if (!res.ok) {
    const msg = (data as { error?: string } | null)?.error || 'http-' + res.status;
    throw Object.assign(new Error(msg), { code: res.status });
  }
  return data as T;
}

export function fmt(n: number): string {
  return Math.round(n).toLocaleString('ru-RU');
}

const ERR: Record<string, string> = {
  'no-money': 'не хватает монет',
  cooldown: 'перемотай чуть позже',
  'bad-nick': 'ник: 2–20 символов, буквы/цифры/пробел',
  'bad-pass': 'пароль: 4–60 символов',
  taken: 'такой ник уже занят',
  'no-such-user': 'нет такого ника',
  'no-session': 'сессия кончилась — войди снова',
  'inv-full': 'инвентарь полон',
  'own-lot': 'это твой лот',
  gone: 'лот уже купили',
  blocked: 'там уже есть клетка',
  'too-many': 'слишком много попыток, подожди минуту',
  'no-item': 'предмет не найден',
  'bad-price': 'цена: 1 – 1 000 000',
  'bad-qty': 'количество: от 1 до числа в стаке',
};

export function errText(e: { message?: string; code?: number }): string {
  const m = e.message || '';
  if (e.code === 401 && m === 'bad-pass') return 'неверный пароль';
  return ERR[m] || m;
}

export function rarityName(r: string): string {
  return { common: 'обычный', rare: 'редкий', epic: 'эпик', legendary: 'ЛЕГЕНДА' }[r] || r;
}

const RARITY_DROP: Record<string, number> = { common: 0.6, rare: 0.25, epic: 0.12, legendary: 0.03 };

/** Шанс выпадения конкретного предмета за один смыв (ветка «предмет» 20% × шанс редкости × 1/размер пула). */
export function dropChance(items: ItemDef[], id: string): number {
  const it = items.find((i) => i.id === id);
  if (!it) return 0;
  const pool = items.filter((i) => i.rarity === it.rarity).length || 1;
  return 0.2 * (RARITY_DROP[it.rarity] || 0) / pool;
}
