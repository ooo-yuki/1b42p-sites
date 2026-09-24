import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Проверка раскраски GLB: средний цвет вершин по высотным слоям (видимые меши).
const buf = await Bun.file('src/assets/custom-map.glb').arrayBuffer();
const loader = new GLTFLoader();
const gltf = await loader.parseAsync(buf, '');
let checked = 0;
gltf.scene.traverse((obj) => {
  if (!('geometry' in obj)) return;
  const m = obj;
  if (m.name.startsWith('col_') || /spawn/i.test(m.name)) return;
  m.updateMatrixWorld(true);
  const g = m.geometry;
  const pos = g.getAttribute('position');
  const col = g.getAttribute('color');
  if (!pos || !col) { console.log('MESH', m.name, 'no color attr'); return; }
  const bands = { 'y<0.3': [0, 0, 0, 0], '0.3-2': [0, 0, 0, 0], 'y>2': [0, 0, 0, 0] };
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 7) {
    v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld);
    const b = v.y < 0.3 ? 'y<0.3' : v.y < 2 ? '0.3-2' : 'y>2';
    bands[b][0] += col.getX(i); bands[b][1] += col.getY(i); bands[b][2] += col.getZ(i); bands[b][3]++;
  }
  for (const k of Object.keys(bands)) {
    const s = bands[k];
    if (s[3] > 0) console.log('MESH', JSON.stringify(m.name), k, 'n=' + s[3], 'avg=', (s[0] / s[3]).toFixed(3), (s[1] / s[3]).toFixed(3), (s[2] / s[3]).toFixed(3));
  }
  checked++;
});
console.log('visible meshes checked:', checked);
