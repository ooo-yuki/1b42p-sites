import * as THREE from 'three';
import { C, box, cyl, sph, mat } from '../palette';

// Дом + крыша + окна + дверь + вывеска SKITONS.
// lvl 0: лачуга (маленькая, тусклая, без вывески-подсветки)
// lvl 1: +ставни и тёплые окна
// lvl 2: +крыльцо и козырёк
// lvl 3: +второй скат/мансарда (выше крыша + окно)
// lvl 4: +пристрой сбоку (кухонное крыло)
// lvl 5: двухэтажное здание + труба с дымком
export function buildBuilding(lv: number): THREE.Group {
  const g = new THREE.Group();
  const L = Math.max(0, Math.min(5, lv));
  const shabby = L === 0;

  const wallC = shabby ? 0xe9d5c2 : C.wall;
  const W = 7, H = 3.4, D = 5.6;

  // Корпус
  g.add(box(W, H, D, wallC, 0, H / 2, 0));

  // Второй этаж (lvl 5)
  if (L >= 5) {
    g.add(box(W * 0.86, 2.2, D * 0.86, 0xfffaf2, 0, H + 1.1, -0.2));
    // Труба + дымок (кольца, анимируются в CafeScene по имени)
    const chimney = box(0.7, 1.8, 0.7, 0xc9a08e, W * 0.28, H + 2.6, -1.2);
    chimney.name = 'chimney';
    g.add(chimney);
    const smoke = new THREE.Group();
    smoke.name = 'chimneySmoke';
    for (let i = 0; i < 3; i++) {
      const s = new THREE.Mesh(
        new THREE.SphereGeometry(0.28 + i * 0.1, 8, 6),
        new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, roughness: 1, flatShading: true }),
      );
      s.position.set(W * 0.28, H + 3.6 + i * 0.55, -1.2);
      smoke.add(s);
    }
    g.add(smoke);
  }

  // Крыша: односкатная лачуга -> двускатная призма с lvl 1
  const roofY = L >= 5 ? H + 2.2 : H;
  if (L === 0) {
    const r = box(W + 1, 0.3, D + 1, 0xb9a08e, 0.3, roofY + 0.15, 0);
    r.rotation.z = -0.06;
    g.add(r);
  } else {
    const roofMat = mat(L >= 3 ? C.roofDark : C.roof);
    const shape = new THREE.Shape();
    shape.moveTo(-W / 2 - 0.6, 0);
    shape.lineTo(W / 2 + 0.6, 0);
    shape.lineTo(0, L >= 3 ? 2.4 : 1.7);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: D + 1, bevelEnabled: false });
    const roof = new THREE.Mesh(geo, roofMat);
    roof.position.set(0, roofY, -(D + 1) / 2);
    roof.castShadow = true;
    roof.receiveShadow = true;
    g.add(roof);
  }

  // Окна: тёплые светящиеся, количество растёт с уровнем
  const winCount = [1, 2, 3, 4, 4, 6][L];
  const winMat = new THREE.MeshStandardMaterial({
    color: shabby ? C.window : C.windowLit,
    emissive: shabby ? 0x000000 : 0xffc978,
    emissiveIntensity: shabby ? 0 : 0.55,
    roughness: 0.4, flatShading: true,
  });
  for (let i = 0; i < winCount; i++) {
    const top = L >= 5 && i >= 4;
    const w = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.12), winMat);
    const x = top ? (i - 4 - 0.5) * 2.2 : (i - (Math.min(winCount, 4) - 1) / 2) * 2.1;
    w.position.set(x, top ? H + 1.2 : 1.9, D / 2 + 0.02);
    g.add(w);
    // Рама
    const f = box(1.2, 1.2, 0.06, C.cocoa, x, top ? H + 1.2 : 1.9, D / 2 - 0.02);
    f.scale.z = 1;
    g.add(f);
    w.position.z = D / 2 + 0.05;
    // Ставни с lvl 1
    if (L >= 1 && !top) {
      g.add(box(0.3, 1.1, 0.08, C.door, x - 0.75, 1.9, D / 2 + 0.03));
      g.add(box(0.3, 1.1, 0.08, C.door, x + 0.75, 1.9, D / 2 + 0.03));
    }
  }

  // Дверь
  g.add(box(1.2, 2.2, 0.15, C.door, 0, 1.1, D / 2 + 0.05));
  g.add(sph(0.08, C.cocoa, 0.4, 1.1, D / 2 + 0.15));

  // Крыльцо + козырёк с lvl 2
  if (L >= 2) {
    g.add(box(2.6, 0.25, 1.4, C.stone, 0, 0.12, D / 2 + 0.8));
    const awn = box(2.8, 0.15, 1.5, C.awning, 0, 2.7, D / 2 + 0.7);
    awn.rotation.x = 0.12;
    g.add(awn);
    g.add(cyl(0.07, 0.07, 2.6, C.woodDark, -1.3, 1.4, D / 2 + 1.3));
    g.add(cyl(0.07, 0.07, 2.6, C.woodDark, 1.3, 1.4, D / 2 + 1.3));
  }

  // Пристрой-кухня с lvl 4
  if (L >= 4) {
    g.add(box(2.6, 2.4, 3.4, 0xfdeed9, W / 2 + 1.3, 1.2, -0.6));
    const ar = box(3.2, 0.25, 4, C.roof, W / 2 + 1.3, 2.5, -0.6);
    ar.rotation.z = 0.05;
    g.add(ar);
  }

  // Вывеска SKITONS (подсветка с lvl 1)
  const sign = makeSign(L >= 1);
  sign.position.set(0, L >= 5 ? H - 0.4 : 2.9, D / 2 + 0.12);
  g.add(sign);

  return g;
}

function makeSign(lit: boolean): THREE.Mesh {
  const cv = document.createElement('canvas');
  cv.width = 512; cv.height = 128;
  const ctx = cv.getContext('2d')!;
  ctx.fillStyle = lit ? '#8a6a5a' : '#a08a78';
  const r = 34;
  ctx.beginPath();
  ctx.roundRect(6, 6, 500, 116, r);
  ctx.fill();
  ctx.fillStyle = '#fff6ea';
  ctx.font = 'bold 64px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SKITONS', 256, 68);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(3.4, 0.85),
    new THREE.MeshStandardMaterial({
      map: tex, roughness: 0.8, flatShading: true,
      emissive: lit ? 0xffd9a0 : 0x000000, emissiveIntensity: lit ? 0.25 : 0,
    }),
  );
  return m;
}
