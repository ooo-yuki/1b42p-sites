/* Монополия 42 — TDD-красное: движок arena/monopoly.ts ещё не написан.
   40 клеток, старт 1500, зарплата 200, дубль — ещё бросок, три дубля — тюрьма.
   Рента по домам, вокзалы, предприятия, шанс/казна, банкротство — вылет. */
import { describe, expect, test } from 'bun:test';
import { applyMove, createMonopoly, legalActions, removePlayer, timeoutMove } from './monopoly';

const A = 'pA1';
const B = 'pB1';
const C = 'pC1';
const rng = () => 0.0; // кубики подскажем явно через d1/d2

describe('monopoly init', () => {
  test('старт: деньги, позиции, очередь', () => {
    const st = createMonopoly([A, B], rng);
    expect(st.phase).toBe('play');
    expect(st.players.every(p => p.money === 1500 && p.pos === 0)).toBe(true);
    expect(st.turn).toBe(A);
  });
  test('бросок двигает фишку', () => {
    const st = createMonopoly([A, B], rng);
    expect(applyMove(st, A, { kind: 'roll', d1: 3, d2: 4 }).ok).toBe(true);
    expect(st.players[0].pos).toBe(7);
  });
  test('круг через старт — зарплата', () => {
    const st = createMonopoly([A, B], rng);
    st.players[0].pos = 39;
    expect(applyMove(st, A, { kind: 'roll', d1: 1, d2: 1 }).ok).toBe(true);
    // 39+2=41 → клетка 1, +200 зарплаты
    expect(st.players[0].pos).toBe(1);
    expect(st.players[0].money).toBe(1700);
  });
  test('чужой ход запрещён', () => {
    const st = createMonopoly([A, B], rng);
    expect(applyMove(st, B, { kind: 'roll', d1: 1, d2: 1 }).ok).toBe(false);
  });
});

describe('monopoly property', () => {
  test('покупка свободной улицы', () => {
    const st = createMonopoly([A, B], rng);
    applyMove(st, A, { kind: 'roll', d1: 1, d2: 2 }); // 0+3=3 — Сарай Смолграда
    expect(st.players[0].pos).toBe(3);
    const r = applyMove(st, A, { kind: 'buy' });
    expect(r.ok).toBe(true);
    expect(st.players[0].money).toBeLessThan(1500);
  });
  test('рента хозяину', () => {
    const st = createMonopoly([A, B], rng);
    applyMove(st, A, { kind: 'roll', d1: 1, d2: 2 }); // A на 3
    applyMove(st, A, { kind: 'buy' });
    const before = st.players[0].money;
    // B идёт на клетку 3: с 0 надо 3 — d1:1,d2:2
    applyMove(st, B, { kind: 'roll', d1: 1, d2: 2 });
    expect(st.players[0].money).toBeGreaterThan(before);
    expect(st.players[1].money).toBeLessThan(1500);
  });
  test('без денег купить нельзя', () => {
    const st = createMonopoly([A, B], rng);
    st.players[0].money = 10;
    st.players[0].pos = 37;
    applyMove(st, A, { kind: 'roll', d1: 1, d2: 1 }); // клетка 39 — Саша за 400
    expect(applyMove(st, A, { kind: 'buy' }).ok).toBe(false);
  });
  test('дом строится только на своей группе', () => {
    const st = createMonopoly([A, B], rng);
    expect(applyMove(st, A, { kind: 'build', cell: 1, n: 1 }).ok).toBe(false);
  });
});

describe('monopoly jail', () => {
  test('три дубля — тюрьма', () => {
    const st = createMonopoly([A, B, C], rng);
    applyMove(st, A, { kind: 'roll', d1: 1, d2: 2 }); // 3 — свободная улица, ждёт решения
    expect(st.turn).toBe(A);
    applyMove(st, A, { kind: 'buy' }); // купил — ход дальше
    expect(st.turn).toBe(B);
    st.turn = A; // возвращаем ход для серии дублей (тестовый стенд)
    (st as unknown as { doubles: number }).doubles = 0;
    applyMove(st, A, { kind: 'roll', d1: 2, d2: 2 }); // дубль 1 → 7 (шанс +100)
    expect(st.turn).toBe(A); // дубль — ещё бросок
    applyMove(st, A, { kind: 'roll', d1: 3, d2: 3 }); // дубль 2 → 13, свободная — отказ
    applyMove(st, A, { kind: 'pass' });
    expect(st.turn).toBe(A); // был дубль — кидает снова
    applyMove(st, A, { kind: 'roll', d1: 4, d2: 4 }); // дубль 3 — тюрьма
    const me = st.players[0];
    expect(me.pos).toBe(10);
    expect(me.inJail).toBe(true);
  });
  test('выход под залог', () => {
    const st = createMonopoly([A, B], rng);
    st.players[0].pos = 10;
    st.players[0].inJail = true;
    const before = st.players[0].money;
    expect(applyMove(st, A, { kind: 'payJail' }).ok).toBe(true);
    expect(st.players[0].inJail).toBe(false);
    expect(st.players[0].money).toBe(before - 50);
  });
});

describe('monopoly end', () => {
  test('банкрот вылетает, последний забирает', () => {
    const st = createMonopoly([A, B], rng);
    st.players[1].money = 10;
    // B должен 200 налога: ставим на 36 и катим 2
    st.players[0].pos = 0;
    st.turn = B;
    st.players[1].pos = 36;
    applyMove(st, B, { kind: 'roll', d1: 1, d2: 1 }); // клетка 38 — суперналог 100
    expect(st.players[1].bankrupt).toBe(true);
    expect(st.phase).toBe('over');
    expect(st.winner).toBe(A);
  });
  test('сдаться — вылет, бой продолжается', () => {
    const st = createMonopoly([A, B, C], rng);
    expect(applyMove(st, A, { kind: 'resign' } as never).ok).toBe(true);
    expect(st.players[0].bankrupt).toBe(true);
    expect(st.phase).toBe('play');
  });
  test('уход — вылет игрока', () => {
    const st = createMonopoly([A, B], rng);
    expect(removePlayer(st, A)).toEqual([B]);
  });
  test('таймаут жмёт сторону на ходу', () => {
    const st = createMonopoly([A, B], rng);
    expect(timeoutMove(st).by).toBe(A);
  });
  test('легальные действия: бросок в начале хода', () => {
    const st = createMonopoly([A, B], rng);
    expect(legalActions(st, A)).toContain('roll');
    expect(legalActions(st, B)).toEqual([]);
  });
});
