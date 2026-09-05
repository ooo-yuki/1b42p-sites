import * as THREE from 'three';

export type MobKind = 'runner' | 'shooter' | 'tank' | 'seagull';

function part(geo: THREE.BufferGeometry, color: number, roughness = 0.7, metalness = 0.1): THREE.Mesh {
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness, metalness }));
  m.castShadow = true;
  return m;
}

function makeRunner(): THREE.Group {
  const g = new THREE.Group();
  const skin = 0xc22a1e;
  const torso = part(new THREE.BoxGeometry(0.34, 0.7, 0.2), skin);
  torso.position.y = 1.15; g.add(torso);
  const head = part(new THREE.BoxGeometry(0.24, 0.26, 0.24), skin);
  head.position.y = 1.65; g.add(head);
  for (const s of [-1, 1]) {
    const leg = part(new THREE.BoxGeometry(0.11, 0.8, 0.11), skin);
    leg.position.set(0.1 * s, 0.4, 0); g.add(leg);
    const arm = part(new THREE.BoxGeometry(0.09, 0.6, 0.09), skin);
    arm.position.set(0.24 * s, 1.15, 0); g.add(arm);
  }
  return g;
}

function makeShooter(): THREE.Group {
  const g = new THREE.Group();
  const cloth = 0x3a5a2e;
  const torso = part(new THREE.BoxGeometry(0.44, 0.75, 0.26), cloth);
  torso.position.y = 1.15; g.add(torso);
  const head = part(new THREE.BoxGeometry(0.26, 0.28, 0.26), 0xd9a066);
  head.position.y = 1.68; g.add(head);
  for (const s of [-1, 1]) {
    const leg = part(new THREE.BoxGeometry(0.13, 0.78, 0.13), 0x2b2b2b);
    leg.position.set(0.12 * s, 0.39, 0); g.add(leg);
  }
  const arm = part(new THREE.BoxGeometry(0.1, 0.1, 0.6), cloth);
  arm.position.set(0.15, 1.3, -0.35); g.add(arm);
  const lampBody = part(new THREE.CylinderGeometry(0.06, 0.07, 0.16, 12), 0x1a1a1a, 0.4, 0.8);
  lampBody.rotation.x = Math.PI / 2;
  lampBody.position.set(0.15, 1.34, -0.7); g.add(lampBody);
  const lampLens = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.02, 12),
    new THREE.MeshStandardMaterial({ color: 0xfff2b0, emissive: 0xffee88, emissiveIntensity: 2 }),
  );
  lampLens.rotation.x = Math.PI / 2;
  lampLens.position.set(0.15, 1.34, -0.79); g.add(lampLens);
  const beam = new THREE.SpotLight(0xfff2b0, 8, 18, 0.35, 0.5);
  beam.position.set(0.15, 1.34, -0.7);
  beam.target.position.set(0.15, 1.0, -6);
  g.add(beam); g.add(beam.target);
  return g;
}

function makeTank(): THREE.Group {
  const g = new THREE.Group();
  const hide = 0x5a2e1a;
  const torso = part(new THREE.BoxGeometry(0.9, 1.0, 0.55), hide, 0.9);
  torso.position.y = 1.2; g.add(torso);
  const head = part(new THREE.BoxGeometry(0.4, 0.36, 0.4), hide, 0.9);
  head.position.y = 1.9; g.add(head);
  for (const s of [-1, 1]) {
    const leg = part(new THREE.CylinderGeometry(0.16, 0.2, 0.85, 10), 0x4a2615, 0.9);
    leg.position.set(0.26 * s, 0.42, 0); g.add(leg);
    const arm = part(new THREE.CylinderGeometry(0.14, 0.16, 0.8, 10), hide, 0.9);
    arm.position.set(0.58 * s, 1.2, 0); g.add(arm);
  }
  return g;
}

function makeSeagull(): THREE.Group {
  const g = new THREE.Group();
  const white = 0xf2f2f2;
  const body = part(new THREE.BoxGeometry(0.9, 0.5, 1.6), white, 0.6);
  body.position.y = 2.2; g.add(body);
  const head = part(new THREE.BoxGeometry(0.4, 0.4, 0.5), white, 0.6);
  head.position.set(0, 2.6, -0.9); g.add(head);
  const beak = part(new THREE.BoxGeometry(0.16, 0.12, 0.4), 0xe8a020, 0.5);
  beak.position.set(0, 2.52, -1.3); g.add(beak);
  for (const s of [-1, 1]) {
    const wing = part(new THREE.BoxGeometry(1.4, 0.08, 0.7), white, 0.6);
    wing.position.set(1.1 * s, 2.35, 0.1); g.add(wing);
  }
  return g;
}

export function makeMob(kind: MobKind): THREE.Group {
  switch (kind) {
    case 'runner': return makeRunner();
    case 'shooter': return makeShooter();
    case 'tank': return makeTank();
    case 'seagull': return makeSeagull();
  }
}

/**
 * Просадка FPS → гасим SpotLight'ы стрелков, остаётся emissive-линза
 * (дешёвый минор Task 10: свет без теней всё равно дорог в массе).
 */
export function setMobLightDetail(root: THREE.Object3D, low: boolean): void {
  root.traverse((o) => {
    if ((o as THREE.SpotLight).isSpotLight) o.visible = !low;
  });
}
