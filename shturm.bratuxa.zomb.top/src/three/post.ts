import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { MapId } from '../sim/maps';

/** Bloom только на неоне; порог 0.85 — цветёт только emissive (вывески, лампы, голограммы). */
export const NEON_BLOOM = { strength: 0.55, radius: 0.4, threshold: 0.85 } as const;
/** Просадка <42 FPS — роняем силу, а не выключаем (вывески без свечения плоские). */
export const NEON_BLOOM_LOW = 0.35;
/** Окружение для металла: тихо, чтобы дневные карты не вымыло. */
export const ENV_INTENSITY = 0.35;

export function shouldBloom(map: MapId): boolean {
  return map === 'neon';
}

export interface NeonComposer {
  composer: EffectComposer;
  bloom: UnrealBloomPass;
}

/** Ленивый composer: создавать один раз при первом старте neon-карты. */
export function makeNeonComposer(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
): NeonComposer {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    NEON_BLOOM.strength,
    NEON_BLOOM.radius,
    NEON_BLOOM.threshold,
  );
  composer.addPass(bloom);
  // Без OutputPass композитор отдаёт линейный кадр без тонемаппинга/sRGB.
  composer.addPass(new OutputPass());
  composer.setSize(window.innerWidth, window.innerHeight);
  return { composer, bloom };
}

/**
 * IBL-окружение из RoomEnvironment: металл читается на всех картах.
 * Возвращает false, если PMREM не завёлся (headless/старый GPU) — игра живёт без него.
 */
export function applyEnvironment(scene: THREE.Scene, renderer: THREE.WebGLRenderer): boolean {
  try {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    // r163+: глобальная сила окружения; на старых сборках — тихо пропускаем.
    if ('environmentIntensity' in scene) {
      (scene as THREE.Scene & { environmentIntensity: number }).environmentIntensity = ENV_INTENSITY;
    }
    pmrem.dispose();
    return true;
  } catch (e) {
    console.warn('[shturm] environment не завёлся, металл без IBL', e);
    return false;
  }
}
