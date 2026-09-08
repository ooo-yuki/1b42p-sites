import { describe, expect, test } from 'bun:test';
import { readBest, writeBest, SAVE_KEY } from './save';

const mem = () => {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => (m.has(k) ? m.get(k)! : null),
    setItem: (k: string, v: string) => { m.set(k, v); },
  };
};

describe('сейвы обороны', () => {
  test('пустое хранилище даёт нули', () => {
    expect(readBest(mem())).toEqual({ stars: 0, wave: 0, medals: 0, bestEndless: 0 });
  });
  test('старый сейв без медалей мигрирует в 0', () => {
    const s = mem();
    s.setItem(SAVE_KEY, JSON.stringify({ stars: 2, wave: 10 }));
    expect(readBest(s)).toEqual({ stars: 2, wave: 10, medals: 0, bestEndless: 0 });
  });
  test('запись и чтение медалей', () => {
    const s = mem();
    writeBest(s, { stars: 3, wave: 10, medals: 2, bestEndless: 13 });
    expect(readBest(s).medals).toBe(2);
    expect(readBest(s).bestEndless).toBe(13);
  });
});
