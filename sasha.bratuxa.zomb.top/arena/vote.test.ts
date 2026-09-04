/* Юнит-тесты голосований арены: decideGame — большинство, все-«любое», ничья.
   bun test arena/vote.test.ts */
import { describe, expect, test } from 'bun:test';
import { clients, decideGame } from './server';

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
    expect(['dice']).toContain(decideGame(ids));
  });

  test('пустой пул — валидная игра, не падает', () => {
    expect(['dice']).toContain(decideGame([]));
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
