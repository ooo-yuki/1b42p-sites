import * as THREE from 'three';
export function makeTracerPool(scene: THREE.Scene, n = 43) {
  const pool: THREE.Line[] = [];
  for (let i = 0; i < n; i++) {
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 0, -5)]);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0 }));
    scene.add(line); pool.push(line);
  }
  let k = 0;
  return { fire(from: THREE.Vector3, dir: THREE.Vector3) { const l = pool[k++ % pool.length]; l.position.copy(from); l.lookAt(from.clone().add(dir)); (l.material as THREE.Material & { opacity: number }).opacity = 1; } };
}
