import * as THREE from 'three';
export function makeGun(slot: 'pistol' | 'auto' | 'shotgun') {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4, metalness: 0.8 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x7a4a21, roughness: 0.8 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, slot === 'shotgun' ? 0.9 : 0.6), mat);
  body.castShadow = true; g.add(body);
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.18, 0.08), wood);
  grip.position.set(0, -0.14, 0.15); g.add(grip);
  return g;
}
