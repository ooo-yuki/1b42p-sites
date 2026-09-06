# Task 7 brief (single source of truth)

### Task 7: Стволы/мобы/эффекты процедурно + пулы

**Files:**
- Create: `shturm.bratuxa.zomb.top/src/three/guns.ts`
- Create: `shturm.bratuxa.zomb.top/src/three/mobs.ts`
- Create: `shturm.bratuxa.zomb.top/src/three/effects.ts`

- [ ] **Step 1: guns.ts — 3 бокса-ствола, аттач к руке**

```ts
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
```

- [ ] **Step 2: mobs.ts + effects.ts пулы (трейсеры/гильзы)**

```ts
// effects.ts — пул трейсеров 43 шт
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
```

- [ ] **Step 3: Commit**

```bash
git add shturm.bratuxa.zomb.top/src/three/guns.ts shturm.bratuxa.zomb.top/src/three/mobs.ts shturm.bratuxa.zomb.top/src/three/effects.ts
git commit -m "shturm: процедурные стволы мобы трейсеры 🔫"
```


