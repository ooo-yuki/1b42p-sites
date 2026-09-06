# Task 6 brief (single source of truth)

### Task 6: Шуба GLB + Mixer

**Files:**
- Create: `shturm.bratuxa.zomb.top/src/three/shuba.ts`

**Interfaces:**
- Consumes: `initScene` Task 5.
- Produces: `loadShuba(scene): Promise<Shuba>`, `Shuba.update(speed, firing, dead, dt)`.

- [ ] **Step 1: Лоадер 4 GLB, бленд walk/run, аддитив attack**

```ts
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
export async function loadShuba(scene: THREE.Scene) {
  const loader = new GLTFLoader();
  const [walk, run, atk, dead] = await Promise.all(
    ['Walking', 'Running', 'Attack', 'Dead'].map(n =>
      loader.loadAsync(`/models/Meshy_AI_shuba_biped_Animation_${n}_withSkin.glb`))
  );
  const model = walk.scene; scene.add(model);
  model.traverse(o => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; } });
  const mixer = new THREE.AnimationMixer(model);
  const walkA = mixer.clipAction(walk.animations[0]);
  const runA = mixer.clipAction(run.animations[0]);
  const atkClip = atk.animations[0].clone();
  THREE.AnimationUtils.makeClipAdditive(atkClip);
  const atkA = mixer.clipAction(atkClip);
  const deadA = mixer.clipAction(dead.animations[0]);
  deadA.loop = THREE.LoopOnce; deadA.clampWhenFinished = true;
  walkA.play(); runA.play();
  return {
    model, mixer,
    update(speed: number, firing: boolean, deadFlag: boolean, dt: number) {
      const t = THREE.MathUtils.clamp((speed - 1) / 4, 0, 1);
      walkA.setEffectiveWeight(1 - t); runA.setEffectiveWeight(t);
      if (firing) { atkA.reset().setEffectiveWeight(1).play(); }
      else atkA.fadeOut(0.15);
      if (deadFlag) { deadA.play(); }
      mixer.update(dt);
    }
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add shturm.bratuxa.zomb.top/src/three/shuba.ts
git commit -m "shturm: шуба GLB миксер walk/run/attack/dead 🧥"
```


