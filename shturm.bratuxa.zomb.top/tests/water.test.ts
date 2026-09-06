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
  test('pondTex отслеживается в localTex для dispose', () => {
    const g = buildMapVisual('yard');
    let pond: THREE.Mesh | null = null;
    g.traverse((o) => { if (o.name === 'pond') pond = o as THREE.Mesh; });
    expect(pond).not.toBeNull();
    const map = (pond!.material as THREE.MeshStandardMaterial).map;
    const localTex = g.userData.localTex as THREE.Texture[];
    expect(Array.isArray(localTex)).toBe(true);
    expect(localTex).toContain(map);
  });
});
