import { describe, expect, test } from 'bun:test';
import { createGame, placeTurret, applyCard, tick, spawnWave } from './engine';

// Споты [3,8]/[5,8] из скетча плана лежат на дороге (ряд y=8 — часть PATH),
// placeTurret там вернул бы false. Сдвинуты на [3,6]/[5,6] — это баланс, не спека.
const SPOTS: [number, number][] = [[4, 0], [4, 2], [2, 4], [6, 4], [1, 6], [7, 6], [3, 6], [5, 6]];

const alive = (g: ReturnType<typeof createGame>) => g.units.some((u) => !u.dead);

function bot(): { won: boolean; lives: number } {
  const g = createGame();
  let si = 0;
  for (let w = 0; w < 10; w++) {
    while (si < SPOTS.length && placeTurret(g, SPOTS[si][0], SPOTS[si][1], si % 3 === 2 ? 'cobalt' : 'flood')) si++;
    spawnWave(g, w);
    for (let t = 0; t < 3000 && alive(g) && g.lives > 0; t++) tick(g);
    if (g.lives <= 0) return { won: false, lives: 0 };
    if (w < 9) applyCard(g, 'dmg');
  }
  return { won: g.lives > 0, lives: g.lives };
}

describe('сим-прогон', () => {
  test('бот с турелями и баффами проходит 10 волн', () => {
    const r = bot();
    expect(r.won).toBe(true);
  });
  test('голый штаб без турелей падает', () => {
    const g = createGame();
    for (let w = 0; w < 10; w++) {
      spawnWave(g, w);
      for (let t = 0; t < 3000 && alive(g) && g.lives > 0; t++) tick(g);
      if (g.lives <= 0) break;
    }
    expect(g.lives <= 0).toBe(true);
  });
});
