import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/**
 * Task 8, диета draw calls: склейка частей моба без смены картинки.
 * Вершины/веса/кости не меняются — анимация и силуэт пиксель-в-пиксель те же,
 * падает только число мешей (= draw calls + проходы shadow map).
 */

function attrKey(g: THREE.BufferGeometry): string | null {
  if (!g.index) return null;
  return Object.keys(g.attributes).sort().join(',');
}

/**
 * Склеить SkinnedMesh с одним материалом в один (тот же скелет).
 * Вызывать ДО bind(): функция сама пересобирает массив skinned.
 */
export function batchSkinned(g: THREE.Group, skinned: THREE.SkinnedMesh[]): void {
  const byMat = new Map<string, THREE.SkinnedMesh[]>();
  for (const m of skinned) {
    const k = (m.material as THREE.Material).uuid;
    if (!byMat.has(k)) byMat.set(k, []);
    byMat.get(k)!.push(m);
  }
  for (const list of byMat.values()) {
    if (list.length < 2) continue;
    const a0 = attrKey(list[0].geometry);
    if (!a0 || !list.every((m) => attrKey(m.geometry) === a0)) continue;
    const parts = list.map((m) => {
      m.updateMatrix();
      return m.geometry.clone().applyMatrix4(m.matrix);
    });
    const merged = mergeGeometries(parts, false);
    parts.forEach((p) => p.dispose());
    if (!merged) continue;
    merged.computeBoundingSphere();
    const nm = new THREE.SkinnedMesh(merged, list[0].material);
    nm.castShadow = true;
    g.add(nm);
    for (const m of list) {
      m.parent?.remove(m);
      const i = skinned.indexOf(m);
      if (i >= 0) skinned.splice(i, 1);
    }
    skinned.push(nm);
  }
}

/**
 * Склеить rigid-декод (обычные Mesh) с общим родителем и материалом.
 * Кости/группы-родители не трогаем — анимация цела.
 */
export function batchRigid(root: THREE.Object3D): void {
  const stack: THREE.Object3D[] = [root];
  while (stack.length) {
    const o = stack.pop()!;
    for (let i = o.children.length - 1; i >= 0; i--) stack.push(o.children[i]);
    const byKey = new Map<string, THREE.Mesh[]>();
    for (const c of o.children) {
      const m = c as THREE.Mesh;
      if (!m.isMesh || (m as THREE.SkinnedMesh).isSkinnedMesh) continue;
      if (!m.geometry || (m.geometry as THREE.BufferGeometry).index === null) continue;
      const k =
        (m.material as THREE.Material).uuid +
        '|' + m.castShadow +
        '|' + m.receiveShadow;
      if (!byKey.has(k)) byKey.set(k, []);
      byKey.get(k)!.push(m);
    }
    for (const list of byKey.values()) {
      if (list.length < 2) continue;
      const a0 = attrKey(list[0].geometry as THREE.BufferGeometry);
      if (!a0 || !list.every((m) => attrKey(m.geometry as THREE.BufferGeometry) === a0)) continue;
      const parts = list.map((m) => {
        m.updateMatrix();
        return (m.geometry as THREE.BufferGeometry).clone().applyMatrix4(m.matrix);
      });
      const merged = mergeGeometries(parts, false);
      parts.forEach((p) => p.dispose());
      if (!merged) continue;
      merged.computeBoundingSphere();
      const nm = new THREE.Mesh(merged, list[0].material);
      nm.castShadow = list[0].castShadow;
      nm.receiveShadow = list[0].receiveShadow;
      o.add(nm);
      for (const m of list) o.remove(m);
    }
  }
}
