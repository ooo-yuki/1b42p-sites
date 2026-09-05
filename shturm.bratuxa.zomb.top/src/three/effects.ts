import * as THREE from 'three';
export function makeTracerPool(scene: THREE.Scene, n = 43) {
  const pool: THREE.Line[] = [];
  for (let i = 0; i < n; i++) {
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 0, -5)]);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0 }));
    scene.add(line); pool.push(line);
  }
  let k = 0;
  return {
    fire(from: THREE.Vector3, dir: THREE.Vector3) { const l = pool[k++ % pool.length]; l.position.copy(from); l.lookAt(from.clone().add(dir)); (l.material as THREE.LineBasicMaterial).opacity = 1; l.visible = true; },
    /** Tracer fade: вызывать каждый кадр — дешёвый минор Task 10. */
    update(dt: number) {
      const decay = dt * 6;
      for (const l of pool) {
        const m = l.material as THREE.LineBasicMaterial;
        if (m.opacity > 0) {
          m.opacity = Math.max(0, m.opacity - decay);
          if (m.opacity === 0) l.visible = false;
        }
      }
    },
  };
}
