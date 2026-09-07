import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { getTex } from './textures';

export interface Shuba {
  model: THREE.Group;
  mixer: THREE.AnimationMixer;
  update: (speed: number, firing: boolean, deadFlag: boolean, dt: number) => void;
}

export async function loadShuba(scene: THREE.Scene): Promise<Shuba> {
  const loader = new GLTFLoader();
  const [walk, run, atk, dead] = await Promise.all(
    ['Walking', 'Running', 'Attack', 'Dead'].map(n =>
      loader.loadAsync(`/models/Meshy_AI_shuba_biped_Animation_${n}_withSkin.glb`))
  );
  const model = walk.scene; scene.add(model);
  // В GLB нет материалов (только геометрия+скелет+UV) — без этого шуба белая.
  // Даём процедурный мех из наших текстур.
  const furMat = new THREE.MeshStandardMaterial({ map: getTex('fur'), roughness: 0.9 });
  model.traverse(o => {
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh) { mesh.material = furMat; mesh.castShadow = true; }
  });
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
