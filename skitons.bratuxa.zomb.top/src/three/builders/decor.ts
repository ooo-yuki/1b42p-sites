import * as THREE from 'three';
import { C, mat, shortKeys, lvl, type Levels } from '../palette';

// Декор меню: seasonal — горшки (цветок/кактус/суккулент), recipes — доска,
// asian — фонарики с кисточками, european — флажки на верёвке, american — шарики.
// Количество = уровень.
export function buildMenuDecor(levels: Levels): THREE.Group {
    const g = new THREE.Group();
    const S = shortKeys(levels);
    const L = (id: string) => lvl(S, id);
    const cols = [0xf6a5b8, 0xffb347, 0xd9c0e8, 0xffffff, 0xff7b54];

    // Горшки разные: цветок / кактус / суккулент
    for (let i = 0; i < L('seasonal'); i++) {
      const px = -3.5 + i * 1.4;
      const kind = i % 3;
      const potCol = [0xb07a4a, 0xd9a066, 0x9fd8c9][kind];
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.17, 0.3, 8), mat(potCol));
      pot.position.set(px, 0.15, 3.8); pot.castShadow = true;
      g.add(pot);
      if (kind === 0) {
        const fl = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), mat(cols[i % 5]));
        fl.position.set(px, 0.48, 3.8); fl.castShadow = true;
        g.add(fl);
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.2, 5), mat(C.leafDark));
        stem.position.set(px, 0.32, 3.8);
        g.add(stem);
      } else if (kind === 1) {
        // кактус: столбик + две руки
        const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.25, 4, 8), mat(C.leafDark));
        body.position.set(px, 0.5, 3.8); body.castShadow = true;
        g.add(body);
        for (const s of [-1, 1]) {
          const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.1, 4, 6), mat(C.leafDark));
          arm.position.set(px + s * 0.15, 0.48, 3.8);
          arm.rotation.z = s * 0.5;
          g.add(arm);
        }
        g.add(new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 5), mat(0xf6a5b8)).translateX(px).translateY(0.72).translateZ(3.8));
      } else {
        // суккулент: розетка из толстых лепестков
        for (let p = 0; p < 7; p++) {
          const a = (p / 7) * Math.PI * 2;
          const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 5), mat(p % 2 ? C.leaf : C.leafDark));
          leaf.position.set(px + Math.cos(a) * 0.1, 0.42, 3.8 + Math.sin(a) * 0.1);
          leaf.scale.set(1, 0.55, 0.7);
          leaf.rotation.y = -a;
          leaf.castShadow = true;
          g.add(leaf);
        }
      }
    }

    // Доска-меню в раме с меловыми рисунками (круассан!)
    if (L('recipes') > 0) {
      const cv = document.createElement('canvas');
      cv.width = 128; cv.height = 160;
      const ctx = cv.getContext('2d')!;
      ctx.fillStyle = '#4a3f38'; ctx.fillRect(0, 0, 128, 160);
      ctx.strokeStyle = '#ffe6a3'; ctx.lineWidth = 3;
      ctx.strokeRect(5, 5, 118, 150);
      ctx.fillStyle = '#ffe6a3'; ctx.font = 'bold 15px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('MENU', 64, 26);
      const dishes = ['soup', 'cake', 'sushi', 'pie', 'taco'];
      for (let i = 0; i < L('recipes'); i++) {
        const y = 42 + i * 22;
        // меловой круассан слева от строки
        ctx.strokeStyle = '#ffd166';
        ctx.beginPath(); ctx.arc(20, y - 3, 6, 0.3, Math.PI * 2 - 0.3); ctx.stroke();
        ctx.beginPath(); ctx.arc(14, y - 3, 3, 0, 7); ctx.stroke();
        ctx.beginPath(); ctx.arc(26, y - 3, 3, 0, 7); ctx.stroke();
        // чашка с паром для супа
        if (i % 2 === 1) {
          ctx.strokeStyle = '#9fd8c9';
          ctx.beginPath(); ctx.moveTo(104, y - 8); ctx.quadraticCurveTo(106, y - 12, 104, y - 15); ctx.stroke();
        }
        ctx.fillStyle = '#ffe6a3'; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
        ctx.fillText(dishes[i % dishes.length], 34, y + 1);
        ctx.fillStyle = 'rgba(255,230,163,0.5)'; ctx.fillRect(34, y + 4, 80 - i * 8, 1.5);
      }
      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      const bd = new THREE.Group();
      bd.position.set(-4.4, 0, 3.2); bd.rotation.y = 0.5;
      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.2, 0.06), mat(C.woodDark));
      frame.position.y = 1.1;
      frame.castShadow = true;
      bd.add(frame);
      const board = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.1), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }));
      board.position.set(0, 1.1, 0.035);
      bd.add(board);
      for (const x of [-0.35, 0.35]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.1, 0.07), mat(C.woodDark));
        leg.position.set(x, 0.55, -0.05);
        bd.add(leg);
      }
      g.add(bd);
    }

    // Фонарики с кисточками
    for (let i = 0; i < L('asian'); i++) {
      const lx = -2.5 + i * 1.3;
      const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 5), mat(C.cocoa));
      cord.position.set(lx, 3.45, 3.6);
      g.add(cord);
      const lm = new THREE.MeshStandardMaterial({ color: 0xe85454, emissive: 0xff7b54, emissiveIntensity: 0.5, roughness: 0.7, flatShading: true });
      lm.userData.pulse = true; lm.userData.base = 0.5; lm.userData.seed = i * 1.1;
      const lan = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), lm);
      lan.position.set(lx, 3.1, 3.6);
      lan.scale.y = 1.2;
      g.add(lan);
      // кисточка: нитка + бусина
      const thread = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.16, 5), mat(0xffd166));
      thread.position.set(lx, 2.82, 3.6);
      g.add(thread);
      const bead = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 5), mat(0xffd166));
      bead.position.set(lx, 2.72, 3.6);
      g.add(bead);
    }

    // Флажки-треугольники на верёвке с провисом
    for (let i = 0; i < L('european'); i++) {
      const y0 = 3.1 - i * 0.35;
      const x0 = -2.5, x1 = 2.8;
      const sag = 0.3;
      // верёвка: сегменты линии с провисом
      const ropePts: THREE.Vector3[] = [];
      for (let s = 0; s <= 10; s++) {
        const x = x0 + ((x1 - x0) * s) / 10;
        ropePts.push(new THREE.Vector3(x, y0 - Math.sin((s / 10) * Math.PI) * sag, 4.4));
      }
      const rope = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(ropePts),
        new THREE.LineBasicMaterial({ color: 0x8a6a5a }),
      );
      g.add(rope);
      for (let f = 0; f < 6; f++) {
        const t = (f + 0.5) / 6;
        const fx = x0 + (x1 - x0) * t;
        const fy = y0 - Math.sin(t * Math.PI) * sag;
        const flag = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.2, 4), mat([0x9fd8c9, 0xffffff, 0xf6a5b8][(f + i) % 3], { rough: 1 }));
        flag.position.set(fx, fy - 0.12, 4.4);
        flag.rotation.x = Math.PI;
        flag.rotation.y = Math.PI / 4;
        g.add(flag);
      }
    }

    // Шарики с верёвочками и узлом
    for (let i = 0; i < L('american'); i++) {
      const bx = 3.2 + (i % 3) * 0.7;
      const by = 2.2 + Math.floor(i / 3) * 0.6;
      const bal = new THREE.Mesh(new THREE.SphereGeometry(0.26, 10, 8), mat([0xbfe3ff, 0xffffff, 0xf6a5b8][i % 3], { rough: 0.6 }));
      bal.position.set(bx, by, 4.2);
      bal.scale.y = 1.2;
      bal.castShadow = true;
      // узелок снизу
      const knot = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.08, 6), bal.material as THREE.Material);
      knot.position.set(bx, by - 0.34, 4.2);
      knot.rotation.x = Math.PI;
      g.add(bal, knot);
      // верёвочка с лёгким изгибом (два сегмента)
      const sPts = [new THREE.Vector3(bx, by - 0.38, 4.2), new THREE.Vector3(bx + 0.05, by - 0.9, 4.2), new THREE.Vector3(bx - 0.03, 1.2, 4.2)];
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(sPts), new THREE.LineBasicMaterial({ color: 0x8a6a5a })));
    }
    return g;
}

// Декор промо: ads — билборд на двух ногах с лесенкой,
// flyer — штендер CAFE мелом + листовки, music — колонки с диффузорами + нотки.
// Парящие нотки складываются в notes — их анимирует сцена.
export function buildPromoDecor(levels: Levels, notes: THREE.Group[]): THREE.Group {
    const g = new THREE.Group();
    const S = shortKeys(levels);
    const L = (id: string) => lvl(S, id);
    if (L('ads') > 0) {
      const s = 1 + L('ads') * 0.22;
      const bb = new THREE.Group();
      bb.position.set(-7, 0, 12); bb.rotation.y = 0.25;
      // две ноги + перекладина
      for (const x of [-0.9 * s, 0.9 * s]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 2.4 * s, 8), mat(C.cocoa));
        leg.position.set(x, 1.2 * s, 0);
        leg.castShadow = true;
        bb.add(leg);
      }
      const cross = new THREE.Mesh(new THREE.BoxGeometry(2.0 * s, 0.12, 0.12), mat(C.woodDark));
      cross.position.y = 1.0 * s;
      bb.add(cross);
      // лесенка сзади
      for (let r = 0; r < 4; r++) {
        const rung = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.06), mat(C.woodDark));
        rung.position.set(0, 0.4 + r * 0.45 * s, -0.35);
        bb.add(rung);
      }
      for (const x of [-0.25, 0.25]) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.0 * s, 0.06), mat(C.woodDark));
        rail.position.set(x, 1.0 * s, -0.35);
        bb.add(rail);
      }
      const cv = document.createElement('canvas');
      cv.width = 256; cv.height = 128;
      const ctx = cv.getContext('2d')!;
      ctx.fillStyle = '#fff6ea'; ctx.fillRect(0, 0, 256, 128);
      ctx.strokeStyle = '#8a6a5a'; ctx.lineWidth = 8; ctx.strokeRect(4, 4, 248, 120);
      ctx.fillStyle = '#8a6a5a'; ctx.font = 'bold 40px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('SKITONS', 128, 58);
      ctx.fillStyle = '#e85454'; ctx.font = 'bold 26px system-ui';
      ctx.fillText('yummy!' + '!'.repeat(Math.min(3, L('ads'))), 128, 96);
      // круассан-эмодзи-рисунок на билборде
      ctx.strokeStyle = '#d9a066'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(36, 92, 14, 0.4, Math.PI * 2 - 0.4); ctx.stroke();
      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(2.6 * s, 1.3 * s),
        new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, side: THREE.DoubleSide }));
      panel.position.y = 2.4 * s + 0.65 * s;
      panel.castShadow = true;
      bb.add(panel);
      g.add(bb);
    }
    if (L('flyer') > 0) {
      // Штендер с надписью CAFE мелом (CanvasTexture)
      const cv = document.createElement('canvas');
      cv.width = 128; cv.height = 128;
      const ctx = cv.getContext('2d')!;
      ctx.fillStyle = '#4a3f38'; ctx.fillRect(0, 0, 128, 128);
      ctx.strokeStyle = '#ffe6a3'; ctx.lineWidth = 4; ctx.strokeRect(6, 6, 116, 116);
      ctx.fillStyle = '#ffe6a3'; ctx.font = 'bold 34px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('CAFE', 64, 62);
      ctx.font = '15px system-ui'; ctx.fillStyle = '#ffd166';
      ctx.fillText('~ open ~', 64, 90);
      ctx.strokeStyle = '#9fd8c9';
      ctx.beginPath(); ctx.moveTo(24, 100); ctx.quadraticCurveTo(64, 108, 104, 100); ctx.stroke();
      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      const st = new THREE.Group();
      st.position.set(2.2, 0, 10.5); st.rotation.y = -0.3;
      for (const r of [-0.18, 0.18]) {
        const p = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.05), mat(0xfff6ea));
        p.position.set(0, 0.45, r); p.rotation.x = r > 0 ? -0.2 : 0.2;
        p.castShadow = true;
        st.add(p);
      }
      const face = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.6),
        new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 }));
      face.position.set(0, 0.48, 0.21); face.rotation.x = -0.2;
      st.add(face);
      g.add(st);
      for (let i = 0; i < L('flyer') * 3; i++) {
        const f = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.3),
          new THREE.MeshStandardMaterial({ color: 0xf6a5b8, roughness: 1, side: THREE.DoubleSide }));
        f.rotation.set(-Math.PI / 2, 0, i * 1.3);
        f.position.set(1 + (i % 5) * 0.5, 0.03, 9 + Math.floor(i / 5) * 0.5);
        g.add(f);
      }
    }
    if (L('music') > 0) {
      // Колонки с диффузорами
      for (const x of [-5.5, 5.5]) {
        const cab = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.5), mat(0x4a3f38, { rough: 0.8 }));
        cab.position.set(x, 0.4, 3.0); cab.castShadow = true;
        g.add(cab);
        // большой + малый диффузор
        for (const [dy, dr] of [[0.28, 0.16], [0.58, 0.09]] as Array<[number, number]>) {
          const ring = new THREE.Mesh(new THREE.TorusGeometry(dr, 0.025, 6, 16), mat(0x8a6a5a));
          ring.position.set(x, dy, 3.26);
          g.add(ring);
          const cone = new THREE.Mesh(new THREE.ConeGeometry(dr * 0.9, 0.08, 12), mat(0x2e2622, { rough: 0.7 }));
          cone.position.set(x, dy, 3.24);
          cone.rotation.x = Math.PI / 2;
          g.add(cone);
        }
      }
      for (let i = 0; i < L('music') * 2; i++) {
        const note = new THREE.Group();
        const nm = mat(C.cocoa);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), nm);
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 6), nm);
        stem.position.set(0.08, 0.15, 0);
        note.add(head, stem);
        note.position.set(-5.5 + (i % 2) * 11, 1.6 + (i % 3) * 0.4, 3.0);
        note.userData.seed = i * 1.3;
        g.add(note);
        notes.push(note);
      }
    }
    return g;
}
