/* Дурак подкидной — чистый движок без IO. Сервер дергает applyMove,
   клиент рисует состояние. bun test arena/durak.test.ts */
import { describe, expect, test } from 'bun:test';
import {
  applyMove, beats, buildDeck, cardId, createDurak, legalAttacks, legalDefends,
  removePlayer, timeoutMove, type Card,
} from './durak';

const C = (r: number, s: 'S' | 'H' | 'D' | 'C'): Card => ({ r, s });
let seed = 42;
const rng = (): number => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
};
const fresh = (n = 2) => createDurak(Array.from({ length: n }, (_, i) => `p${i}`), rng);

describe('deck', () => {
  test('36 уникальных карт 6..A', () => {
    const d = buildDeck();
    expect(d).toHaveLength(36);
    expect(new Set(d.map(cardId)).size).toBe(36);
    expect(d[0]).toEqual({ r: 6, s: 'S' });
  });
});

describe('beats', () => {
  test('старшая той же масти бьёт', () => {
    expect(beats(C(6, 'S'), C(7, 'S'), 'H')).toBe(true);
    expect(beats(C(7, 'S'), C(6, 'S'), 'H')).toBe(false);
  });
  test('козырь бьёт некозырь, некозырь козырь — нет', () => {
    expect(beats(C(14, 'S'), C(6, 'H'), 'H')).toBe(true);
    expect(beats(C(6, 'H'), C(14, 'S'), 'H')).toBe(false);
  });
  test('старший козырь бьёт младший', () => {
    expect(beats(C(6, 'H'), C(14, 'H'), 'H')).toBe(true);
  });
  test('чужая масть не бьёт', () => {
    expect(beats(C(6, 'S'), C(14, 'D'), 'H')).toBe(false);
  });
});

describe('createDurak', () => {
  test('раздача по 6, козырь из колоды, первый атакующий — низший козырь', () => {
    const st = fresh();
    expect(st.hands.p0).toHaveLength(6);
    expect(st.hands.p1).toHaveLength(6);
    expect(st.deck).toHaveLength(24);
    expect(['S', 'H', 'D', 'C']).toContain(st.trump);
    // низший козырь на руках атакует первым
    const low = (pid: string): number => Math.min(...st.hands[pid].filter(c => c.s === st.trump).map(c => c.r), 99);
    const first = low('p0') <= low('p1') ? 'p0' : 'p1';
    expect(st.attacker).toBe(first);
    expect(st.defender).not.toBe(first);
  });
  test('пятерым тоже раздаёт, колода тает', () => {
    const st = fresh(5);
    expect(st.deck).toHaveLength(36 - 30);
  });
});

describe('attack/defend', () => {
  test('атака чужой картой и не в свой ход — мимо', () => {
    const st = fresh();
    const r1 = applyMove(st, st.defender, { kind: 'attack', card: st.hands[st.attacker][0] });
    expect(r1.ok).toBe(false);
    const stranger = applyMove(st, st.attacker, { kind: 'attack', card: { ...st.deck[0] } });
    expect(stranger.ok).toBe(false);
  });

  test('полный круг: атака → покрытие → отбой → добор', () => {
    const st = fresh();
    const a = st.attacker, d = st.defender;
    const atk = st.hands[a][0];
    expect(applyMove(st, a, { kind: 'attack', card: atk }).ok).toBe(true);
    expect(st.table).toHaveLength(1);
    const cover = legalDefends(st, d, atk);
    expect(cover.length).toBeGreaterThan(0);
    expect(applyMove(st, d, { kind: 'defend', card: cover[0], target: atk }).ok).toBe(true);
    expect(applyMove(st, a, { kind: 'done' }).ok).toBe(true);
    // бита: стол пуст, руки снова по 6, роли перешли
    expect(st.table).toHaveLength(0);
    expect(st.hands[a].length + st.hands[d].length).toBe(12);
    expect(st.attacker).toBe(d);
  });

  test('подкид чужим рангом — мимо, своим — в стол', () => {
    const st = fresh(3);
    const a = st.attacker;
    const atk = st.hands[a][0];
    applyMove(st, a, { kind: 'attack', card: atk });
    const others = st.players.filter(p => p !== a && p !== st.defender);
    const bad = st.hands[others[0]].find(c => c.r !== atk.r);
    if (bad) expect(applyMove(st, others[0], { kind: 'attack', card: bad }).ok).toBe(false);
    const good = st.hands[others[0]].find(c => c.r === atk.r);
    if (good) expect(applyMove(st, others[0], { kind: 'attack', card: good }).ok).toBe(true);
  });

  test('взять: стол в руку, атака переходит дальше', () => {
    const st = fresh();
    const a = st.attacker, d = st.defender;
    const n0 = st.hands[d].length;
    applyMove(st, a, { kind: 'attack', card: st.hands[a][0] });
    expect(applyMove(st, d, { kind: 'take' }).ok).toBe(true);
    expect(st.hands[d].length).toBeGreaterThan(n0);
    expect(st.table).toHaveLength(0);
    expect(st.attacker).not.toBe(d);
  });

  test('непокрытое нельзя отбить отбоем', () => {
    const st = fresh();
    applyMove(st, st.attacker, { kind: 'attack', card: st.hands[st.attacker][0] });
    expect(applyMove(st, st.attacker, { kind: 'done' }).ok).toBe(false);
  });

  test('больше шести карт в bout не влезет', () => {
    const st = fresh();
    st.table = Array.from({ length: 6 }, () => ({ a: C(6, 'S'), d: C(7, 'S') }));
    const r = applyMove(st, st.attacker, { kind: 'attack', card: st.hands[st.attacker][0] });
    expect(r.ok).toBe(false);
  });
});

describe('timeoutMove', () => {
  test('есть непокрытое — взять, всё покрыто — отбой', () => {
    const st = fresh();
    const a = st.attacker, d = st.defender;
    st.trump = 'H';
    st.hands[a] = [C(6, 'S'), C(6, 'D')];
    st.hands[d] = [C(7, 'S'), C(8, 'D')];
    applyMove(st, a, { kind: 'attack', card: C(6, 'S') });
    expect(timeoutMove(st)).toEqual({ kind: 'take', by: d });
    applyMove(st, d, { kind: 'defend', card: C(7, 'S'), target: C(6, 'S') });
    expect(timeoutMove(st)).toEqual({ kind: 'done', by: a });
  });
});

describe('legalAttacks', () => {
  test('первая атака — любая карта, дальше — ранги стола', () => {
    const st = fresh();
    expect(legalAttacks(st, st.attacker)).toHaveLength(6);
    const atk = st.hands[st.attacker][0];
    applyMove(st, st.attacker, { kind: 'attack', card: atk });
    for (const c of legalAttacks(st, st.attacker)) expect(c.r).toBe(atk.r);
  });
});

describe('removePlayer', () => {
  test('ушедший выбывает, атакующий переназначается, стол живёт', () => {
    const st = fresh(3);
    const a = st.attacker;
    applyMove(st, a, { kind: 'attack', card: st.hands[a][0] });
    const rest = removePlayer(st, a);
    expect(rest).toHaveLength(2);
    expect(rest).not.toContain(a);
    expect(st.attacker).not.toBe(a);
    expect(st.attacker).not.toBe(st.defender);
    expect(st.table).toHaveLength(1);
  });

  test('уход защитника — новый защитник доигрывает стол', () => {
    const st = fresh(3);
    const a = st.attacker, d = st.defender;
    st.trump = 'H';
    st.hands[a] = [C(6, 'S')];
    st.hands[d] = [C(7, 'S')];
    applyMove(st, a, { kind: 'attack', card: C(6, 'S') });
    removePlayer(st, d);
    const nd = st.defender;
    expect(nd).not.toBe(d);
    expect(nd).not.toBe(st.attacker);
    st.hands[nd].push(C(9, 'S'));
    expect(legalDefends(st, nd, C(6, 'S'))).not.toHaveLength(0);
  });
});
