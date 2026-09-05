import * as THREE from 'three';
import { C, cyl, mat, sph } from '../palette';

// Дальний план Skitons Cafe: кольцо деревьев, холмы, пруд и кусты.
// Вдаль видно жизнь, а не пустоту. Без теней: далеко от камеры.
export function buildFarPlan(): THREE.Group {
  const farGroup = new THREE.Group();
  const farTrees: Array<[number, number, number]> = [
    [-38, 12, 1.4], [-44, -8, 1.7], [-36, -30, 1.3], [-20, -44, 1.6], [0, -48, 1.4],
    [22, -44, 1.7], [40, -32, 1.3], [48, -10, 1.6], [50, 14, 1.4], [44, 34, 1.7],
    [30, 50, 1.3], [8, 56, 1.6], [-14, 54, 1.4], [-34, 46, 1.7], [-48, 32, 1.3],
    [58, -2, 1.5], [-56, -14, 1.5], [14, -58, 1.5],
  ];
  for (const [x, z, s] of farTrees) {
    const tree = new THREE.Group();
    tree.position.set(x, 0, z);
    tree.add(cyl(0.22 * s, 0.3 * s, 1.8 * s, C.trunk, 0, 0.9 * s, 0, 7));
    tree.add(sph(1.15 * s, C.leaf, 0, 2.5 * s, 0));
    tree.add(sph(0.7 * s, C.leafDark, 0.7 * s, 2.1 * s, 0.4 * s));
    farGroup.add(tree);
  }
  // холмы на горизонте (приплюснутые, уходят в туман)
  for (const [x, z, r] of [[-70, -60, 22], [75, -55, 26], [-80, 45, 24], [70, 60, 20]] as Array<[number, number, number]>) {
    const h = sph(r, C.leafDark, x, -r * 0.72, z);
    h.scale.y = 0.35;
    farGroup.add(h);
  }
  // кусты дальнего плана
  for (const [x, z, r] of [[-40, 24, 0.9], [52, 26, 1.1], [36, -44, 0.8], [-28, -50, 1.0], [62, 20, 0.9], [-62, 8, 1.0]] as Array<[number, number, number]>) {
    farGroup.add(sph(r, C.leaf, x, r * 0.8, z));
  }
  farGroup.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = false;
      mesh.receiveShadow = false;
    }
  });

  // Пруд дальнего плана
  const pond = new THREE.Mesh(new THREE.CircleGeometry(7, 28), mat(C.sky, { rough: 0.6 }));
  pond.rotation.x = -Math.PI / 2;
  pond.position.set(-44, 0.0, 44);
  pond.receiveShadow = false;
  farGroup.add(pond);
  for (const [x, z] of [[-50, 40], [-38, 49], [-47, 50]] as Array<[number, number]>) {
    const b = sph(0.5, C.leafDark, x, 0.4, z);
    b.castShadow = false;
    farGroup.add(b);
  }
  return farGroup;
}
