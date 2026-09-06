import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { buildMapVisual } from '../src/three/mapsVisual';
describe('вода', () => {
  test('пруд во дворе с именем', () => {
    const g = buildMapVisual('yard');
    let found: THREE.Object3D | null = null;
    g.traverse((o) => { if (o.name === 'pond') found = o; });
    expect(found).not.toBeNull();
  });
});
