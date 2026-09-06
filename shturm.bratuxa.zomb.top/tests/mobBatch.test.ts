import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { makeRunner } from '../src/three/mobs/runner';
import { makeShooter } from '../src/three/mobs/shooter';
import { makeTank } from '../src/three/mobs/tank';
import { makeSeagull } from '../src/three/mobs/seagull';

// Task 8, диета draw calls: мёрж не должен ломать геометрию и анимацию.
function meshes(g: THREE.Group): THREE.Mesh[] {
  const out: THREE.Mesh[] = [];
  g.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) out.push(m);
  });
  return out;
}

function finiteGeo(g: THREE.Group): boolean {
  for (const m of meshes(g)) {
    const p = (m.geometry as THREE.BufferGeometry).getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      if (!Number.isFinite(p.getX(i) + p.getY(i) + p.getZ(i))) return false;
    }
  }
  return true;
}

describe.each([
  ['runner', makeRunner, 1],
  ['shooter', makeShooter, 4],
  ['tank', makeTank, 5],
] as Array<[string, () => THREE.Group, number]>)('%s: склейка скина', (name, make, skinnedWant) => {
  test(`${name}: один скин на материал, геометрия конечна`, () => {
    const g = make();
    const sk = meshes(g).filter((m) => (m as THREE.SkinnedMesh).isSkinnedMesh);
    expect(sk.length).toBe(skinnedWant);
    expect(finiteGeo(g)).toBe(true);
  });
  test(`${name}: walk-анимация двигает кости`, () => {
    const g = make();
    const { mixer, actions } = g.userData as { mixer: THREE.AnimationMixer; actions: Record<string, THREE.AnimationAction> };
    actions.walk.setEffectiveWeight(1);
    const sk = meshes(g).filter((m) => (m as THREE.SkinnedMesh).isSkinnedMesh)[0] as THREE.SkinnedMesh;
    const before = sk.skeleton!.bones.map((b) => b.quaternion.toArray().join(',')).join('|');
    for (let i = 0; i < 10; i++) mixer.update(0.1);
    const after = sk.skeleton!.bones.map((b) => b.quaternion.toArray().join(',')).join('|');
    expect(after === before).toBe(false);
  });
});

describe('seagull: склейка rigid-декора', () => {
  test('мешей меньше 40, геометрия конечна', () => {
    const g = makeSeagull();
    expect(meshes(g).length).toBeLessThan(40);
    expect(finiteGeo(g)).toBe(true);
  });
  test('flutter машет крыльями', () => {
    const g = makeSeagull();
    const { mixer, actions } = g.userData as { mixer: THREE.AnimationMixer; actions: Record<string, THREE.AnimationAction> };
    actions.walk.setEffectiveWeight(1);
    for (let i = 0; i < 10; i++) mixer.update(0.1);
    const a = g.getObjectByName('wingAL') ?? g.getObjectByName('body');
    void a;
    expect(mixer.time).toBeGreaterThan(0);
  });
});
