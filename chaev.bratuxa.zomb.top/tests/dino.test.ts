import { describe, it, expect } from 'vitest';
import { createDinoState, stepDino, jumpDino, levelForScore, speedForScore, gapForLevel } from '../src/game/dinoEngine';

describe('дино-движок 42', () => {
  it('уровень = 1+floor(score/400)', () => {
    expect(levelForScore(0)).toBe(1);
    expect(levelForScore(399)).toBe(1);
    expect(levelForScore(400)).toBe(2);
    expect(levelForScore(1200)).toBe(4);
  });
  it('скорость = min(5+score/350, 12)', () => {
    expect(speedForScore(0)).toBe(5);
    expect(speedForScore(350)).toBe(6);
    expect(speedForScore(1e9)).toBe(12);
  });
  it('двойной прыжок: максимум 2 прыжка', () => {
    const s = createDinoState();
    jumpDino(s);
    expect(s.dino.jumps).toBe(1);
    expect(s.dino.vy).toBe(-12);
    stepDino(s);
    jumpDino(s);
    expect(s.dino.jumps).toBe(2);
    expect(s.dino.vy).toBe(-10);
    const vy = s.dino.vy;
    jumpDino(s);
    expect(s.dino.vy).not.toBe(-10 - 0.7 - 1);
    expect(s.dino.jumps).toBe(2);
    expect(vy).toBe(s.dino.vy);
  });
  it('счёт растёт пока жив', () => {
    const s = createDinoState();
    for (let i = 0; i < 10; i++) stepDino(s, () => 0.99);
    expect(s.score).toBe(10);
  });
  it('смерть при столкновении останавливает счёт', () => {
    const s = createDinoState();
    s.obstacles.push({ x: 55, w: 20, h: 40 });
    const ev = stepDino(s, () => 0.99);
    expect(ev).toBe('death');
    expect(s.alive).toBe(false);
    const score = s.score;
    stepDino(s, () => 0.99);
    expect(s.score).toBe(score);
  });
  it('прыжок после смерти = реванш', () => {
    const s = createDinoState();
    s.alive = false;
    s.score = 500;
    jumpDino(s);
    expect(s.alive).toBe(true);
    expect(s.score).toBe(0);
  });
  it('gap сужается с уровнем, минимум 38', () => {
    expect(gapForLevel(1)).toBe(64);
    expect(gapForLevel(10)).toBe(38);
  });
});
