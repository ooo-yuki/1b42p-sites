import { describe, expect, it } from 'vitest';
import { scoreText } from '../src/battle/scoring';

describe('счёт хвалы', () => {
  it('легенда легенда легенда → 10+5+2=17', () => {
    expect(scoreText('легенда легенда легенда')).toBe(17);
  });
  it('оскорбление даёт −15', () => {
    expect(scoreText('легенда дурак')).toBe(-5);
  });
  it('в минус уходить можно', () => {
    expect(scoreText('дурак дурак')).toBe(-30);
  });
  it('новое хорошее слово всегда 10', () => {
    expect(scoreText('легенда лучший добрый')).toBe(30);
  });
});
