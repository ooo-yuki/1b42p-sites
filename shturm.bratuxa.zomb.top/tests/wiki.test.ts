import { describe, expect, test } from 'bun:test';
import { MAPS, MAP_LORE, type MapId } from '../src/sim/maps';
import { WEAPONS, WEAPON_META, SLOT_ORDER } from '../src/sim/weapons';
import { ENEMIES, ENEMY_META } from '../src/sim/enemies';

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

test('мета оружия и врагов консистентны', () => {
  for (const s of SLOT_ORDER) {
    expect(WEAPONS[s].dmg).toBeGreaterThan(0);
    expect(WEAPON_META[s].name.length).toBeGreaterThan(0);
  }
  for (const t of ['runner', 'shooter', 'tank', 'boss'] as const) {
    expect(ENEMIES[t].hp).toBeGreaterThan(0);
    expect(ENEMY_META[t].name.length).toBeGreaterThan(0);
  }
});
