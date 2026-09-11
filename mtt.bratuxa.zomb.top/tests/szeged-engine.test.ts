import { expect, test } from 'bun:test';
import { MAPS } from '../src/game/engine';
test('szeged в меню', () => {
  const m = MAPS.find((x) => x.id === 'szeged');
  expect(m).toBeDefined();
  expect(m!.name).toContain('Szeged');
});
