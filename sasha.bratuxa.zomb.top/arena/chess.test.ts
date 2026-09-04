/* Шахматы — TDD-красное: движок arena/chess.ts ещё не написан.
   Чистые правила ФИДЕ-базы: ходы, шах, мат, пат, рокировки,
   взятие на проходе, превращение, ничьи (50 ходов, троекрат, материал). */
import { describe, expect, test } from 'bun:test';
import { applyMove, createChess, fromRows, legalFrom, legalMoves, removePlayer, timeoutMove } from './chess';

const W = 'pW1';
const B = 'pB1';

describe('chess init', () => {
  test('старт: 32 фигуры, ход белых, шаха нет', () => {
    const st = createChess(W, B);
    expect(st.board.filter(Boolean).length).toBe(32);
    expect(st.turn).toBe('w');
    expect(st.phase).toBe('play');
    expect(st.check).toBe(false);
  });
  test('пешка e2 может на e4', () => {
    const st = createChess(W, B);
    const ms = legalFrom(st, W, 52); // e2 = rank6 file4 → 6*8+4
    expect(ms.map(m => m.to)).toContain(36); // e4
    expect(ms.map(m => m.to)).toContain(44); // e3
  });
  test('чужую фигуру двигать нельзя', () => {
    const st = createChess(W, B);
    const r = applyMove(st, W, { from: 8, to: 24 }); // a7 чёрная пешка
    expect(r.ok).toBe(false);
  });
});

describe('chess mates', () => {
  test('дурацкий мат: f3 e5 g4 Фh4# — победа чёрных', () => {
    const st = createChess(W, B);
    expect(applyMove(st, W, { from: 53, to: 37 }).ok).toBe(true); // f2-f3
    expect(applyMove(st, B, { from: 12, to: 28 }).ok).toBe(true); // e7-e5
    expect(applyMove(st, W, { from: 54, to: 38 }).ok).toBe(true); // g2-g4
    const r = applyMove(st, B, { from: 3, to: 39 }); // Фd8-h4
    expect(r.ok).toBe(true);
    expect(st.phase).toBe('over');
    expect(st.winner).toBe(B);
    expect(st.reason).toBe('mate');
  });
  test('мат в один ход отклоняет нелегальную защиту', () => {
    const st = createChess(W, B);
    applyMove(st, W, { from: 53, to: 37 });
    applyMove(st, B, { from: 12, to: 28 });
    applyMove(st, W, { from: 54, to: 38 });
    applyMove(st, B, { from: 3, to: 39 });
    expect(st.phase).toBe('over');
    expect(applyMove(st, W, { from: 62, to: 45 }).ok).toBe(false); // после мата
  });
});

describe('chess special', () => {
  test('рокировка короткая после расчистки', () => {
    const st = createChess(W, B);
    const seq: [string, number, number][] = [
      [W, 52, 36], [B, 12, 28], // e4 e5
      [W, 62, 45], [B, 1, 18], // Nf3 Nc6
      [W, 61, 34], [B, 5, 26], // Bc4 Bc5 (слон с f8)
    ];
    for (const [p, f, t] of seq) expect(applyMove(st, p, { from: f, to: t }).ok).toBe(true);
    const r = applyMove(st, W, { from: 60, to: 62 }); // O-O
    expect(r.ok).toBe(true);
    expect(st.board[61]?.k).toBe('r'); // ладья на f1
    expect(st.board[62]?.k).toBe('k');
  });
  test('взятие на проходе', () => {
    const st = createChess(W, B);
    applyMove(st, W, { from: 52, to: 36 }); // e4
    applyMove(st, B, { from: 8, to: 24 }); // a6
    applyMove(st, W, { from: 36, to: 28 }); // e5
    applyMove(st, B, { from: 11, to: 27 }); // d7-d5
    const r = applyMove(st, W, { from: 28, to: 19 }); // exd6 на проходе
    expect(r.ok).toBe(true);
    expect(st.board[27]).toBeNull(); // чёрная пешка снята
    expect(st.board[19]?.c).toBe('w');
  });
  test('превращение в ферзя', () => {
    const st = createChess(W, B);
    // гонка пешек: a2-a4-a5-a6xb... короче ведём h-пешку
    const seq: [string, number, number][] = [
      [W, 55, 39], [B, 8, 16], // h4 a6
      [W, 39, 31], [B, 16, 24], // h5 a5
      [W, 31, 23], [B, 9, 25], // h6 b5
      [W, 23, 14], [B, 25, 33], // hxg7 b4
    ];
    for (const [p, f, t] of seq) expect(applyMove(st, p, { from: f, to: t }).ok).toBe(true);
    const r = applyMove(st, W, { from: 14, to: 7, promote: 'q' }); // gxh8=Ф
    expect(r.ok).toBe(true);
    expect(st.board[7]).toEqual({ c: 'w', k: 'q' });
  });
  test('пат — ничья (чёрные в пате)', () => {
    // пат: белый Крh6, белый Фg5; чёрный Крh8, ход чёрных — ходов нет, шаха нет
    const st = fromRows([
      '.......k',
      '........',
      '.......K',
      '......Q.',
      '........',
      '........',
      '........',
      '........',
    ], 'b', { w: W, b: B });
    expect(st.phase).toBe('over');
    expect(st.winner).toBeNull();
    expect(st.reason).toBe('stalemate');
  });
  test('голые короли — ничья за материалом', () => {
    const st = fromRows([
      '....k...',
      '........',
      '........',
      '........',
      '........',
      '........',
      '........',
      '....K...',
    ], 'w', { w: W, b: B });
    expect(st.phase).toBe('over');
    expect(st.reason).toBe('material');
  });
  test('сдаться — победа соперника', () => {
    const st = createChess(W, B);
    const r = applyMove(st, W, { kind: 'resign' } as never);
    expect(r.ok).toBe(true);
    expect(st.phase).toBe('over');
    expect(st.winner).toBe(B);
  });
  test('уход игрока — победа оставшегося', () => {
    const st = createChess(W, B);
    const rest = removePlayer(st, W);
    expect(rest).toEqual([B]);
    expect(st.phase).toBe('over');
    expect(st.winner).toBe(B);
  });
  test('таймаут жмёт сторону на ходу', () => {
    const st = createChess(W, B);
    expect(timeoutMove(st).by).toBe(W);
  });
  test('король не может остаться под шахом (связка)', () => {
    // белый Крe1, белый Сf1 связан чёрной Лe8? нет — свяжем коня: Крe1, Кe2, Лe8
    const st = fromRows([
      '....r...',
      '........',
      '........',
      '........',
      '........',
      '........',
      '....N...',
      '....K...',
    ], 'w', { w: W, b: B });
    // конь e2 связан ладьёй e8 — любой его ход нелегален
    expect(legalFrom(st, W, 52)).toEqual([]);
    // а король может отойти
    expect(legalFrom(st, W, 60).length).toBeGreaterThan(0);
  });
  test('всего легальных ходов со старта — 20', () => {
    const st = createChess(W, B);
    expect(legalMoves(st, W).length).toBe(20);
  });
});
