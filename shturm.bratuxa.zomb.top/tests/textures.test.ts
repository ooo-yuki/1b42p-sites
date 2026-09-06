import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { getTex } from '../src/three/textures';

describe('textures', () => {
  test('возвращает 256 canvas и кэширует по kind', () => {
    const a = getTex('fur');
    expect(a.image.width).toBe(256);
    expect(getTex('fur')).toBe(a);
  });
  test('grassGround 512 и stone 256, кэш по kind', () => {
    const g = getTex('grassGround');
    expect(g.image.width).toBe(512);
    expect(g.wrapS).toBe(THREE.RepeatWrapping);
    const s = getTex('stone');
    expect(s.image.width).toBe(256);
    expect(getTex('stone')).toBe(s);
  });
});
