/* Дурак подкидной — чистый движок: колода, раздача, покрытие, bout'ы, добор.
   Никакого IO: сервер дёргает applyMove/timeoutMove, клиент рисует DState.
   Правило арены: первый скинувший все карты — чемпион, бой кончается сразу. */

export type Suit = 'S' | 'H' | 'D' | 'C';
export type Card = { r: number; s: Suit }; // r: 6..14 (11=J 12=Q 13=K 14=A)

export const cardId = (c: Card): string => `${c.r}${c.s}`;

const SUITS: Suit[] = ['S', 'H', 'D', 'C'];

export function buildDeck(): Card[] {
  const d: Card[] = [];
  for (const s of SUITS) for (let r = 6; r <= 14; r++) d.push({ r, s });
  return d;
}

export function shuffled<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Бьёт ли d карту a при козыре trump. */
export function beats(a: Card, d: Card, trump: Suit): boolean {
  if (d.s === a.s) return d.r > a.r;
  return d.s === trump && a.s !== trump;
}

export type Pair = { a: Card; d: Card | null };

export type DState = {
  players: string[];
  hands: Record<string, Card[]>;
  deck: Card[];
  trump: Suit;
  attacker: string;
  defender: string;
  table: Pair[];
  boutCap: number;
  out: string[];
  phase: 'play' | 'over';
  winner: string | null;
};

export type DMove =
  | { kind: 'attack'; card: Card }
  | { kind: 'defend'; card: Card; target: Card }
  | { kind: 'take' }
  | { kind: 'done' };

const eq = (x: Card, y: Card): boolean => x.r === y.r && x.s === y.s;
const has = (hand: Card[], c: Card): boolean => hand.some(k => eq(k, c));
const take = (hand: Card[], c: Card): void => {
  const i = hand.findIndex(k => eq(k, c));
  if (i >= 0) hand.splice(i, 1);
};

const alive = (st: DState): string[] => st.players.filter(p => !st.out.includes(p));

function nextAfter(st: DState, pid: string): string {
  const a = alive(st);
  return a[(a.indexOf(pid) + 1) % a.length];
}

export function createDurak(players: string[], rng: () => number): DState {
  const deck = shuffled(buildDeck(), rng);
  const hands: Record<string, Card[]> = {};
  for (const p of players) hands[p] = deck.splice(0, 6);
  const trump = deck[deck.length - 1].s;
  // первый атакует держатель низшего козыря
  let first = players[0];
  let best = 99;
  for (const p of players) {
    const low = Math.min(...hands[p].filter(c => c.s === trump).map(c => c.r), 99);
    if (low < best) { best = low; first = p; }
  }
  const order = players;
  const defender = order[(order.indexOf(first) + 1) % order.length];
  return {
    players: [...players], hands, deck, trump,
    attacker: first, defender, table: [], boutCap: 0,
    out: [], phase: 'play', winner: null,
  };
}

const tableRanks = (st: DState): Set<number> =>
  new Set(st.table.flatMap(t => [t.a.r, ...(t.d ? [t.d.r] : [])]));

/** Чем может атаковать/подкинуть pid. */
export function legalAttacks(st: DState, pid: string): Card[] {
  if (st.phase !== 'play' || pid === st.defender) return [];
  const hand = st.hands[pid] ?? [];
  if (st.table.length === 0) return pid === st.attacker ? [...hand] : [];
  if (st.table.length >= st.boutCap) return [];
  const ranks = tableRanks(st);
  return hand.filter(c => ranks.has(c.r));
}

/** Чем pid может покрыть конкретную атаку target. */
export function legalDefends(st: DState, pid: string, target: Card): Card[] {
  if (st.phase !== 'play' || pid !== st.defender) return [];
  const open = st.table.some(t => t.d === null && eq(t.a, target));
  if (!open) return [];
  return (st.hands[pid] ?? []).filter(c => beats(target, c, st.trump));
}

/** Добор по порядку от атакующего, защитник — последний. Затем проверка выхода. */
function drawAndRotate(st: DState, nextAttacker: string): void {
  const order = alive(st);
  const start = Math.max(0, order.indexOf(nextAttacker));
  const seq = [...order.slice(start), ...order.slice(0, start)];
  // защитник добирает последним
  seq.sort((x, y) => (x === st.defender ? 1 : 0) - (y === st.defender ? 1 : 0));
  for (const p of seq) {
    while (st.hands[p].length < 6 && st.deck.length > 0) {
      st.hands[p].push(st.deck.shift()!);
    }
  }
  st.table = [];
  st.boutCap = 0;
  st.attacker = nextAttacker;
  st.defender = nextAfter(st, nextAttacker);
  if (st.deck.length === 0) {
    for (const p of seq) {
      if (st.hands[p].length === 0 && !st.out.includes(p)) st.out.push(p);
    }
    if (st.out.length > 0) {
      st.phase = 'over';
      st.winner = st.out[0];
    }
  }
}

export function applyMove(st: DState, pid: string, mv: DMove): { ok: boolean; err?: string } {
  if (st.phase !== 'play') return { ok: false, err: 'бой окончен' };

  if (mv.kind === 'attack') {
    if (!legalAttacks(st, pid).some(c => eq(c, mv.card))) return { ok: false, err: 'так атаковать нельзя' };
    if (st.table.length === 0) st.boutCap = Math.min(6, st.hands[st.defender].length);
    take(st.hands[pid], mv.card);
    st.table.push({ a: { ...mv.card }, d: null });
    return { ok: true };
  }

  if (mv.kind === 'defend') {
    if (!legalDefends(st, pid, mv.target).some(c => eq(c, mv.card))) {
      return { ok: false, err: 'так покрыть нельзя' };
    }
    take(st.hands[pid], mv.card);
    st.table.find(t => t.d === null && eq(t.a, mv.target))!.d = { ...mv.card };
    return { ok: true };
  }

  if (mv.kind === 'take') {
    if (pid !== st.defender || st.table.length === 0) return { ok: false, err: 'брать нечего' };
    const d = st.defender;
    for (const t of st.table) {
      st.hands[d].push(t.a);
      if (t.d) st.hands[d].push(t.d);
    }
    drawAndRotate(st, nextAfter(st, d));
    return { ok: true };
  }

  // done — только атакующий и только всё покрытое
  if (pid !== st.attacker) return { ok: false, err: 'отбой даёт атакующий' };
  if (st.table.length === 0 || st.table.some(t => t.d === null)) {
    return { ok: false, err: 'есть непокрытое' };
  }
  const d = st.defender;
  drawAndRotate(st, d);
  return { ok: true };
}

/** Уход игрока посреди боя: рука сгорает, атаки на столе доигрывают живые.
    Возвращает оставшихся. */
export function removePlayer(st: DState, pid: string): string[] {
  const i = st.players.indexOf(pid);
  if (i < 0) return alive(st);
  st.players.splice(i, 1);
  delete st.hands[pid];
  if (st.players.length === 0) return [];
  if (st.attacker === pid) st.attacker = st.players[i % st.players.length];
  if (st.defender === pid) st.defender = st.players[i % st.players.length];
  if (st.attacker === st.defender && st.players.length > 1) {
    st.defender = nextAfter(st, st.attacker);
  }
  return alive(st);
}

/** Кого жмёт таймер: непокрытое — защитник берёт, всё покрыто — атакующий кончает. */
export function timeoutMove(st: DState): { kind: 'take' | 'done'; by: string } {
  const open = st.table.some(t => t.d === null);
  return open ? { kind: 'take', by: st.defender } : { kind: 'done', by: st.attacker };
}
