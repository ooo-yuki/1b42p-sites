import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { NEON_BLOOM, NEON_BLOOM_LOW, ENV_INTENSITY, shouldBloom } from '../src/three/post';
import { makeGun } from '../src/three/guns';

describe('post (Task 8: bloom + env)', () => {
  test('bloom только на неоне', () => {
    expect(shouldBloom('neon')).toBe(true);
    expect(shouldBloom('yard')).toBe(false);
    expect(shouldBloom('island')).toBe(false);
  });

  test('порог 0.85 — цветёт только emissive, перф-режим слабее', () => {
    expect(NEON_BLOOM.threshold).toBe(0.85);
    expect(NEON_BLOOM.strength).toBeGreaterThan(NEON_BLOOM_LOW);
    expect(NEON_BLOOM_LOW).toBeLessThan(NEON_BLOOM.strength);
  });

  test('окружение тихое — дневные карты не вымоет', () => {
    expect(ENV_INTENSITY).toBeLessThanOrEqual(0.5);
  });

  test('металл пушек вернулся к 0.9 (environment заведён)', () => {
    for (const slot of ['pistol', 'auto', 'shotgun'] as const) {
      const g = makeGun(slot);
      let maxMetal = 0;
      g.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
        if ((o as THREE.Mesh).isMesh && m && 'metalness' in m) {
          maxMetal = Math.max(maxMetal, m.metalness);
        }
      });
      expect(maxMetal).toBeGreaterThanOrEqual(0.85);
    }
  });
});
