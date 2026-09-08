import { describe, expect, test } from 'bun:test';
import { MAPS, MAP_LORE, type MapId } from '../src/sim/maps';

const IDS = Object.keys(MAPS) as MapId[];

describe('вики: лор карт', () => {
  test('лор есть для каждой карты из MAPS', () => {
    for (const id of IDS) {
      expect(MAP_LORE[id].name.length).toBeGreaterThan(0);
      expect(MAP_LORE[id].look.length).toBeGreaterThan(10);
      expect(MAP_LORE[id].lore.length).toBeGreaterThan(10);
    }
  });
  test('yard/island/neon на месте', () => {
    expect(Object.keys(MAP_LORE).sort()).toEqual(['island', 'neon', 'yard']);
  });
});
