/* Шашки русские — TDD-красное: движок arena/checkers.ts ещё не написан.
   Доска 0=a8..63=h1, играют тёмные поля. Взятие обязательно,
   бить надо по максимуму, дамка летает, простые берут вперёд и назад. */
import { describe, expect, test } from 'bun:test';
import { applyMove, createCheckers, fromRows, legalFrom, legalMoves, removePlayer, timeoutMove } from './checkers';

const W = 'pW1';
const B = 'pB1';

describe('checkers init', () => {
  test('старт: 24 шашки, ход белых', () => {
    const st = createCheckers(W, B);
    expect(st.board.filter(Boolean).length).toBe(24);
    expect(st.turn).toBe('w');
    expect(st.phase).toBe('play');
  });
  test('тихий ход a3-b4', () => {
    const st = createCheckers(W, B);
    const r = applyMove(st, W, { path: [40, 33] });
    expect(r.ok).toBe(true);
    expect(st.board[33]?.c).toBe('w');
  });
  test('назад ходить нельзя', () => {
    const st = createCheckers(W, B);
    expect(applyMove(st, W, { path: [40, 49] }).ok).toBe(false);
  });
  test('чужую шашку двигать нельзя', () => {
    const st = createCheckers(W, B);
    expect(applyMove(st, W, { path: [17, 24] }).ok).toBe(false);
  });
  test('со старта 7 тихих ходов', () => {
    const st = createCheckers(W, B);
    expect(legalMoves(st, W).length).toBe(7);
  });
});

describe('checkers capture', () => {
  test('взятие обязательно: тихий ход отклонён', () => {
    // белая c3, чёрная d4 — надо бить c3xe5, а не гулять
    const st = fromRows([
      '........',
      '........',
      '........',
      '........',
      '...b....',
      '..w.....',
      '........',
      '........',
    ], 'w', { w: W, b: B });
    expect(applyMove(st, W, { path: [42, 33] }).ok).toBe(false); // c3-b4 мимо боя
    const r = applyMove(st, W, { path: [42, 28] }); // c3xe5
    expect(r.ok).toBe(true);
    expect(st.board[35]).toBeNull(); // d4 снята
  });
  test('простая бьёт и назад', () => {
    // белая e5, чёрная f4 — белая бьёт назад e5xg3
    const st = fromRows([
      '........',
      '........',
      '........',
      '....w...',
      '.....b..',
      '........',
      '........',
      '........',
    ], 'w', { w: W, b: B });
    expect(applyMove(st, W, { path: [28, 46] }).ok).toBe(true);
    expect(st.board[37]).toBeNull();
  });
  test('бить надо по максимуму', () => {
    // белая c1 может взять двоих (d2, f4), белая a3 — одного (b4). Одна — мало.
    const st = fromRows([
      '........',
      '........',
      '........',
      '........',
      '...b.b..',
      'wb......',
      '...b....',
      '..w.....',
    ], 'w', { w: W, b: B });
    expect(applyMove(st, W, { path: [40, 26] }).ok).toBe(false); // a3xb4 — мало
    const r = applyMove(st, W, { path: [58, 44, 30] }); // c1xd2, e3xf4
    expect(r.ok).toBe(true);
  });
  test('добивание той же шашкой', () => {
    const st = fromRows([
      '........',
      '........',
      '........',
      '........',
      '...b.b..',
      'wb......',
      '...b....',
      '..w.....',
    ], 'w', { w: W, b: B });
    applyMove(st, W, { path: [58, 44, 30] });
    // после двойника очередь чёрных — белых ходов нет
    expect(st.turn).toBe('b');
    expect(legalMoves(st, W).length).toBe(0);
  });
});

describe('checkers king', () => {
  test('дамка летает через полдоски', () => {
    const st = fromRows([
      '........',
      '........',
      '........',
      '........',
      '........',
      '........',
      '.W......',
      '........',
    ], 'w', { w: W, b: B });
    const ms = legalFrom(st, W, 49);
    expect(ms.length).toBeGreaterThan(5);
  });
  test('дамка бьёт на лету', () => {
    // дамка b2, чёрная e5 — Db2xh8 через e5
    const st = fromRows([
      '........',
      '........',
      '........',
      '........',
      '....b...',
      '........',
      '.W......',
      '........',
    ], 'w', { w: W, b: B });
    const r = applyMove(st, W, { path: [49, 7] });
    expect(r.ok).toBe(true);
    expect(st.board[28]).toBeNull();
  });
  test('простая становится дамкой', () => {
    // белая c7 — ход c7-d8, дамки
    const st = fromRows([
      '........',
      '..w.....',
      '........',
      '........',
      '........',
      '........',
      '........',
      '........',
    ], 'w', { w: W, b: B });
    const r = applyMove(st, W, { path: [10, 3] });
    expect(r.ok).toBe(true);
    expect(st.board[3]).toEqual({ c: 'w', k: 'k' });
  });
});

describe('checkers end', () => {
  test('нет шашек — поражение', () => {
    const st = fromRows([
      '........',
      '........',
      '........',
      '........',
      '...b....',
      '........',
      '........',
      '........',
    ], 'w', { w: W, b: B });
    expect(st.phase).toBe('over');
    expect(st.winner).toBe(B);
    expect(st.reason).toBe('pieces');
  });
  test('нет ходов — поражение', () => {
    // белая h4: g3 и g5 заняты чёрными, поля приземления f2 и f6 тоже заняты —
    // ни тихого, ни взятия. У чёрных шашки есть, причина — ходы.
    const st = fromRows([
      '........',
      '........',
      '.....b..',
      '......b.',
      '.......w',
      '......b.',
      '.....b..',
      '........',
    ], 'w', { w: W, b: B });
    expect(st.phase).toBe('over');
    expect(st.winner).toBe(B);
    expect(st.reason).toBe('moves');
  });
  test('сдаться — победа соперника', () => {
    const st = createCheckers(W, B);
    expect(applyMove(st, W, { kind: 'resign' } as never).ok).toBe(true);
    expect(st.winner).toBe(B);
  });
  test('уход — победа оставшегося', () => {
    const st = createCheckers(W, B);
    expect(removePlayer(st, W)).toEqual([B]);
    expect(st.winner).toBe(B);
  });
  test('таймаут жмёт сторону на ходу', () => {
    const st = createCheckers(W, B);
    expect(timeoutMove(st).by).toBe(W);
  });
});
