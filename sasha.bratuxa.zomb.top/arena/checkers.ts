/* Шашки русские — чистый движок без IO: доска 0=a8..63=h1, бой на тёмных.
   Сервер дёргает applyMove/timeoutMove/removePlayer, клиент рисует CheckersPublic.
   Правила: взятие обязательно и по максимуму, простые бьют вперёд и назад,
   дамка летает, проход в дамки — с продолжением боя. */

export type Color = 'w' | 'b';
export type Piece = { c: Color; k: 'm' | 'k' };

export type Seq = { from: number; to: number; via: number[]; path: number[] };

export type MoveInput = { path: number[] } | { kind: 'resign' } | { kind: 'draw' } | { kind: 'accept' };

export type Reason = 'pieces' | 'moves' | 'resign' | 'timeout' | 'leave' | 'repeat' | 'draw';

export type CheckersState = {
  board: (Piece | null)[];
  turn: Color;
  white: string;
  black: string;
  phase: 'play' | 'over';
  winner: string | null;
  reason: Reason | null;
  last: { from: number; to: number } | null;
  drawOffer: Color | null;
  posCounts: Record<string, number>;
  history: string[];
};

const file = (i: number): number => i % 8;
const rank = (i: number): number => Math.floor(i / 8);
const onBoard = (f: number, r: number): boolean => f >= 0 && f < 8 && r >= 0 && r < 8;
const idx = (f: number, r: number): number => r * 8 + f;
const opp = (c: Color): Color => (c === 'w' ? 'b' : 'w');
const DIRS = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const lastRank = (c: Color): number => (c === 'w' ? 0 : 7);

function initialBoard(): (Piece | null)[] {
  const b: (Piece | null)[] = new Array(64).fill(null);
  for (let r = 0; r < 3; r++) {
    for (let f = 0; f < 8; f++) {
      if ((f + r) % 2 === 1) b[idx(f, r)] = { c: 'b', k: 'm' };
    }
  }
  for (let r = 5; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      if ((f + r) % 2 === 1) b[idx(f, r)] = { c: 'w', k: 'm' };
    }
  }
  return b;
}

function posKey(st: CheckersState): string {
  return st.board.map(p => (p ? (p.c === 'w' ? p.k.toUpperCase() : p.k) : '.')).join('') + ' ' + st.turn;
}

export function sideOf(st: CheckersState, pid: string): Color | null {
  if (pid === st.white) return 'w';
  if (pid === st.black) return 'b';
  return null;
}

type Frame = { sq: number; kind: 'm' | 'k'; path: number[]; via: number[] };

/** Все взятия шашки с поля: DFS по цепочкам, вид может вырасти в дамку на ходу. */
function capturesFrom(bd: (Piece | null)[], sq: number, color: Color): Seq[] {
  const out: Seq[] = [];
  const start = bd[sq];
  if (!start || start.c !== color) return out;
  const dfs = (cur: number, kind: 'm' | 'k', path: number[], via: number[], taken: Set<number>): void => {
    let extended = false;
    const f = file(cur);
    const r = rank(cur);
    if (kind === 'm') {
      for (const [df, dr] of DIRS) {
        const mf = f + df;
        const mr = r + dr;
        const lf = f + 2 * df;
        const lr = r + 2 * dr;
        if (!onBoard(lf, lr)) continue;
        const mid = bd[idx(mf, mr)];
        const land = bd[idx(lf, lr)];
        if (!mid || mid.c !== opp(color) || taken.has(idx(mf, mr)) || land) continue;
        const ntaken = new Set(taken);
        ntaken.add(idx(mf, mr));
        const nk: 'm' | 'k' = lr === lastRank(color) ? 'k' : 'm';
        extended = true;
        dfs(idx(lf, lr), nk, [...path, idx(lf, lr)], [...via, idx(mf, mr)], ntaken);
      }
    } else {
      for (const [df, dr] of DIRS) {
        let nf = f + df;
        let nr = r + dr;
        // летим до первой шашки
        while (onBoard(nf, nr) && !bd[idx(nf, nr)] && !taken.has(idx(nf, nr))) {
          nf += df;
          nr += dr;
        }
        if (!onBoard(nf, nr)) continue;
        const hit = idx(nf, nr);
        const mid = bd[hit];
        if (!mid || mid.c !== opp(color) || taken.has(hit)) continue;
        // за ней — любые пустые поля для приземления
        let lf = nf + df;
        let lr = nr + dr;
        while (onBoard(lf, lr) && !bd[idx(lf, lr)] && !taken.has(idx(lf, lr))) {
          const land = idx(lf, lr);
          const ntaken = new Set(taken);
          ntaken.add(hit);
          extended = true;
          dfs(land, 'k', [...path, land], [...via, hit], ntaken);
          lf += df;
          lr += dr;
        }
      }
    }
    if (!extended && via.length > 0) {
      out.push({ from: sq, to: cur, via, path });
    }
  };
  dfs(sq, start.k, [sq], [], new Set());
  return out;
}

/** Тихие ходы шашки с поля. */
function quietsFrom(bd: (Piece | null)[], sq: number, color: Color): Seq[] {
  const out: Seq[] = [];
  const p = bd[sq];
  if (!p || p.c !== color) return out;
  const f = file(sq);
  const r = rank(sq);
  if (p.k === 'm') {
    const dr = color === 'w' ? -1 : 1;
    for (const df of [-1, 1]) {
      if (!onBoard(f + df, r + dr)) continue;
      const t = idx(f + df, r + dr);
      if (!bd[t]) out.push({ from: sq, to: t, via: [], path: [sq, t] });
    }
    return out;
  }
  for (const [df, dr] of DIRS) {
    let nf = f + df;
    let nr = r + dr;
    while (onBoard(nf, nr) && !bd[idx(nf, nr)]) {
      out.push({ from: sq, to: idx(nf, nr), via: [], path: [sq, idx(nf, nr)] });
      nf += df;
      nr += dr;
    }
  }
  return out;
}

/** Все легальные ходы цвета: взятия по максимуму, иначе тихие. */
function legalAll(st: CheckersState, c: Color): Seq[] {
  let caps: Seq[] = [];
  for (let i = 0; i < 64; i++) {
    if (st.board[i]?.c === c) caps.push(...capturesFrom(st.board, i, c));
  }
  if (caps.length > 0) {
    const max = Math.max(...caps.map(s => s.via.length));
    return caps.filter(s => s.via.length === max);
  }
  const out: Seq[] = [];
  for (let i = 0; i < 64; i++) {
    if (st.board[i]?.c === c) out.push(...quietsFrom(st.board, i, c));
  }
  return out;
}

export function legalMoves(st: CheckersState, pid: string): Seq[] {
  const c = sideOf(st, pid);
  if (!c || st.phase !== 'play' || st.turn !== c) return [];
  return legalAll(st, c);
}

/** Легальные ходы с поля (для подсветки в клиенте). */
export function legalFrom(st: CheckersState, pid: string, sq: number): Seq[] {
  const c = sideOf(st, pid);
  if (!c || st.phase !== 'play' || st.turn !== c) return [];
  if (st.board[sq]?.c !== c) return [];
  return legalAll(st, c).filter(m => m.from === sq);
}

const SQ_NAME = (i: number): string => `${'abcdefgh'[file(i)]}${8 - rank(i)}`;

function settle(st: CheckersState): void {
  const mine = st.board.filter(p => p?.c === st.turn).length;
  if (mine === 0) {
    st.phase = 'over';
    st.winner = st.turn === 'w' ? st.black : st.white;
    st.reason = 'pieces';
    return;
  }
  if (legalAll(st, st.turn).length === 0) {
    st.phase = 'over';
    st.winner = st.turn === 'w' ? st.black : st.white;
    st.reason = 'moves';
    return;
  }
  const key = posKey(st);
  st.posCounts[key] = (st.posCounts[key] ?? 0) + 1;
  if (st.posCounts[key] >= 3) {
    st.phase = 'over';
    st.winner = null;
    st.reason = 'repeat';
  }
}

function terminalNow(st: CheckersState, turn: Color): void {
  const mine = st.board.filter(p => p?.c === turn).length;
  if (mine === 0) {
    st.phase = 'over';
    st.winner = turn === 'w' ? st.black : st.white;
    st.reason = 'pieces';
    return;
  }
  if (legalAll(st, turn).length === 0) {
    st.phase = 'over';
    st.winner = turn === 'w' ? st.black : st.white;
    st.reason = 'moves';
  }
}

export function createCheckers(white: string, black: string): CheckersState {
  const st: CheckersState = {
    board: initialBoard(), turn: 'w',
    white, black, phase: 'play', winner: null, reason: null,
    last: null, drawOffer: null, posCounts: {}, history: [],
  };
  st.posCounts[posKey(st)] = 1;
  return st;
}

/** Позиция из строк для тестов: 'w'/'W' белые, 'b'/'B' чёрные, '.' пусто. */
export function fromRows(rows: string[], turn: Color, ids: { w: string; b: string }): CheckersState {
  const board: (Piece | null)[] = new Array(64).fill(null);
  rows.forEach((row, r) => {
    [...row].forEach((ch, f) => {
      if (ch === 'w') board[idx(f, r)] = { c: 'w', k: 'm' };
      else if (ch === 'W') board[idx(f, r)] = { c: 'w', k: 'k' };
      else if (ch === 'b') board[idx(f, r)] = { c: 'b', k: 'm' };
      else if (ch === 'B') board[idx(f, r)] = { c: 'b', k: 'k' };
    });
  });
  const st: CheckersState = {
    board, turn,
    white: ids.w, black: ids.b, phase: 'play', winner: null, reason: null,
    last: null, drawOffer: null, posCounts: {}, history: [],
  };
  terminalNow(st, turn);
  st.posCounts[posKey(st)] = 1;
  return st;
}

export function applyMove(st: CheckersState, pid: string, mv: MoveInput): { ok: boolean; err?: string } {
  if (st.phase !== 'play') return { ok: false, err: 'бой окончен' };
  const c = sideOf(st, pid);
  if (!c) return { ok: false, err: 'ты не в этом бою' };

  if ('kind' in mv && mv.kind === 'resign') {
    st.phase = 'over';
    st.winner = c === 'w' ? st.black : st.white;
    st.reason = 'resign';
    st.history.push(`${c === 'w' ? '0-1' : '1-0'} resign`);
    return { ok: true };
  }
  if ('kind' in mv && mv.kind === 'draw') {
    if (st.drawOffer === c) return { ok: false, err: 'уже предложил' };
    st.drawOffer = c;
    return { ok: true };
  }
  if ('kind' in mv && mv.kind === 'accept') {
    if (!st.drawOffer || st.drawOffer === c) return { ok: false, err: 'принимать нечего' };
    st.phase = 'over'; st.winner = null; st.reason = 'draw';
    st.history.push('1/2-1/2');
    return { ok: true };
  }
  if (st.turn !== c) return { ok: false, err: 'не твой ход' };
  if (!('path' in mv) || !Array.isArray(mv.path) || mv.path.length < 2) {
    return { ok: false, err: 'кривой ход' };
  }
  const path = mv.path;
  if (path.some(x => !Number.isInteger(x) || x < 0 || x > 63)) {
    return { ok: false, err: 'кривые клетки' };
  }
  if (st.board[path[0]]?.c !== c) return { ok: false, err: 'это не твоя шашка' };
  const match = legalAll(st, c).find(m =>
    m.path.length === path.length && m.path.every((sq, i) => sq === path[i]));
  if (!match) return { ok: false, err: 'так ходить нельзя' };
  // снять взятых
  for (const v of match.via) st.board[v] = null;
  const piece = st.board[match.from]!;
  st.board[match.from] = null;
  const endKind = rank(match.to) === lastRank(c) ? 'k' : piece.k;
  st.board[match.to] = { c, k: endKind };
  st.history.push(match.path.map(SQ_NAME).join('-') + (match.via.length ? 'x' : ''));
  st.last = { from: match.from, to: match.to };
  st.drawOffer = null;
  st.turn = opp(st.turn);
  settle(st);
  return { ok: true };
}

/** Уход игрока: победа оставшемуся. */
export function removePlayer(st: CheckersState, pid: string): string[] {
  if (st.phase === 'over') return st.winner ? [st.winner] : [];
  const other = pid === st.white ? st.black : pid === st.black ? st.white : null;
  st.phase = 'over';
  st.winner = other;
  st.reason = 'leave';
  return other ? [other] : [];
}

/** Кого жмёт таймер: сторона на ходу проигрывает по флагу. */
export function timeoutMove(st: CheckersState): { by: string; kind: 'flag' } {
  return { by: st.turn === 'w' ? st.white : st.black, kind: 'flag' };
}
