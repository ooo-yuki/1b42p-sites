# Task 5 brief (single source of truth)

### Task 5: Three сцена + камеры 1/3

**Files:**
- Create: `shturm.bratuxa.zomb.top/src/three/scene.ts`
- Create: `shturm.bratuxa.zomb.top/src/three/cameraRig.ts`

**Interfaces:**
- Consumes: снапшот sim `{player:{x,z,yaw,hp}}`.
- Produces: `initScene(canvas): {scene,camera,renderer}`, `setView('first'|'third')`, `updateCamera(snap)`.

- [ ] **Step 1: Сцена с hemi+dir+туман (код из threejs-lighting скилла)**

```ts
import * as THREE from 'three';
export function initScene(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);
  scene.fog = new THREE.Fog(0x87ceeb, 20, 90);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 300);
  scene.add(new THREE.HemisphereLight(0x87ceeb, 0x8b4513, 0.6));
  const sun = new THREE.DirectionalLight(0xffffcc, 1.5);
  sun.position.set(20, 30, 10); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -25; sun.shadow.camera.right = 25;
  sun.shadow.camera.top = 25; sun.shadow.camera.bottom = -25;
  scene.add(sun);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), new THREE.MeshStandardMaterial({ color: 0x6a8f5f, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  return { scene, camera, renderer };
}
```

- [ ] **Step 2: Риг 1/3 лицо + проверка в браузере**

```ts
let view: 'first' | 'third' = 'third';
export function setView(v: 'first' | 'third') { view = v; }
export function updateCamera(camera: THREE.PerspectiveCamera, p: { x: number; z: number; yaw: number }) {
  if (view === 'first') camera.position.set(p.x, 1.62, p.z);
  else camera.position.set(p.x + Math.sin(p.yaw) * 2.2 + 0.8, 2.4, p.z + Math.cos(p.yaw) * 2.2);
  camera.rotation.set(0, p.yaw, 0);
}
window.addEventListener('keydown', e => { if (e.code === 'KeyV') setView(view === 'first' ? 'third' : 'first'); });
```

- [ ] **Step 3: Commit**

```bash
git add shturm.bratuxa.zomb.top/src/three/scene.ts shturm.bratuxa.zomb.top/src/three/cameraRig.ts
git commit -m "shturm: three сцена свет камеры V-1/3 🎥"
```


