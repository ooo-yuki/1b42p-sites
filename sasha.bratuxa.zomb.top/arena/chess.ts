/* Шахматы — чистый движок без IO: доска 0=a8..63=h1, ФИДЕ-база.
   Сервер дёргает applyMove/timeoutMove/removePlayer, клиент рисует ChessPublic.
   Правило арены: мат/флаг/сдача — победа, паты и мёртвые позиции — ничья. */

export type Color = 'w' | 'b';
export type Kind = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type Piece = { c: Color; k: Kind };
export type Promote = 'q' | 'r' | 'b' | 'n';

export type MoveInput =
  | { from: number; to: number; promote?: Promote }
  | { kind: 'resign' }
  | { kind: 'draw' }
  | { kind: 'accept' };

export type Move = { from: number; to: number; promote?: Promote; castle?: 'K' | 'Q'; ep?: boolean };

export type Reason =
  | 'mate' | 'stalemate' | 'resign' | 'timeout' | 'leave'
  | 'material' | 'fifty' | 'repeat' | 'draw';

export type ChessState = {
  board: (Piece | null)[];
  turn: Color;
  castling: { wk: boolean; wq: boolean; bk: boolean; bq: boolean };
  ep: number | null;
  half: number;
  full: number;
  white: string;
  black: string;
  phase: 'play' | 'over';
  winner: string | null;
  reason: Reason | null;
  last: { from: number; to: number } | null;
  check: boolean;
  drawOffer: Color | null;
  posCounts: Record<string, number>;
  history: string[];
};

const file = (i: number): number => i % 8;
const rank = (i: number): number => Math.floor(i / 8);
const onBoard = (f: number, r: number): boolean => f >= 0 && f < 8 && r >= 0 && r < 8;
const idx = (f: number, r: number): number => r * 8 + f;
const opp = (c: Color): Color => (c === 'w' ? 'b' : 'w');

const KNIGHT = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
const KING_D = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
const DIAG = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const ORTH = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function initialBoard(): (Piece | null)[] {
  const back: Kind[] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
  const b: (Piece | null)[] = new Array(64).fill(null);
  for (let f = 0; f < 8; f++) {
    b[idx(f, 0)] = { c: 'b', k: back[f] };
    b[idx(f, 1)] = { c: 'b', k: 'p' };
    b[idx(f, 6)] = { c: 'w', k: 'p' };
    b[idx(f, 7)] = { c: 'w', k: back[f] };
  }
  return b;
}

/** Ключ позиции для троекрата: доска + очередь + рокировки + битое поле. */
function posKey(st: ChessState): string {
  const b = st.board.map(p => (p ? (p.c === 'w' ? p.k.toUpperCase() : p.k) : '.')).join('');
  const c = st.castling;
  return `${b} ${st.turn} ${c.wk ? 'K' : ''}${c.wq ? 'Q' : ''}${c.bk ? 'k' : ''}${c.bq ? 'q' : ''} ${st.ep ?? '-'}`;
}

function findKing(bd: (Piece | null)[], c: Color): number {
  return bd.findIndex(p => p && p.c === c && p.k === 'k');
}

/** Бито ли поле sq цветом by. */
function attacked(bd: (Piece | null)[], sq: number, by: Color): boolean {
  const f = file(sq);
  const r = rank(sq);
  // пешки: белая бьёт вверх (r-1), чёрная вниз (r+1)
  const pr = by === 'w' ? r - 1 : r + 1;
  for (const df of [-1, 1]) {
    if (onBoard(f + df, pr)) {
      const p = bd[idx(f + df, pr)];
      if (p && p.c === by && p.k === 'p') return true;
    }
  }
  for (const [df, dr] of KNIGHT) {
    if (!onBoard(f + df, r + dr)) continue;
    const p = bd[idx(f + df, r + dr)];
    if (p && p.c === by && p.k === 'n') return true;
  }
  const slide = (dirs: number[][], kinds: Kind[]): boolean => {
    for (const [df, dr] of dirs) {
      let nf = f + df;
      let nr = r + dr;
      while (onBoard(nf, nr)) {
        const p = bd[idx(nf, nr)];
        if (p) {
          if (p.c === by && kinds.includes(p.k)) return true;
          break; // своё или чужое неслайдерное — направление закрыто, смотрим дальше
        }
        nf += df;
        nr += dr;
      }
    }
    return false;
  };
  if (slide(DIAG, ['b', 'q'])) return true;
  if (slide(ORTH, ['r', 'q'])) return true;
  for (const [df, dr] of KING_D) {
    if (!onBoard(f + df, r + dr)) continue;
    const p = bd[idx(f + df, r + dr)];
    if (p && p.c === by && p.k === 'k') return true;
  }
  return false;
}

/** Псевдолегальные ходы фигуры (без проверки своего шаха). */
function pseudoFrom(st: ChessState, sq: number): Move[] {
  const bd = st.board;
  const p = bd[sq];
  if (!p) return [];
  const out: Move[] = [];
  const f = file(sq);
  const r = rank(sq);
  const push = (nf: number, nr: number, extra?: Partial<Move>): void => {
    if (!onBoard(nf, nr)) return;
    const t = idx(nf, nr);
    const q = bd[t];
    if (!q || q.c !== p.c) out.push({ from: sq, to: t, ...extra });
  };
  if (p.k === 'p') {
    const dir = p.c === 'w' ? -1 : 1;
    const start = p.c === 'w' ? 6 : 1;
    const last = p.c === 'w' ? 0 : 7;
    if (!bd[idx(f, r + dir)]) {
      const promo = r + dir === last ? (['q', 'r', 'b', 'n'] as Promote[]) : [undefined];
      for (const pr of promo) out.push({ from: sq, to: idx(f, r + dir), promote: pr });
      if (r === start && !bd[idx(f, r + 2 * dir)]) out.push({ from: sq, to: idx(f, r + 2 * dir) });
    }
    for (const df of [-1, 1]) {
      if (!onBoard(f + df, r + dir)) continue;
      const t = idx(f + df, r + dir);
      const q = bd[t];
      const isPromo = r + dir === last;
      if (q && q.c !== p.c) {
        if (isPromo) for (const pr of ['q', 'r', 'b', 'n'] as Promote[]) out.push({ from: sq, to: t, promote: pr });
        else out.push({ from: sq, to: t });
      } else if (!q && st.ep === t) {
        out.push({ from: sq, to: t, ep: true });
      }
    }
    return out;
  }
  if (p.k === 'n' || p.k === 'k') {
    for (const [df, dr] of (p.k === 'n' ? KNIGHT : KING_D)) push(f + df, r + dr);
    if (p.k === 'k') {
      // рокировки: король не под шахом, поля прохода не биты
      const home = p.c === 'w' ? 7 : 0;
      const ksq = idx(4, home);
      if (sq === ksq && !attacked(bd, ksq, opp(p.c))) {
        const rights = p.c === 'w' ? st.castling.wk : st.castling.bk;
        const rookK = bd[idx(7, home)];
        if (rights && rookK?.c === p.c && rookK?.k === 'r'
          && !bd[idx(5, home)] && !bd[idx(6, home)]
          && !attacked(bd, idx(5, home), opp(p.c)) && !attacked(bd, idx(6, home), opp(p.c))) {
          out.push({ from: sq, to: idx(6, home), castle: 'K' });
        }
        const rightsQ = p.c === 'w' ? st.castling.wq : st.castling.bq;
        const rookQ = bd[idx(0, home)];
        if (rightsQ && rookQ?.c === p.c && rookQ?.k === 'r'
          && !bd[idx(1, home)] && !bd[idx(2, home)] && !bd[idx(3, home)]
          && !attacked(bd, idx(3, home), opp(p.c)) && !attacked(bd, idx(2, home), opp(p.c))) {
          out.push({ from: sq, to: idx(2, home), castle: 'Q' });
        }
      }
    }
    return out;
  }
  const dirs = p.k === 'b' ? DIAG : p.k === 'r' ? ORTH : [...DIAG, ...ORTH];
  for (const [df, dr] of dirs) {
    let nf = f + df;
    let nr = r + dr;
    while (onBoard(nf, nr)) {
      const t = idx(nf, nr);
      const q = bd[t];
      if (!q) out.push({ from: sq, to: t });
      else {
        if (q.c !== p.c) out.push({ from: sq, to: t });
        break;
      }
      nf += df;
      nr += dr;
    }
  }
  return out;
}

/** Применить ход к доске без смены очереди (для проверки шаха). */
function execMove(st: ChessState, m: Move): void {
  const bd = st.board;
  const p = bd[m.from]!;
  if (m.castle) {
    const home = p.c === 'w' ? 7 : 0;
    bd[m.to] = p;
    bd[m.from] = null;
    if (m.castle === 'K') {
      bd[idx(5, home)] = bd[idx(7, home)];
      bd[idx(7, home)] = null;
    } else {
      bd[idx(3, home)] = bd[idx(0, home)];
      bd[idx(0, home)] = null;
    }
    if (p.c === 'w') { st.castling.wk = false; st.castling.wq = false; }
    else { st.castling.bk = false; st.castling.bq = false; }
    st.ep = null;
    st.half++;
    return;
  }
  // права рокировок при ходе/снятии ладьи с дому
  const homeOf = (c: Color): number => (c === 'w' ? 7 : 0);
  if (p.k === 'k') {
    if (p.c === 'w') { st.castling.wk = false; st.castling.wq = false; }
    else { st.castling.bk = false; st.castling.bq = false; }
  }
  if (p.k === 'r') {
    const h = homeOf(p.c);
    if (m.from === idx(0, h)) { if (p.c === 'w') st.castling.wq = false; else st.castling.bq = false; }
    if (m.from === idx(7, h)) { if (p.c === 'w') st.castling.wk = false; else st.castling.bk = false; }
  }
  const victim = bd[m.to];
  if (victim?.k === 'r') {
    const h = homeOf(victim.c);
    if (m.to === idx(0, h)) { if (victim.c === 'w') st.castling.wq = false; else st.castling.bq = false; }
    if (m.to === idx(7, h)) { if (victim.c === 'w') st.castling.wk = false; else st.castling.bk = false; }
  }
  if (m.ep) {
    const cap = m.to + (p.c === 'w' ? 8 : -8);
    bd[cap] = null;
  }
  const isPawnDouble = p.k === 'p' && Math.abs(rank(m.to) - rank(m.from)) === 2;
  st.ep = isPawnDouble ? (m.from + m.to) / 2 : null;
  bd[m.to] = m.promote ? { c: p.c, k: m.promote } : p;
  bd[m.from] = null;
  st.half = (p.k === 'p' || victim || m.ep) ? 0 : st.half + 1;
}

function cloneBoard(bd: (Piece | null)[]): (Piece | null)[] {
  return bd.map(p => (p ? { ...p } : null));
}

/** Все псевдоходы цвета (для мата/пата/повторов). */
function pseudoAll(st: ChessState, c: Color): Move[] {
  const out: Move[] = [];
  for (let i = 0; i < 64; i++) {
    if (st.board[i]?.c === c) out.push(...pseudoFrom(st, i));
  }
  return out;
}

/** Легален ли ход (свой король не под шахом после). */
function moveIsLegal(st: ChessState, m: Move, color: Color): boolean {
  const saved = cloneBoard(st.board);
  const savedCastling = { ...st.castling };
  const savedEp = st.ep;
  const savedHalf = st.half;
  execMove(st, m);
  const ksq = findKing(st.board, color);
  const ok = ksq >= 0 && !attacked(st.board, ksq, opp(color));
  st.board = saved;
  st.castling = savedCastling;
  st.ep = savedEp;
  st.half = savedHalf;
  return ok;
}

function legalAll(st: ChessState, c: Color): Move[] {
  return pseudoAll(st, c).filter(m => moveIsLegal(st, m, c));
}

export function sideOf(st: ChessState, pid: string): Color | null {
  if (pid === st.white) return 'w';
  if (pid === st.black) return 'b';
  return null;
}

/** Все легальные ходы игрока (пусто — не его очередь или не его бой). */
export function legalMoves(st: ChessState, pid: string): Move[] {
  const c = sideOf(st, pid);
  if (!c || st.phase !== 'play' || st.turn !== c) return [];
  return legalAll(st, c);
}

/** Легальные ходы с поля (для подсветки в клиенте). */
export function legalFrom(st: ChessState, pid: string, sq: number): Move[] {
  const c = sideOf(st, pid);
  if (!c || st.phase !== 'play' || st.turn !== c) return [];
  if (st.board[sq]?.c !== c) return [];
  return pseudoFrom(st, sq).filter(m => moveIsLegal(st, m, c));
}

function insufficientMaterial(bd: (Piece | null)[]): boolean {
  const rest = bd.filter(p => p && p.k !== 'k');
  if (rest.length === 0) return true;
  if (rest.some(p => p!.k === 'p' || p!.k === 'r' || p!.k === 'q')) return false;
  // только слоны/кони
  if (rest.length === 1) return true; // один минор против короля
  if (rest.every(p => p!.k === 'b')) {
    // все слоны на одном цвете полей
    const colors = new Set<number>();
    for (let i = 0; i < 64; i++) {
      if (bd[i]?.k === 'b') colors.add((file(i) + rank(i)) % 2);
    }
    if (colors.size === 1) return true;
  }
  return false;
}

const SQ_NAME = (i: number): string => `${'abcdefgh'[file(i)]}${8 - rank(i)}`;
const uci = (m: Move): string => `${SQ_NAME(m.from)}${SQ_NAME(m.to)}${m.promote ?? ''}`;

/** Пересчёт терминалов после хода: мат/пат/материал/50/троекрат. */
function settle(st: ChessState): void {
  const toMove = legalAll(st, st.turn);
  if (toMove.length === 0) {
    st.phase = 'over';
    if (st.check) {
      st.winner = st.turn === 'w' ? st.black : st.white;
      st.reason = 'mate';
    } else {
      st.winner = null;
      st.reason = 'stalemate';
    }
    return;
  }
  if (insufficientMaterial(st.board)) {
    st.phase = 'over'; st.winner = null; st.reason = 'material'; return;
  }
  if (st.half >= 100) {
    st.phase = 'over'; st.winner = null; st.reason = 'fifty'; return;
  }
  const key = posKey(st);
  st.posCounts[key] = (st.posCounts[key] ?? 0) + 1;
  if (st.posCounts[key] >= 3) {
    st.phase = 'over'; st.winner = null; st.reason = 'repeat';
  }
}

export function createChess(white: string, black: string): ChessState {
  const st: ChessState = {
    board: initialBoard(), turn: 'w',
    castling: { wk: true, wq: true, bk: true, bq: true },
    ep: null, half: 0, full: 1,
    white, black, phase: 'play', winner: null, reason: null,
    last: null, check: false, drawOffer: null, posCounts: {}, history: [],
  };
  st.posCounts[posKey(st)] = 1;
  return st;
}

/** Позиция из строк для тестов: 'KQRBNP' белые, 'kqrbnp' чёрные, '.' пусто. */
export function fromRows(rows: string[], turn: Color, ids: { w: string; b: string }): ChessState {
  const glyph: Record<string, Kind> = {
    P: 'p', N: 'n', B: 'b', R: 'r', Q: 'q', K: 'k',
    p: 'p', n: 'n', b: 'b', r: 'r', q: 'q', k: 'k',
  };
  const board: (Piece | null)[] = new Array(64).fill(null);
  rows.forEach((row, r) => {
    [...row].forEach((ch, f) => {
      if (ch === '.' || !glyph[ch]) return;
      board[idx(f, r)] = { c: ch === ch.toUpperCase() ? 'w' : 'b', k: glyph[ch] };
    });
  });
  const st: ChessState = {
    board, turn,
    castling: { wk: false, wq: false, bk: false, bq: false },
    ep: null, half: 0, full: 1,
    white: ids.w, black: ids.b, phase: 'play', winner: null, reason: null,
    last: null, check: false, drawOffer: null, posCounts: {}, history: [],
  };
  const ksq = findKing(board, turn);
  st.check = ksq >= 0 && attacked(board, ksq, opp(turn));
  if (insufficientMaterial(board)) {
    st.phase = 'over'; st.reason = 'material';
  } else if (legalAll(st, turn).length === 0) {
    st.phase = 'over';
    if (st.check) { st.winner = turn === 'w' ? st.black : st.white; st.reason = 'mate'; }
    else st.reason = 'stalemate';
  }
  st.posCounts[posKey(st)] = 1;
  return st;
}

export function applyMove(st: ChessState, pid: string, mv: MoveInput): { ok: boolean; err?: string } {
  if (st.phase !== 'play') return { ok: false, err: 'бой окончен' };
  const c = sideOf(st, pid);
  if (!c) return { ok: false, err: 'ты не в этом бою' };

  if ('kind' in mv && mv.kind === 'resign') {
    st.phase = 'over';
    st.winner = c === 'w' ? st.black : st.white;
    st.reason = 'resign';
    st.history.push(`${c === 'w' ? '1-0' : '0-1'} resign`);
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
  if (!('from' in mv)) return { ok: false, err: 'кривой ход' };
  const { from, to } = mv;
  if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || from > 63 || to < 0 || to > 63) {
    return { ok: false, err: 'кривые клетки' };
  }
  if (st.board[from]?.c !== c) return { ok: false, err: 'это не твоя фигура' };
  const cand = pseudoFrom(st, from).filter(m => m.to === to);
  if (cand.length === 0) return { ok: false, err: 'так ходить нельзя' };
  // превращение: выбор фигуры или ферзь по умолчанию
  let m = cand.find(x => (x.promote ?? 'q') === (mv.promote ?? 'q')) ?? cand[0];
  if (cand[0].promote && mv.promote && !['q', 'r', 'b', 'n'].includes(mv.promote)) {
    return { ok: false, err: 'в кого превращаем?' };
  }
  if (cand[0].promote && mv.promote) m = cand.find(x => x.promote === mv.promote) ?? cand[0];
  if (!moveIsLegal(st, m, c)) return { ok: false, err: 'король останется под шахом' };
  execMove(st, m);
  st.history.push(uci(m));
  st.last = { from, to };
  st.drawOffer = null;
  if (st.turn === 'b') st.full++;
  st.turn = opp(st.turn);
  const ksq = findKing(st.board, st.turn);
  st.check = ksq >= 0 && attacked(st.board, ksq, opp(st.turn));
  settle(st);
  return { ok: true };
}

/** Уход игрока: рука не нужна — победа оставшемуся. */
export function removePlayer(st: ChessState, pid: string): string[] {
  if (st.phase === 'over') return st.winner ? [st.winner] : [];
  const other = pid === st.white ? st.black : pid === st.black ? st.white : null;
  st.phase = 'over';
  st.winner = other;
  st.reason = 'leave';
  return other ? [other] : [];
}

/** Кого жмёт таймер: сторона на ходу проигрывает по флагу. */
export function timeoutMove(st: ChessState): { by: string; kind: 'flag' } {
  return { by: st.turn === 'w' ? st.white : st.black, kind: 'flag' };
}
