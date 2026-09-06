import * as THREE from 'three';

function part(geo: THREE.BufferGeometry, color: number, roughness = 0.7, metalness = 0.1): THREE.Mesh {
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness, metalness }));
  m.castShadow = true;
  return m;
}

export function makeTank(): THREE.Group {
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
