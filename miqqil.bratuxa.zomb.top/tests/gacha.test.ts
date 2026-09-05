// bun test — гача «Прыжок 42» (gacha.js)
import { describe, test, expect } from 'bun:test';
import { GACHA_POOL, STARTER, START_SPINS, PITY_4, PITY_5, defaultGacha, poolTotal, rollOnce, grantSpin, isUnlocked } from '../gacha.js';

describe('пул гачи', () => {
  test('шансы в сумме 100', () => {
    expect(poolTotal()).toBe(100);
  });
  test('стартового танка нет в пуле, в начале доступен только он', () => {
    expect(GACHA_POOL.some(p => p.id === STARTER)).toBe(false);
    const g = defaultGacha();
    expect(isUnlocked(g, STARTER)).toBe(true);
    for (const p of GACHA_POOL) expect(isUnlocked(g, p.id)).toBe(false);
  });
  test('в начале 5 пропусков', () => {
    expect(defaultGacha().spins).toBe(START_SPINS);
    expect(START_SPINS).toBe(5);
  });
});

describe('крутки', () => {
  test('без пропусков — ошибка', () => {
    const g = defaultGacha();
    g.spins = 0;
    expect(rollOnce(g)).toEqual({ error: 'no-spins' });
  });
  test('крутка тратит пропуск и открывает технику, повторка ничего не даёт', () => {
    const g = defaultGacha();
    const r1 = rollOnce(g, () => 0.999); // хвост пула — Вихрь 3★
    expect(r1.isNew).toBe(true);
    expect(g.spins).toBe(START_SPINS - 1);
    expect(isUnlocked(g, r1.id)).toBe(true);
    const ownedLen = g.owned.length;
    // форсим ту же технику: rng в её интервал
    const g2 = defaultGacha();
    g2.owned.push(r1.id);
    const r2 = rollOnce(g2, () => 0.999);
    expect(r2.id).toBe(r1.id);
    expect(r2.isNew).toBe(false);
    expect(g2.owned.length).toBe(ownedLen);
  });
  test('гарант 4★ каждые 10 прыжков', () => {
    const g = defaultGacha();
    const r = rollOnce(g, () => 0.999);
    expect(r.stars).toBe(3);
    g.spins = 100;
    for (let i = 0; i < PITY_4 - 2; i++) rollOnce(g, () => 0.999);
    const last = rollOnce(g, () => 0.999);
    expect(last.stars).toBeGreaterThanOrEqual(4);
  });
  test('гарант 5★ каждые 90 прыжков', () => {
    const g = defaultGacha();
    g.spins = 1000;
    let last = null;
    for (let i = 0; i < PITY_5; i++) last = rollOnce(g, () => 0.5);
    expect(last.stars).toBe(5);
    expect(last.id).toBe('avrora');
  });
  test('+1 пропуск за битву', () => {
    const g = defaultGacha();
    grantSpin(g);
    expect(g.spins).toBe(START_SPINS + 1);
  });
});
