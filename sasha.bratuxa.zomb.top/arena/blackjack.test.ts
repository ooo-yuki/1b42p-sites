/* Блэкджек арены — TDD-красное: движок arena/blackjack.ts ещё не написан.
   Правила и колода — общие с казино (src/casino/bj/data.ts): туз 11→1,
   дилер тянет до 17, натуральный бьёт обычное 21.
   Формат: 2 игрока — дуэль (сильнейшая рука), 3+ — на выбывание (перебор = вылет). */
import { describe, expect, test } from 'bun:test';
import { applyMove, createBj, removePlayer, timeoutMove } from './blackjack';

const P1 = 'p1';
const P2 = 'p2';
const P3 = 'p3';

/** Скриптованный ГСЧ: значения разбираются по порядку вызовов. */
const seq = (xs: number[]): (() => number) => {
  let i = 0;
  return () => xs[i++ % xs.length];
};
// карта из x: r = 1+floor(x*13), масть = SUITS[floor(x*4)]
const A = 0; // туз
const K = 0.99; // король (13)
const N9 = 0.65; // 9 (1+floor(8.45)=9)
const N7 = 0.5; // 7
const N6 = 0.42; // 6 (1+floor(5.46)=6)
const N10 = 0.75; // 10 (1+floor(9.75)=10)

describe('blackjack init', () => {
  test('сдача: всем по 2 карты, дилеру 2, ход первого', () => {
    const st = createBj([P1, P2], seq([A, K, N9, N7]));
    expect(Object.keys(st.hands)).toEqual([P1, P2]);
    expect(st.hands[P1].length).toBe(2);
    expect(st.hands[P2].length).toBe(2);
    expect(st.dealer.length).toBe(2);
    expect(st.turn).toBe(P1);
    expect(st.phase).toBe('play');
  });
  test('натуральный с раздачи сразу в стенде', () => {
    // сдача ест вызовы: P1 P2 D P1 P2 D, по 2 вызова на карту (ранг+масть).
    // P1: A+K (натуральный), P2: 9+6=15, D: 7+9=16
    const st = createBj([P1, P2], seq([A, A, N9, N9, N7, N7, K, K, N6, N6, N9, N9]));
    expect(st.status[P1]).toBe('stand');
    expect(st.turn).toBe(P2);
  });
});

describe('blackjack moves', () => {
  test('чужой ход отвергается', () => {
    const st = createBj([P1, P2], seq([N9]));
    const r = applyMove(st, P2, { kind: 'hit' });
    expect(r.ok).toBe(false);
  });
  test('хит добавляет карту, перебор = bust и ход уходит', () => {
    // P1: 9+7=16, добор 10 → 26 перебор
    const st = createBj([P1, P2], seq([N9, N9, N9, N9, N7, N7, N9, N9, N10, N10]));
    const r = applyMove(st, P1, { kind: 'hit' }, seq([N10, A]));
    expect(r.ok).toBe(true);
    expect(st.status[P1]).toBe('bust');
    expect(st.turn).toBe(P2);
  });
  test('стенд передаёт ход дальше', () => {
    const st = createBj([P1, P2], seq([N9]));
    const r = applyMove(st, P1, { kind: 'stand' });
    expect(r.ok).toBe(true);
    expect(st.status[P1]).toBe('stand');
    expect(st.turn).toBe(P2);
  });
  test('21 с добора само встаёт', () => {
    // P1: 9+6=15, хит 6 → 21
    const st = createBj([P1, P2], seq([N9, A, N9, A, N7, A, N6, A, N9, A, N9, A, N6, A]));
    applyMove(st, P1, { kind: 'hit' }, seq([N6, A]));
    expect(st.status[P1]).toBe('stand');
  });
  test('таймаут = авто-стенд', () => {
    const st = createBj([P1, P2], seq([N9]));
    const t = timeoutMove(st);
    expect(t.by).toBe(P1);
    expect(st.status[P1]).toBe('stand');
  });
  test('уход игрока = вылет', () => {
    const st = createBj([P1, P2, P3], seq([N9]));
    const rest = removePlayer(st, P1);
    expect(st.status[P1]).toBe('bust');
    expect(rest).toEqual([P2, P3]);
  });
});

describe('blackjack finish', () => {
  test('дуэль: сильнейшая рука забирает бой', () => {
    // P1: 9+7=16 stand; P2: 9+9=18 stand; дилер 9+8=17 встаёт → P2 единолично выше
    const N8 = 0.58; // 8
    const st = createBj([P1, P2], seq([N9, A, N9, A, N9, A, N7, A, N9, A, N8, A]));
    applyMove(st, P1, { kind: 'stand' });
    applyMove(st, P2, { kind: 'stand' });
    expect(st.phase).toBe('over');
    expect(st.winner).toBe(P2);
  });
  test('все сгорели — ничья', () => {
    // P1: 9+7=16 хит 10 → 26; P2: 9+7=16 хит 10 → 26
    const st = createBj([P1, P2], seq([N9, A, N9, A, N9, A, N7, A, N7, A, N9, A, N10, A, N10, A]));
    applyMove(st, P1, { kind: 'hit' }, seq([N10, A]));
    expect(st.status[P1]).toBe('bust');
    applyMove(st, P2, { kind: 'hit' }, seq([N10, A]));
    expect(st.phase).toBe('over');
    expect(st.winner).toBe(null);
    expect(st.draw).toBe(true);
  });
});
