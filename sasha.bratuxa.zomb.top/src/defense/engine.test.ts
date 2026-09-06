import { describe, expect, test } from 'bun:test';
import { PATH, WAVES, ENEMIES, createGame } from './engine';
test('дорожка идёт от левого края к штабу 8,8 без срезов', () => {
  expect(PATH[0].x).toBe(0);
  const last = PATH[PATH.length - 1];
  expect({ x: last.x, y: last.y }).toEqual({ x: 8, y: 8 });
  for (let i = 1; i < PATH.length; i++) {
    const d = Math.abs(PATH[i].x - PATH[i-1].x) + Math.abs(PATH[i].y - PATH[i-1].y);
    expect(d).toBe(1);
  }
});
test('10 волн, рост 10→40 юнитов и HP ×1.35', () => {
  expect(WAVES.length).toBe(10);
  expect(WAVES[0].count).toBe(10);
  expect(WAVES[9].count).toBe(40);
  expect(WAVES[9].hpMul).toBeCloseTo(1.35 ** 9, 1);
});
test('новая игра: 10 жизней, 0 волна', () => {
  const g = createGame();
  expect(g.lives).toBe(10);
  expect(g.wave).toBe(0);
});
test('бестиарий: зануда ×3HP медленный, спринтер быстрый слабый, директор ×20HP', () => {
  expect(ENEMIES.zevaka.hp).toBe(20);
  expect(ENEMIES.zanuda.hp).toBe(ENEMIES.zevaka.hp * 3);
  expect(ENEMIES.zanuda.speed).toBeLessThan(ENEMIES.zevaka.speed);
  expect(ENEMIES.sprinter.speed).toBeGreaterThan(ENEMIES.zevaka.speed);
  expect(ENEMIES.sprinter.hp).toBeLessThan(ENEMIES.zevaka.hp);
  expect(ENEMIES.director.hp).toBe(ENEMIES.zevaka.hp * 20);
});
