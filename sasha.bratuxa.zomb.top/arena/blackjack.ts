/* БЛЭКДЖЕК АРЕНЫ — движок боя. Чистые функции, ГСЧ снаружи.
   Колода и правила — общие с казино (src/casino/bj/data.ts): туз 11→1,
   дилер тянет до 17, натуральный (21 с двух карт) бьёт обычное 21.
   Формат: 2 игрока — дуэль сильнейших рук, 3+ — на выбывание (перебор = вылет).
   Победа — в летопись, фишки не трогаем. */
import { dealerPlay, drawCard, handValue, type Card } from '../src/casino/bj/data';

export type BjCard = Card;
export type BjStatus = 'play' | 'stand' | 'bust';
export type BjMove = { kind: 'hit' | 'stand' };

export type BState = {
  phase: 'play' | 'over';
  order: string[];
  turn: string | null;
  hands: Record<string, BjCard[]>;
  status: Record<string, BjStatus>;
  natural: Record<string, boolean>;
  dealer: BjCard[];
  winner: string | null;
  draw: boolean;
  reason: string | null;
};

const isNatural = (h: BjCard[]): boolean => h.length === 2 && handValue(h) === 21;

export function createBj(players: string[], rng: () => number = Math.random): BState {
  const st: BState = {
    phase: 'play', order: [...players], turn: null,
    hands: {}, status: {}, natural: {}, dealer: [],
    winner: null, draw: false, reason: null,
  };
  for (const p of players) { st.hands[p] = []; st.status[p] = 'play'; }
  for (let i = 0; i < 2; i++) {
    for (const p of players) st.hands[p].push(drawCard(rng));
    st.dealer.push(drawCard(rng));
  }
  for (const p of players) {
    st.natural[p] = isNatural(st.hands[p]);
    if (st.natural[p]) st.status[p] = 'stand';
  }
  advance(st, rng);
  return st;
}

/** Следующий ходящий или финал, если отходили все. */
function advance(st: BState, rng: () => number): void {
  const next = st.order.find(p => st.status[p] === 'play') ?? null;
  st.turn = next;
  if (!next) finishBj(st, rng);
}

/** Ранг исхода против дилера: bust 0, lose 1, push 2, win 3, natural 4. */
function rank(st: BState, pid: string, dv: number, dealerNat: boolean): number {
  if (st.status[pid] === 'bust') return 0;
  const pv = handValue(st.hands[pid]);
  if (st.natural[pid]) return dealerNat ? 2 : 4;
  if (dealerNat) return 1;
  if (dv > 21) return 3;
  if (pv > dv) return 3;
  if (pv === dv) return 2;
  return 1;
}

function finishBj(st: BState, rng: () => number): void {
  st.dealer = dealerPlay(st.dealer, rng);
  const dv = handValue(st.dealer);
  const dealerNat = isNatural(st.dealer);
  let best = -1;
  let tops: string[] = [];
  for (const p of st.order) {
    const r = rank(st, p, dv, dealerNat);
    if (r > best) { best = r; tops = [p]; }
    else if (r === best) tops.push(p);
  }
  st.phase = 'over';
  st.turn = null;
  if (best <= 0 || tops.length !== 1) {
    st.winner = null;
    st.draw = true;
    st.reason = best <= 0 ? 'allbust' : 'tie';
    return;
  }
  st.winner = tops[0];
  st.draw = false;
  st.reason = null;
}

export function applyMove(
  st: BState, pid: string, mv: BjMove, rng: () => number = Math.random,
): { ok: boolean; err?: string } {
  if (st.phase !== 'play') return { ok: false, err: 'бой окончен' };
  if (st.turn !== pid || st.status[pid] !== 'play') return { ok: false, err: 'не твой ход' };
  if (mv.kind === 'stand') {
    st.status[pid] = 'stand';
    advance(st, rng);
    return { ok: true };
  }
  if (mv.kind !== 'hit') return { ok: false, err: 'бей или стой' };
  st.hands[pid].push(drawCard(rng));
  const v = handValue(st.hands[pid]);
  if (v > 21) st.status[pid] = 'bust';
  else if (v === 21) st.status[pid] = 'stand';
  advance(st, rng);
  return { ok: true };
}

/** Флаг: молчал на ходу — авто-стенд. */
export function timeoutMove(st: BState, rng: () => number = Math.random): { kind: 'stand'; by: string | null } {
  const by = st.turn;
  if (st.phase !== 'play' || !by || st.status[by] !== 'play') return { kind: 'stand', by: null };
  st.status[by] = 'stand';
  advance(st, rng);
  return { kind: 'stand', by };
}

/** Уход из боя = вылет. Возвращает оставшихся в строю. */
export function removePlayer(st: BState, pid: string, rng: () => number = Math.random): string[] {
  if (st.phase === 'play' && st.status[pid] === 'play') {
    st.status[pid] = 'bust';
    if (st.turn === pid) advance(st, rng);
  } else if (st.phase === 'play' && st.status[pid] === 'stand') {
    st.status[pid] = 'bust';
    if (st.order.filter(p => st.status[p] !== 'bust').length <= 1) finishBj(st, rng);
  }
  return st.order.filter(p => st.status[p] !== 'bust');
}

/** Публичный срез: руки открыты, у дилера дырка прячется до финала. */
export function bjPublic(st: BState): Record<string, unknown> {
  const open = st.phase === 'over';
  return {
    hands: st.hands, status: st.status, natural: st.natural,
    dealer: open ? st.dealer : st.dealer.slice(0, 1),
    dealerN: st.dealer.length, holeHidden: !open,
    turn: st.turn, phase: st.phase,
    winner: st.winner, draw: st.draw, reason: st.reason,
  };
}
