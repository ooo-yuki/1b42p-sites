import * as THREE from 'three';
import { describe, expect, test } from 'bun:test';
import { makeSky, SKY_MOODS } from '../src/three/sky';
describe('небо', () => {
  test('муд на 3 карты', () => {
    expect(Object.keys(SKY_MOODS).sort()).toEqual(['island', 'neon', 'yard']);
    expect(SKY_MOODS.neon.exposure).toBeCloseTo(0.95, 6);
  });
  test('купол BackSide + юниформы ставятся', () => {
    const sky = makeSky();
    expect((sky.mesh.material as THREE.Material).side).toBe(THREE.BackSide);
    sky.setMood(SKY_MOODS.yard);
    expect(sky.mat.uniforms.topColor.value.getHex()).toBe(0x3a7bd5);
  });
});
