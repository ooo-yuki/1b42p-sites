import * as THREE from 'three';
import { C, box, cyl, sph, mat } from '../palette';

// Интерьер зала (зал x∈[-3.5,3.5], z∈[-2.8,2.8], стены H=3.4):
// прилавок у северной стены с витриной и пирожными, полки с банками,
// ковёр в центре, часы на стене, люстра с 3 плафонами (БЕЗ источников
// света — свет добавляет сцена). Подвесы — цепочки-торы.
export function buildInterior(): { group: THREE.Group; chandelier: THREE.Group } {
  const g = new THREE.Group();

  // --- Прилавок у северной стены ---
  g.add(box(2.0, 0.95, 0.6, C.wood, 0, 0.475, -2.4));
  g.add(box(2.1, 0.08, 0.7, C.woodDark, 0, 0.99, -2.4));
  // Филёнки фасада
  for (const fx of [-0.65, 0, 0.65]) {
    g.add(box(0.5, 0.6, 0.04, C.peach, fx, 0.45, -2.08));
  }
  // Витрина: стеклянный короб + 6 пирожных на подносе
  g.add(box(1.7, 0.05, 0.5, 0xf3e2cf, 0, 1.06, -2.4));
  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(1.7, 0.4, 0.5),
    new THREE.MeshStandardMaterial({ color: 0xbfe3ff, transparent: true, opacity: 0.25, roughness: 0.1, flatShading: true }),
  );
  glass.position.set(0, 1.28, -2.4);
  g.add(glass);
  g.add(box(1.74, 0.05, 0.54, C.cocoa, 0, 1.5, -2.4));
  const cakeCols = [0xf6a5b8, 0xfff3c4, 0xd9c0e8, 0xffb347, 0x9fd8c9, 0xff7b54];
  cakeCols.forEach((c, i) => {
    const cx = -0.6 + (i % 3) * 0.6;
    const cz = -2.5 + Math.floor(i / 3) * 0.22;
    g.add(cyl(0.09, 0.11, 0.12, c, cx, 1.15, cz, 8));
    g.add(sph(0.035, 0xfff6ea, cx, 1.23, cz));
  });

  // --- Полки с банками на северной стене ---
  for (const sy of [1.95, 2.35]) {
    g.add(box(2.4, 0.07, 0.4, C.woodDark, 0, sy, -2.6));
    for (let i = 0; i < 5; i++) {
      const jx = -0.9 + i * 0.45;
      const jc = [0xf6a5b8, 0xffb347, 0xa8d5a2, 0xd9c0e8, 0xbfe3ff][i];
      g.add(cyl(0.09, 0.09, 0.2, jc, jx, sy + 0.14, -2.6, 8));
      g.add(cyl(0.095, 0.095, 0.05, C.cocoa, jx, sy + 0.26, -2.6, 8));
    }
  }

  // --- Ковёр в центре зала ---
  const carpet = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.04, 1.8),
    new THREE.MeshStandardMaterial({ map: carpetTexture(), roughness: 1, flatShading: true }),
  );
  carpet.position.set(0, 0.03, 0.3);
  carpet.receiveShadow = true;
  g.add(carpet);

  // --- Часы на северной стене ---
  const clock = new THREE.Group();
  clock.position.set(0, 2.75, -2.72);
  const face = cyl(0.3, 0.3, 0.08, 0xfff6ea, 0, 0, 0, 16);
  face.rotation.x = Math.PI / 2;
  clock.add(face);
  const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 6, 16), mat(C.cocoa));
  clock.add(bezel);
  clock.add(sph(0.04, C.cocoa, 0, 0, 0.06));
  const hour = box(0.05, 0.16, 0.02, C.ink, 0, 0.07, 0.06);
  hour.rotation.z = -0.9;
  clock.add(hour);
  const minute = box(0.04, 0.24, 0.02, C.ink, 0.06, 0.1, 0.06);
  minute.rotation.z = -1.9;
  clock.add(minute);
  g.add(clock);

  // --- Люстра: стержень + кольцо + 3 плафона на подвесах ---
  const ch = new THREE.Group();
  ch.position.set(0, 0, 0.3);
  ch.add(cyl(0.04, 0.04, 0.6, C.cocoa, 0, 3.1, 0, 6));
  ch.add(sph(0.08, C.cocoa, 0, 3.35, 0));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.04, 6, 16), mat(C.cocoa));
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 2.78;
  ch.add(ring);
  const shadeM = new THREE.MeshStandardMaterial({
    color: 0xffe6a3, emissive: 0xffc978, emissiveIntensity: 0.9, roughness: 0.6, flatShading: true,
  });
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const sx = Math.cos(a) * 0.45;
    const sz = Math.sin(a) * 0.45;
    // Подвес: 3 звена-тора от кольца
    for (let k = 0; k < 3; k++) {
      const link = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.012, 6, 8), mat(C.steel, { metal: 0.6, rough: 0.4 }));
      link.position.set(sx, 2.72 - k * 0.07, sz);
      link.rotation.y = (k % 2) * Math.PI / 2;
      ch.add(link);
    }
    // Плафон-колокол + тёплая лампочка-шарик
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.18, 10, 1, true), shadeM);
    shade.position.set(sx, 2.42, sz);
    ch.add(shade);
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 8, 6),
      new THREE.MeshStandardMaterial({ color: 0xfff3c4, emissive: 0xffd76a, emissiveIntensity: 1.4, roughness: 0.5 }),
    );
    bulb.position.set(sx, 2.36, sz);
    ch.add(bulb);
  }
  return { group: g, chandelier: ch };
}

// Ковёр: бордюр + центральный медальон-ромб.
function carpetTexture(): THREE.CanvasTexture {
  const cv = document.createElement('canvas');
  cv.width = 256; cv.height = 176;
  const ctx = cv.getContext('2d')!;
  ctx.fillStyle = '#9fd8c9';
  ctx.fillRect(0, 0, 256, 176);
  ctx.fillStyle = '#f6a5b8';
  ctx.fillRect(12, 12, 232, 152);
  ctx.fillStyle = '#fff6ea';
  ctx.fillRect(24, 24, 208, 128);
  ctx.fillStyle = '#f6a5b8';
  ctx.beginPath();
  ctx.moveTo(128, 40); ctx.lineTo(208, 88); ctx.lineTo(128, 136); ctx.lineTo(48, 88);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#9fd8c9';
  ctx.beginPath();
  ctx.moveTo(128, 60); ctx.lineTo(176, 88); ctx.lineTo(128, 116); ctx.lineTo(80, 88);
  ctx.closePath(); ctx.fill();
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
