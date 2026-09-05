/* Юнит-тесты голосований арены: decideGame — большинство, все-«любое», ничья.
   Плюс швы игровой платформы: sanitizeGame, gameCap, fitMembers.
   bun test arena/vote.test.ts */
import { describe, expect, test } from 'bun:test';
import { clients, decideGame, fitMembers, gameCap, sanitizeGame } from './server';

function seed(votes: Record<string, string>): string[] {
  clients.clear();
  const ids: string[] = [];
  let i = 0;
  for (const [name, v] of Object.entries(votes)) {
    const id = `t${i++}`;
    clients.set(id, {
      id, name, ws: {} as WebSocket, roomId: null,
      gameVote: v, lastSeen: Date.now(), lastChat: 0,
    });
    ids.push(id);
  }
  return ids;
}

describe('decideGame', () => {
  test('большинство забирает игру', () => {
    const ids = seed({ a: 'dice', b: 'dice', c: 'any' });
    expect(decideGame(ids)).toBe('dice');
  });

  test('все на «любом» — валидная игра из каталога', () => {
    const ids = seed({ a: 'any', b: 'any', c: 'any' });
    expect(['dice', 'durak', 'chess', 'checkers', 'monopoly']).toContain(decideGame(ids));
  });

  test('пустой пул — валидная игра, не падает', () => {
    expect(['dice', 'durak', 'chess', 'checkers', 'monopoly']).toContain(decideGame([]));
  });

  test('один голос решает при остальных «любых»', () => {
    const ids = seed({ a: 'any', b: 'dice', c: 'any', d: 'any' });
    expect(decideGame(ids)).toBe('dice');
  });

  test('битый голос считается «любым»', () => {
    const ids = seed({ a: 'nope', b: 'dice' });
    expect(decideGame(ids)).toBe('dice');
  });

  test('детерминизм при явном большинстве (20 прогонов)', () => {
    const ids = seed({ a: 'dice', b: 'dice', c: 'dice' });
    for (let k = 0; k < 20; k++) expect(decideGame(ids)).toBe('dice');
  });
});

describe('game platform seams', () => {
  test('sanitizeGame пропускает известную игру', () => {
    expect(sanitizeGame('dice')).toBe('dice');
    expect(sanitizeGame('durak')).toBe('durak');
    expect(sanitizeGame('chess')).toBe('chess');
    expect(sanitizeGame('checkers')).toBe('checkers');
    expect(sanitizeGame('monopoly')).toBe('monopoly');
  });

  test('sanitizeGame гасит битую игру в dice', () => {
    expect(sanitizeGame('zzz')).toBe('dice');
    expect(sanitizeGame(undefined)).toBe('dice');
    expect(sanitizeGame('any')).toBe('dice');
  });

  test('gameCap отдаёт лимит правилами игры', () => {
    expect(gameCap('dice')).toBe(5);
    expect(gameCap('durak')).toBe(5);
    expect(gameCap('chess')).toBe(2);
    expect(gameCap('checkers')).toBe(2);
    expect(gameCap('monopoly')).toBe(5);
    expect(gameCap('zzz')).toBe(5);
  });

  test('fitMembers режет пати лимитом игры, порядок держит', () => {
    expect(fitMembers(['a', 'b', 'c', 'd', 'e', 'f'], 'dice')).toEqual(['a', 'b', 'c', 'd', 'e']);
    expect(fitMembers(['a', 'b'], 'dice')).toEqual(['a', 'b']);
    expect(fitMembers(['a', 'b', 'c'], 'chess')).toEqual(['a', 'b']);
    expect(fitMembers(['a', 'b', 'c'], 'checkers')).toEqual(['a', 'b']);
    expect(fitMembers(['a', 'b', 'c', 'd', 'e', 'f'], 'monopoly')).toEqual(['a', 'b', 'c', 'd', 'e']);
  });
});
