/* АРЕНА — общий язык клиента и сервера. Сокет один, правда одна. */

export type Member = { id: string; name: string; alive: boolean };

export type RoomView = {
  code: string;
  phase: 'lobby' | 'play' | 'over';
  game: string;
  gameLabel: string;
  players: Member[];
  host: string;
  private: boolean;
  round: number;
  alive: string[];
  contenders: string[];
  rolls: Record<string, number>;
  winner: string | null;
  gdata: Record<string, unknown>;
};

export type PoolMember = { id: string; name: string; vote: string; enter: boolean };
export type GameDef = { label: string; min: number; max: number; turnSecs: number; icon: 'dice' | 'cards' | 'chess' };

/** Карта дурака: r 6..14 (11=В 12=Д 13=К 14=Т), s масть S/H/D/C. */
export type DCard = { r: number; s: string };
export type DPair = { a: DCard; d: DCard | null };
export type DurakPublic = {
  table: DPair[]; deckN: number; trump: string;
  attacker: string; defender: string; out: string[];
  handN: Record<string, number>;
};

/** Фигура шахмат: c цвет w/b, k вид p/n/b/r/q/k. Клетка 0=a8..63=h1. */
export type ChessPiece = { c: string; k: string } | null;
export type ChessPublic = {
  board: ChessPiece[]; turn: string; check: boolean;
  white: string; black: string;
  last: { from: number; to: number } | null;
  drawOffer: string | null; full: number;
  history: string[];
  phase: string; winner: string | null; reason: string | null;
};

export type PoolView = {
  members: PoolMember[];
  since: number;
  games: Record<string, GameDef>;
  wait: { open: boolean; ends: number; votes: Record<string, boolean>; round: number };
};

export type SMsg =
  | { t: 'welcome'; id: string; online: number; games: Record<string, GameDef> }
  | { t: 'online'; n: number }
  | { t: 'queued'; size: number; waiting: number }
  | { t: 'pool'; members: PoolMember[]; since: number; games: Record<string, GameDef>; wait: PoolView['wait'] }
  | { t: 'room' } & Omit<RoomView, 't'>
  | { t: 'join'; id: string; name: string }
  | { t: 'left'; id: string; name: string }
  | { t: 'leftRoom' }
  | { t: 'round'; round: number; need: string[]; secs: number }
  | { t: 'roll'; id: string; name: string; v: number; auto: boolean }
  | { t: 'hand'; cards: DCard[] }
  | { t: 'dturn'; attacker: string; defender: string; secs: number }
  | { t: 'dmove'; id: string; name: string; kind: string; card: DCard | null; target: DCard | null; auto?: boolean }
  | { t: 'cturn'; white: string; black: string; color: string; secs: number }
  | { t: 'cmove'; id: string; name: string; kind: string; from: number | null; to: number | null; promote: string | null; auto?: boolean }
  | { t: 'elim'; id: string; name: string; v: number; round: number; alive: string[] }
  | { t: 'over'; winner: string | null; name: string }
  | { t: 'log'; text: string }
  | { t: 'chat'; id: string; name: string; text: string }
  | { t: 'err'; msg: string }
  | { t: 'pong' };

export type CMsg =
  | { t: 'ping' }
  | { t: 'hello'; name: string }
  | { t: 'search' }
  | { t: 'stop' }
  | { t: 'voteGame'; game: string }
  | { t: 'voteEnter'; yes: boolean }
  | { t: 'voteWait'; yes: boolean }
  | { t: 'create'; game?: string }
  | { t: 'pickGame'; game: string }
  | { t: 'join'; code: string }
  | { t: 'leave' }
  | { t: 'start' }
  | { t: 'rematch' }
  | { t: 'roll' }
  | { t: 'move'; move: { kind: string; card?: DCard; target?: DCard; from?: number; to?: number; promote?: string } }
  | { t: 'chat'; text: string };

export const NAME_KEY = 'sasha_arena_name';
export const WINS_KEY = 'sasha_arena_wins';
export const MUTE_KEY = 'sasha_arena_mute';

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

export function clearWins(): void {
  try { localStorage.removeItem(WINS_KEY); } catch { /* приватный режим */ }
}

export function loadMuted(): boolean {
  try { return localStorage.getItem(MUTE_KEY) === '1'; } catch { return false; }
}

export function saveMuted(m: boolean): void {
  try { localStorage.setItem(MUTE_KEY, m ? '1' : '0'); } catch { /* приватный режим */ }
}

/** Адрес сокета: ?ws= для локалки, иначе тот же хост через /api/ws. */
export function arenaWsUrl(): string {
  const q = new URLSearchParams(location.search).get('ws');
  if (q) return q;
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${proto}//${location.host}/api/ws`;
}
