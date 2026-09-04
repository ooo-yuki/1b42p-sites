import * as THREE from 'three';
import { C, mat, shortKeys, lvl, type Levels } from '../palette';

// Декор меню: seasonal — горшки, recipes — доска, asian — фонарики,
// european — флажки, american — шарики. Количество = уровень.
export function buildMenuDecor(levels: Levels): THREE.Group {
    const g = new THREE.Group();
    const S = shortKeys(levels);
    const L = (id: string) => lvl(S, id);
    const cols = [0xf6a5b8, 0xffb347, 0xd9c0e8, 0xffffff, 0xff7b54];
    for (let i = 0; i < L('seasonal'); i++) {
      const px = -3.5 + i * 1.4;
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.17, 0.3, 8), mat(0xb07a4a));
      pot.position.set(px, 0.15, 3.8); pot.castShadow = true;
      const fl = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), mat(cols[i % 5]));
      fl.position.set(px, 0.48, 3.8); fl.castShadow = true;
      g.add(pot, fl);
    }
    if (L('recipes') > 0) {
      const cv = document.createElement('canvas');
      cv.width = 128; cv.height = 160;
      const ctx = cv.getContext('2d')!;
      ctx.fillStyle = '#4a3f38'; ctx.fillRect(0, 0, 128, 160);
      ctx.fillStyle = '#ffe6a3'; ctx.font = 'bold 15px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('MENU', 64, 24);
      const dishes = ['soup', 'cake', 'sushi', 'pie', 'taco'];
      for (let i = 0; i < L('recipes'); i++) {
        ctx.fillStyle = '#ffe6a3'; ctx.fillRect(14, 36 + i * 24, 100, 14);
        ctx.fillStyle = '#4a3f38'; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
        ctx.fillText(dishes[i % dishes.length], 18, 47 + i * 24);
      }
      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      const bd = new THREE.Group();
      bd.position.set(-4.4, 0, 3.2); bd.rotation.y = 0.5;
      const board = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.1), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }));
      board.position.y = 1.1;
      bd.add(board);
      for (const x of [-0.35, 0.35]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.1, 0.07), mat(C.woodDark));
        leg.position.set(x, 0.55, -0.05);
        bd.add(leg);
      }
      g.add(bd);
    }
    for (let i = 0; i < L('asian'); i++) {
      const lan = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8),
        new THREE.MeshStandardMaterial({ color: 0xe85454, emissive: 0xff7b54, emissiveIntensity: 0.5, roughness: 0.7, flatShading: true }));
      lan.position.set(-2.5 + i * 1.3, 3.1, 3.6);
      lan.scale.y = 1.2;
      g.add(lan);
    }
    for (let i = 0; i < L('european'); i++) {
      for (let f = 0; f < 6; f++) {
        const flag = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.18, 4), mat([0x9fd8c9, 0xffffff, 0xf6a5b8][(f + i) % 3]));
        flag.position.set(-2.5 + f, 2.9 - i * 0.3 - Math.sin((f / 5) * Math.PI) * 0.25, 4.4);
        flag.rotation.x = Math.PI;
        g.add(flag);
      }
    }
    for (let i = 0; i < L('american'); i++) {
      const bal = new THREE.Mesh(new THREE.SphereGeometry(0.26, 10, 8), mat([0xbfe3ff, 0xffffff, 0xf6a5b8][i % 3], { rough: 0.6 }));
      bal.position.set(3.2 + (i % 3) * 0.7, 2.2 + Math.floor(i / 3) * 0.6, 4.2);
      bal.scale.y = 1.2;
      const str = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.4, 5), mat(C.cocoa));
      str.position.set(bal.position.x, 1.2, 4.2);
      g.add(bal, str);
    }
    return g;
}

// Декор промо: ads — билборд, flyer — штендер+листовки, music — колонки+нотки.
// Парящие нотки складываются в notes — их анимирует сцена.
export function buildPromoDecor(levels: Levels, notes: THREE.Group[]): THREE.Group {
    const g = new THREE.Group();
    const S = shortKeys(levels);
    const L = (id: string) => lvl(S, id);
    if (L('ads') > 0) {
      const s = 1 + L('ads') * 0.22;
      const bb = new THREE.Group();
      bb.position.set(-7, 0, 12); bb.rotation.y = 0.25;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.4 * s, 8), mat(C.cocoa));
      leg.position.y = 1.2 * s;
      bb.add(leg);
      const cv = document.createElement('canvas');
      cv.width = 256; cv.height = 128;
      const ctx = cv.getContext('2d')!;
      ctx.fillStyle = '#fff6ea'; ctx.fillRect(0, 0, 256, 128);
      ctx.fillStyle = '#8a6a5a'; ctx.font = 'bold 40px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('SKITONS', 128, 58);
      ctx.fillStyle = '#e85454'; ctx.font = 'bold 26px system-ui';
      ctx.fillText('yummy!' + '!'.repeat(Math.min(3, L('ads'))), 128, 96);
      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(2.6 * s, 1.3 * s),
        new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, side: THREE.DoubleSide }));
      panel.position.y = 2.4 * s + 0.65 * s;
      bb.add(panel);
      g.add(bb);
    }
    if (L('flyer') > 0) {
      const st = new THREE.Group();
      st.position.set(2.2, 0, 10.5); st.rotation.y = -0.3;
      for (const r of [-0.18, 0.18]) {
        const p = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.05), mat(0xfff6ea));
        p.position.set(0, 0.45, r); p.rotation.x = r > 0 ? -0.2 : 0.2;
        st.add(p);
      }
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
      for (const x of [-5.5, 5.5]) {
        const sp = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.5), mat(0x4a3f38, { rough: 0.8 }));
        sp.position.set(x, 0.4, 3.0); sp.castShadow = true;
        g.add(sp);
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
