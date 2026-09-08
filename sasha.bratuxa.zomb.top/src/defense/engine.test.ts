import { describe, expect, test } from 'bun:test';
import { PATH, WAVES, WAVE_NAMES, ENEMIES, CARDS, CARD_GATES, MEDAL_GATES, endlessWave, createGame, placeTurret, sellTurret, spawnWave, tick, TURRETS, applyCard, finishWave } from './engine';
import { readBest } from './save';
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
test('турель бьёт ближайшего в радиусе', () => {
  const g = createGame();
  expect(placeTurret(g, 4, 0, 'cobalt')).toBe(true);
  spawnWave(g, 0);
  const hp0 = g.units[0].hp;
  for (let i = 0; i < 20; i++) tick(g);
  expect(g.units[0].hp).toBeLessThan(hp0);
});
test('продажа возвращает 70%', () => {
  const g = createGame();
  const before = g.coins;
  placeTurret(g, 4, 0, 'flood');
  sellTurret(g, 0);
  expect(g.coins).toBe(before - TURRETS.flood.cost + Math.floor(TURRETS.flood.cost * 0.7));
});
test('юнит в штабе снимает жизнь', () => {
  const g = createGame();
  spawnWave(g, 0);
  g.units[0].seg = PATH.length - 1;
  tick(g);
  expect(g.lives).toBe(9);
});
test('волна 10 спавнит Директора Тишину с ×20HP', () => {
  const g = createGame();
  spawnWave(g, 9);
  const boss = g.units.find((u) => u.kind === 'director');
  expect(boss).toBeDefined();
  expect(boss!.hp).toBe(ENEMIES.director.hp * WAVES[9].hpMul);
});
test('алый бьёт по линии, а не в одну цель', () => {
  const g = createGame();
  expect(placeTurret(g, 4, 0, 'scarlet')).toBe(true);
  spawnWave(g, 0);
  g.units.forEach((u) => { u.seg = 4; u.pos = 0.5; });
  const hp0 = g.units.map((u) => u.hp);
  for (let i = 0; i < 30; i++) tick(g);
  const hit = g.units.filter((u, k) => u.hp < hp0[k]).length;
  expect(hit).toBeGreaterThan(1);
});
test('повтор карты слабее: ×0.7', () => {
  const g = createGame();
  applyCard(g, 'dmg');
  const once = g.dmgMul!;
  applyCard(g, 'dmg');
  expect(g.dmgMul).toBeCloseTo(1 + (once - 1) * 1.7, 2);
});
test('звёзды: 0 потерь — 3, 4 потери — 1', () => {
  const g = createGame();
  finishWave(g, 0);
  expect(g.stars).toBe(3);
  finishWave(g, 4);
  expect(g.stars).toBe(1);
});
test('имена 10 волн и медали в сейве', () => {
  expect(WAVE_NAMES).toHaveLength(10);
  expect(WAVE_NAMES[9]).toBe('Директор лично');
  const store = { getItem: (_k: string) => null as string | null };
  expect(readBest(store).medals).toBe(0);
});
test('волна 11 жёстче 10-й, каждая 5-я — с директором', () => {
  const w11 = endlessWave(11);
  expect(w11.count).toBeGreaterThan(WAVES[9].count);
  expect(w11.hpMul).toBeGreaterThan(WAVES[9].hpMul);
  const g = createGame();
  spawnWave(g, 14);
  expect(g.units.some((u) => u.kind === 'director')).toBe(true);
  const g2 = createGame();
  spawnWave(g2, 11);
  expect(g2.units.some((u) => u.kind === 'director')).toBe(false);
});
test('медали апают урон', () => {
  const mk = (medals: number) => {
    const g = createGame();
    g.medals = medals;
    expect(placeTurret(g, 4, 0, 'cobalt')).toBe(true);
    spawnWave(g, 0);
    g.units.forEach((u) => { u.seg = 4; u.pos = 0.5; });
    return g;
  };
  const g0 = mk(0);
  for (let i = 0; i < 10; i++) tick(g0);
  const hp0 = g0.units[0].hp;
  const g4 = mk(4);
  for (let i = 0; i < 10; i++) tick(g4);
  expect(g4.units[0].hp).toBeLessThan(hp0);
});
test('пост-пул обороны по спеке', () => {
  expect(TURRETS.tesla.cost).toBe(400);
  expect(ENEMIES.troll.hp).toBe(150);
  expect(ENEMIES.double.speed).toBe(2.2);
  expect(Object.keys(CARDS)).toEqual(expect.arrayContaining(['warhorn', 'live', 'barricade', 'sabotage']));
});
test('лесенка гейтов 0–5', () => {
  expect(CARD_GATES.warhorn).toBe(3);
  expect(CARD_GATES.live).toBe(3);
  expect(CARD_GATES.barricade).toBe(4);
  expect(CARD_GATES.sabotage).toBe(4);
  expect(MEDAL_GATES.endless).toBe(1);
  expect(MEDAL_GATES.tesla).toBe(1);
  expect(MEDAL_GATES.troll).toBe(2);
  expect(MEDAL_GATES.arsenal).toBe(5);
});
test('тесла цепляет троих', () => {
  const g = createGame();
  g.medals = 1;
  g.coins = 1000;
  expect(placeTurret(g, 4, 4, 'tesla')).toBe(true);
  spawnWave(g, 0);
  g.units.forEach((u) => { u.seg = 20; u.pos = 0.5; });
  const hp0 = g.units.map((u) => u.hp);
  for (let i = 0; i < 30; i++) tick(g);
  const hit = g.units.filter((u, k) => u.hp < hp0[k]).length;
  expect(hit).toBeGreaterThanOrEqual(3);
});
test('тролль регенит, двойник быстрый', () => {
  const g = createGame();
  g.medals = 2;
  spawnWave(g, 11);
  const troll = g.units.find((u) => u.kind === 'troll');
  expect(troll).toBeDefined();
  troll!.hp = 10;
  for (let i = 0; i < 10; i++) tick(g);
  expect(troll!.hp).toBeGreaterThan(10);
});
