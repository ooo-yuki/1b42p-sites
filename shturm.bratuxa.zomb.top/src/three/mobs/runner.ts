import * as THREE from 'three';

function part(geo: THREE.BufferGeometry, color: number, roughness = 0.7, metalness = 0.1): THREE.Mesh {
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness, metalness }));
  m.castShadow = true;
  return m;
}

export function makeRunner(): THREE.Group {
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
