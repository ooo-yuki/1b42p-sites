import { describe, expect, test } from 'bun:test';
import { MAPS, MAP_META, MAP_ORDER } from '../src/sim/maps';

describe('wiki maps meta', () => {
  test('каждая карта имеет мету', () => {
    expect(MAP_ORDER.length).toBeGreaterThan(0);
    for (const id of MAP_ORDER) {
      const m = MAP_META[id];
      expect(m.name.length).toBeGreaterThan(2);
      expect(m.desc.length).toBeGreaterThan(10);
      expect(m.tactic.length).toBeGreaterThan(10);
      expect(m.feature.length).toBeGreaterThan(2);
      expect(m.size).toBe(MAPS[id].size);
    }
  });
});
