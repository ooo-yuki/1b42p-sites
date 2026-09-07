/* Реестр мини-игр: витрина без поиска и матчмейкинга.
   Тестовая — только старая игра-кликер; боевые придут позже. */
import { describe, expect, test } from 'bun:test';
import { getGame, listGames } from './registry';

describe('minigames registry', () => {
  test('старая игра-кликер зарегистрирована как тестовая', () => {
    const g = getGame('clicker');
    expect(g).toBeDefined();
    expect(g?.href).toBe('game.html');
    expect(g?.test).toBe(true);
    expect(g?.mode).toBe('offline');
  });
  test('список отдаёт все записи, тестовые помечены', () => {
    const all = listGames();
    expect(all.length).toBeGreaterThan(0);
    expect(all.filter(g => g.test).length).toBeGreaterThan(0);
    for (const g of all) {
      expect(g.id.length).toBeGreaterThan(0);
      expect(g.title.length).toBeGreaterThan(0);
      expect(g.href.length).toBeGreaterThan(0);
      expect(g.mode === 'offline' || g.mode === 'online').toBe(true);
    }
  });
  test('неизвестная игра — undefined, а не заглушка', () => {
    expect(getGame('nope-42')).toBeUndefined();
  });
  test('подвал зарегистрирован как боевая офлайн-игра', () => {
    const g = getGame('podval');
    expect(g).toBeDefined();
    expect(g?.href).toBe('podval.html');
    expect(g?.mode).toBe('offline');
    expect(g?.test).toBe(false);
  });
  test('dvd-заставка зарегистрирована как боевая офлайн-игра', () => {
    const g = getGame('dvd');
    expect(g).toBeDefined();
    expect(g?.href).toBe('dvd.html');
    expect(g?.mode).toBe('offline');
    expect(g?.test).toBe(false);
  });
  test('терминал зарегистрирован как боевая офлайн-игра', () => {
    const g = getGame('terminal');
    expect(g).toBeDefined();
    expect(g?.href).toBe('terminal.html');
    expect(g?.mode).toBe('offline');
    expect(g?.test).toBe(false);
  });
  test('оборона зарегистрирована как боевая офлайн-игра', () => {
    const g = getGame('defense');
    expect(g).toBeDefined();
    expect(g?.href).toBe('defense.html');
    expect(g?.mode).toBe('offline');
    expect(g?.test).toBe(false);
  });
  test('фабрика зарегистрирована как боевая офлайн-игра', () => {
    const g = getGame('fabrika');
    expect(g).toBeDefined();
    expect(g?.href).toBe('fabrika.html');
    expect(g?.mode).toBe('offline');
    expect(g?.test).toBe(false);
  });
});
