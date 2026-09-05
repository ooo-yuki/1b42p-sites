import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { MAPS, type MapId } from '../sim/maps';

const GROUND_COLOR: Record<MapId, number> = { yard: 0x5a6b52, island: 0xc2a35e, neon: 0x0b0e1a };
const WALL_COLOR: Record<MapId, number> = { yard: 0x7a7f87, island: 0x8a6f4d, neon: 0x1a2340 };
const LAMP_COLORS: Record<MapId, number[]> = {
  yard: [0xffd9a0, 0xffd9a0],
  island: [0xffe6b0],
  neon: [0x00f0ff, 0xff00e5, 0x7cff00, 0xff00e5],
};

function box(w: number, h: number, d: number, x: number, y: number, z: number): THREE.BufferGeometry {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(x, y, z);
  return g;
}

function cyl(rt: number, rb: number, h: number, x: number, y: number, z: number, seg = 12): THREE.BufferGeometry {
  const g = new THREE.CylinderGeometry(rt, rb, h, seg);
  g.translate(x, y, z);
  return g;
}

/** Статика карты одним мешем + неон-фонари (PointLight без теней). Возвращает группу для dispose. */
export function buildMapVisual(map: MapId): THREE.Group {
  const def = MAPS[map];
  const half = def.size / 2;
  const group = new THREE.Group();
  group.name = `map-${map}`;

  // Земля — отдельный меш (принимает тени).
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(def.size, def.size),
    new THREE.MeshStandardMaterial({ color: GROUND_COLOR[map], roughness: 1 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  group.add(ground);

  // Merged статика: периметр + препятствия.
  const parts: THREE.BufferGeometry[] = [
    box(def.size + 2, 3, 1, 0, 1.5, -half - 0.5),
    box(def.size + 2, 3, 1, 0, 1.5, half + 0.5),
    box(1, 3, def.size + 2, -half - 0.5, 1.5, 0),
    box(1, 3, def.size + 2, half + 0.5, 1.5, 0),
    ...def.obstacles.map((o) => cyl(o.r, o.r * 1.1, 2.5, o.x, 1.25, o.z)),
  ];
  const merged = mergeGeometries(parts);
  parts.forEach((p) => p.dispose());
  const statics = new THREE.Mesh(
    merged,
    new THREE.MeshStandardMaterial({ color: WALL_COLOR[map], roughness: 0.9 }),
  );
  statics.castShadow = true;
  statics.receiveShadow = true;
  group.add(statics);

  // Неон-фонари: стойка merged + PointLight без теней (castShadow не включаем).
  const colors = LAMP_COLORS[map];
  const lampPos: THREE.Vector3[] = colors.map((_, i) => {
    const a = (i / colors.length) * Math.PI * 2 + Math.PI / 4;
    const r = half - 4;
    return new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r);
  });
  const poleGeos = lampPos.map((p) => cyl(0.12, 0.16, 4.5, p.x, 2.25, p.z, 8));
  const poleMerged = mergeGeometries(poleGeos);
  poleGeos.forEach((p) => p.dispose());
  group.add(new THREE.Mesh(poleMerged, new THREE.MeshStandardMaterial({ color: 0x222831, roughness: 0.6, metalness: 0.6 })));

  lampPos.forEach((p, i) => {
    const color = colors[i % colors.length];
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 12, 8),
      new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 2.5 }),
    );
    bulb.position.set(p.x, 4.6, p.z);
    group.add(bulb);
    const light = new THREE.PointLight(color, map === 'neon' ? 60 : 25, map === 'neon' ? 35 : 22, 1.8);
    light.position.set(p.x, 4.6, p.z);
    group.add(light);
  });

  return group;
}

/** Удалить визуал карты из сцены с освобождением геометрий. */
export function disposeMapVisual(scene: THREE.Scene, group: THREE.Group): void {
  scene.remove(group);
  group.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.geometry.dispose();
      const m = o.material as THREE.Material | THREE.Material[];
      if (Array.isArray(m)) m.forEach((x) => x.dispose());
      else m.dispose();
    }
  });
}
