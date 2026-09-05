/* Движок Фабрики Хайпа — чистые формулы, ноль DOM. RED: модуля ещё нет. */
import { describe, expect, test } from 'vitest';
import { defaultSave, fans, fmt, judgeDist, lvlCost, scoreHit, stComboCap, stDouble, stZone, unlocked } from './formulas';

describe('lvlCost', () => {
  test('растёт ×3 за уровень', () => {
    expect(lvlCost(50, 0)).toBe(50);
    expect(lvlCost(50, 1)).toBe(150);
    expect(lvlCost(50, 2)).toBe(450);
  });
});

describe('judgeDist', () => {
  test('perfect/great/good/miss по окнам зоны', () => {
    expect(judgeDist(1, 20)).toBe('perfect');
    expect(judgeDist(8, 20)).toBe('great');
    expect(judgeDist(18, 20)).toBe('good');
    expect(judgeDist(25, 20)).toBe('miss');
  });
});

describe('fmt', () => {
  test('тысячи и миллионы коротко', () => {
    expect(fmt(999)).toBe('999');
    expect(fmt(1500)).toBe('1.5K');
    expect(fmt(4200000)).toBe('4.20M');
  });
});

describe('saves', () => {
  test('дефолт как в legacy: гараж открыт, нули везде', () => {
    const s = defaultSave();
    expect(s.un).toEqual(['garage']);
    expect(s.h).toBe(0);
    expect(s.team.denis).toBe(0);
    expect(s.win).toBe(false);
  });
  test('фаны растут корнем из тотала', () => {
    expect(fans(0)).toBe(0);
    expect(fans(2500)).toBe(10);
  });
});

describe('derived stats', () => {
  test('зона шире с пиджаком', () => {
    const s = defaultSave();
    expect(stZone({ zone: 26 }, s)).toBe(26);
    s.look.jacket = 2;
    expect(stZone({ zone: 26 }, s)).toBe(32);
  });
  test('кап комбо и дабл по веткам', () => {
    const s = defaultSave();
    expect(stComboCap(s)).toBe(10);
    expect(stDouble(s)).toBe(0);
    s.look.sneakers = 3;
    s.look.mantle = 2;
    expect(stComboCap(s)).toBe(30);
    expect(stDouble(s)).toBe(0.2);
  });
});

describe('unlocked', () => {
  test('гараж свободен, клуб за хайп, арена за пиджак', () => {
    const s = defaultSave();
    expect(unlocked(s, { id: 'garage', cost: 0, need: '' }).ok).toBe(true);
    expect(unlocked(s, { id: 'club', cost: 500, need: '' }).ok).toBe(false);
    s.h = 500;
    expect(unlocked(s, { id: 'club', cost: 500, need: '' })).toEqual({ ok: true, buy: true });
    s.h = 5000;
    expect(unlocked(s, { id: 'arena', cost: 5000, need: 'jacket' }).ok).toBe(false);
    s.look.jacket = 1;
    expect(unlocked(s, { id: 'arena', cost: 5000, need: 'jacket' }).ok).toBe(true);
  });
});

describe('scoreHit', () => {
  test('perfect ×3, great ×2, good ×0.5, комбо и крит множат', () => {
    // base 100, combo 0, crit 1, без дабла
    expect(scoreHit(100, 'perfect', 0, 1, 0.1, 0.1, () => 0.99)).toBe(300);
    expect(scoreHit(100, 'great', 0, 1, 0.1, 0.1, () => 0.99)).toBe(200);
    expect(scoreHit(100, 'good', 0, 1, 0.1, 0.1, () => 0.99)).toBe(50);
    // комбо 4 при шаге 0.1 → ×1.4
    expect(scoreHit(100, 'perfect', 4, 1, 0.1, 0.1, () => 0.99)).toBe(420);
    // дабл при ролле ниже шанса → ×2
    expect(scoreHit(100, 'perfect', 0, 1, 0.1, 0.35, () => 0.1)).toBe(600);
  });
});
