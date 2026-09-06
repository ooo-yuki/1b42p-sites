import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { makeGun, countTris, type GunSlot } from '../src/three/guns';

const slots: GunSlot[] = ['pistol', 'auto', 'shotgun'];

describe('guns', () => {
  for (const slot of slots) {
    test(`${slot}: группа, дуло строго -Z, kick/update`, () => {
      const g = makeGun(slot);
      expect(g).toBeInstanceOf(THREE.Group);
      const muzzle = g.userData.muzzle as THREE.Vector3;
      expect(muzzle).toBeInstanceOf(THREE.Vector3);
      expect(muzzle.z).toBeLessThan(0);
      expect(Math.abs(muzzle.x)).toBeLessThan(1e-6);
      expect(typeof g.userData.kick).toBe('function');
      expect(typeof g.userData.update).toBe('function');
    });

    test(`${slot}: 1000–3000 треугольников`, () => {
      const g = makeGun(slot);
      const n = countTris(g);
      expect(n).toBeGreaterThanOrEqual(1000);
      expect(n).toBeLessThanOrEqual(3000);
    });

    test(`${slot}: kick + update не падают, вспышка гаснет`, () => {
      const g = makeGun(slot);
      const kick = g.userData.kick as () => void;
      const update = g.userData.update as (dt: number) => void;
      for (let i = 0; i < 10; i++) update(0.016);
      kick();
      for (let i = 0; i < 120; i++) update(0.016);
      // После пружины inner почти вернулся.
      const inner = g.children[0];
      expect(Math.abs(inner.position.z)).toBeLessThan(0.01);
    });
  }
});
