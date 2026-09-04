import { describe, it, expect } from 'vitest';
import { motifFor, DEMON_FORM_FAST, DEMON_FORM_DOWN } from '../src/components/zapoi/charMusic';

describe('треки персонажей: у каждого свой мотив', () => {
  it('все 4 мотива с разными именами и темпами', () => {
    const names = ['vladimir', 'ghost', 'winline', 'demon'].map((c) => motifFor(c, 0).name);
    expect(new Set(names).size).toBe(4);
  });
  it('неизвестный персонаж падает на марш Владимира', () => {
    expect(motifFor('???', 0).name).toBe(motifFor('vladimir', 0).name);
  });
  it('мотивы в разумных границах', () => {
    for (const c of ['vladimir', 'ghost', 'winline', 'demon']) {
      const m = motifFor(c, 0);
      expect(m.bpm).toBeGreaterThanOrEqual(60);
      expect(m.bpm).toBeLessThanOrEqual(160);
      expect(m.bass.length).toBeGreaterThan(0);
      expect(m.lead.length).toBeGreaterThan(0);
      expect(m.root).toBeGreaterThan(30);
    }
  });
});

describe('демоническая форма: тот же трек, чуть ускорен и зловещее', () => {
  it('темп ×1.18 (72 → 85)', () => {
    const base = motifFor('demon', 0);
    const form = motifFor('demon', 10);
    expect(form.form).toBe(true);
    expect(base.form).toBe(false);
    expect(form.bpm).toBe(Math.round(base.bpm * DEMON_FORM_FAST));
    expect(form.bpm).toBeGreaterThan(base.bpm);
  });
  it('корень приспущен (×0.84) + гул сильнее', () => {
    const base = motifFor('demon', 0);
    const form = motifFor('demon', 10);
    expect(form.root).toBeCloseTo(base.root * DEMON_FORM_DOWN, 6);
    expect(form.root).toBeLessThan(base.root);
    expect(form.droneGain).toBeGreaterThan(base.droneGain);
  });
  it('форма только у демона', () => {
    expect(motifFor('vladimir', 10).form).toBe(false);
    expect(motifFor('ghost', 10).form).toBe(false);
    expect(motifFor('demon', 0).form).toBe(false);
  });
});
