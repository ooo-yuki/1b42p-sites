import * as THREE from 'three';

function part(geo: THREE.BufferGeometry, color: number, roughness = 0.7, metalness = 0.1): THREE.Mesh {
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness, metalness }));
  m.castShadow = true;
  return m;
}

export function makeSeagull(): THREE.Group {
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
