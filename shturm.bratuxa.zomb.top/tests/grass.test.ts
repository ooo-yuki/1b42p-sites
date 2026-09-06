import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { buildGrass, GRASS_HIGH } from '../src/three/grass';
import { MAPS } from '../src/sim/maps';
describe('трава', () => {
  test('хай-каунт и все кусты в bounds + вне препятствий', () => {
    const g = buildGrass('yard', 42);
    expect(g.mesh.count).toBe(GRASS_HIGH);
    const m = new THREE.Matrix4(); const v = new THREE.Vector3();
    for (let i = 0; i < g.mesh.count; i += 50) {
      g.mesh.getMatrixAt(i, m); v.setFromMatrixPosition(m);
      expect(Math.abs(v.x)).toBeLessThan(20);
      expect(Math.abs(v.z)).toBeLessThan(20);
      for (const o of MAPS.yard.obstacles) expect(Math.hypot(v.x - o.x, v.z - o.z)).toBeGreaterThan(o.r + 1.5);
    }
  });
  test('setLow режет count', () => {
    const g = buildGrass('yard', 42);
    g.setLow(true);
    expect(g.mesh.count).toBeLessThan(GRASS_HIGH);
    g.setLow(false);
    expect(g.mesh.count).toBe(GRASS_HIGH);
  });
});
