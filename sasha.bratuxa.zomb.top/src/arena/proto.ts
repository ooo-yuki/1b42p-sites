/* АРЕНА — общий язык клиента и сервера. Сокет один, правда одна. */

export type Member = { id: string; name: string; alive: boolean };

export type RoomView = {
  code: string;
  phase: 'lobby' | 'play' | 'over';
  players: Member[];
  host: string;
  size: number;
  private: boolean;
  round: number;
  alive: string[];
  contenders: string[];
  rolls: Record<string, number>;
  winner: string | null;
};

export type SMsg =
  | { t: 'welcome'; id: string; online: number }
  | { t: 'online'; n: number }
  | { t: 'queued'; size: number; waiting: number }
  | { t: 'room' } & Omit<RoomView, 't'>
  | { t: 'join'; id: string; name: string }
  | { t: 'left'; id: string; name: string }
  | { t: 'leftRoom' }
  | { t: 'round'; round: number; need: string[]; secs: number }
  | { t: 'roll'; id: string; name: string; v: number; auto: boolean }
  | { t: 'elim'; id: string; name: string; v: number; round: number; alive: string[] }
  | { t: 'over'; winner: string | null; name: string }
  | { t: 'log'; text: string }
  | { t: 'chat'; id: string; name: string; text: string }
  | { t: 'err'; msg: string }
  | { t: 'pong' };

export type CMsg =
  | { t: 'ping' }
  | { t: 'hello'; name: string }
  | { t: 'queue'; size: number }
  | { t: 'create' }
  | { t: 'join'; code: string }
  | { t: 'leave' }
  | { t: 'start' }
  | { t: 'rematch' }
  | { t: 'roll' }
  | { t: 'chat'; text: string };

export const NAME_KEY = 'sasha_arena_name';
export const WINS_KEY = 'sasha_arena_wins';

export function loadName(): string {
  try { return localStorage.getItem(NAME_KEY) ?? ''; } catch { return ''; }
}

export function saveName(n: string): void {
  try { localStorage.setItem(NAME_KEY, n); } catch { /* приватный режим */ }
}

export function loadWins(): number {
  try { return Number(localStorage.getItem(WINS_KEY) ?? 0) || 0; } catch { return 0; }
}

export function addWin(): number {
  const n = loadWins() + 1;
  try { localStorage.setItem(WINS_KEY, String(n)); } catch { /* приватный режим */ }
  return n;
}

/** Адрес сокета: ?ws= для локалки, иначе тот же хост через /api/ws. */
export function arenaWsUrl(): string {
  const q = new URLSearchParams(location.search).get('ws');
  if (q) return q;
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${proto}//${location.host}/api/ws`;
}
