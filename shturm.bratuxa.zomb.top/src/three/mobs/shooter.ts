import * as THREE from 'three';

function part(geo: THREE.BufferGeometry, color: number, roughness = 0.7, metalness = 0.1): THREE.Mesh {
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness, metalness }));
  m.castShadow = true;
  return m;
}

export function makeShooter(): THREE.Group {
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
