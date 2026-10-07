// Генерация карты из клеток 2×2 м. Материалы процедурные (canvas-текстуры) — потом заменим на твой файл.
import * as THREE from 'three';
import type { Cell } from './api';

export const CELL = 2; // клетка 2×2 м
export const WALL_H = 2.6;
const DOOR_W = 1.3; // проём между клетками

export interface Toilet {
  group: THREE.Group;
  box: { x0: number; z0: number; x1: number; z1: number }; // AABB для коллизии ног
  anim: number; // 0..1 — прогресс смыва
}

export interface World {
  scene: THREE.Scene;
  root: THREE.Group;
  toilet: Toilet | null;
  spawn: THREE.Vector3;
  rebuild(cells: Cell[]): void;
  hasCell(x: number, z: number): boolean;
}

function canvasTex(draw: (g: CanvasRenderingContext2D, s: number) => void, size = 128): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  draw(g, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

/** Пол: кафель клетки 2×2 м с потёртостями. */
function floorTex(): THREE.CanvasTexture {
  return canvasTex((g, s) => {
    g.fillStyle = '#39424c';
    g.fillRect(0, 0, s, s);
    const q = s / 2;
    g.fillStyle = '#414b57';
    g.fillRect(2, 2, q - 4, q - 4);
    g.fillRect(q + 2, q + 2, q - 4, q - 4);
    g.fillStyle = '#343d47';
    g.fillRect(q + 2, 2, q - 4, q - 4);
    g.fillRect(2, q + 2, q - 4, q - 4);
    g.strokeStyle = 'rgba(12,16,20,.9)';
    g.lineWidth = 3;
    g.strokeRect(0, 0, s, s);
    g.beginPath();
    g.moveTo(q, 0); g.lineTo(q, s);
    g.moveTo(0, q); g.lineTo(s, q);
    g.stroke();
    // потёртости и грязь
    for (let i = 0; i < 26; i++) {
      g.fillStyle = `rgba(0,0,0,${0.03 + Math.random() * 0.07})`;
      g.beginPath();
      g.ellipse(Math.random() * s, Math.random() * s, 3 + Math.random() * 14, 2 + Math.random() * 9, Math.random() * 3, 0, 7);
      g.fill();
    }
  });
}

/** Стена: штукатурка с плиточным плинтусом. */
function wallTex(): THREE.CanvasTexture {
  return canvasTex((g, s) => {
    g.fillStyle = '#4a5460';
    g.fillRect(0, 0, s, s);
    for (let i = 0; i < 220; i++) {
      g.fillStyle = `rgba(${Math.random() > 0.5 ? '255,255,255' : '0,0,0'},${Math.random() * 0.05})`;
      g.fillRect(Math.random() * s, Math.random() * s, 2 + Math.random() * 6, 2 + Math.random() * 6);
    }
    // плитка на нижней половине
    g.fillStyle = '#3f5a63';
    g.fillRect(0, s * 0.55, s, s * 0.45);
    g.strokeStyle = 'rgba(10,14,18,.7)';
    g.lineWidth = 2;
    for (let x = 0; x <= s; x += s / 4) {
      g.beginPath(); g.moveTo(x, s * 0.55); g.lineTo(x, s); g.stroke();
    }
    for (let y = s * 0.55; y <= s; y += s / 8) {
      g.beginPath(); g.moveTo(0, y); g.lineTo(s, y); g.stroke();
    }
    g.fillStyle = 'rgba(0,0,0,.25)';
    g.fillRect(0, s * 0.55 - 3, s, 3);
  }, 256);
}

function ceilingTex(): THREE.CanvasTexture {
  return canvasTex((g, s) => {
    g.fillStyle = '#2b323a';
    g.fillRect(0, 0, s, s);
    g.strokeStyle = 'rgba(0,0,0,.4)';
    g.lineWidth = 4;
    g.strokeRect(0, 0, s, s);
    for (let i = 0; i < 40; i++) {
      g.fillStyle = `rgba(0,0,0,${Math.random() * 0.12})`;
      g.fillRect(Math.random() * s, Math.random() * s, 10, 10);
    }
  });
}

/** Унитаз из простых примитивов: бачок, чаша, крышка, кнопка. */
function buildToilet(): Toilet {
  const group = new THREE.Group();
  const white = new THREE.MeshStandardMaterial({ color: 0xe9eef3, roughness: 0.35, metalness: 0.05 });
  const dark = new THREE.MeshStandardMaterial({ color: 0xc3ccd4, roughness: 0.5 });
  const water = new THREE.MeshStandardMaterial({ color: 0x5ad6c0, roughness: 0.2, metalness: 0.1, emissive: 0x123f38, emissiveIntensity: 0.6 });

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.19, 0.38, 20), white);
  base.position.y = 0.19;
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.24, 0.2, 24), white);
  bowl.position.y = 0.47;
  const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.06, 24), dark);
  seat.position.y = 0.59;
  const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.07, 20), water);
  hole.position.y = 0.6;
  const tank = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.62, 0.2), white);
  tank.position.set(0, 0.72, 0.36);
  const lid = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.05, 0.24), dark);
  lid.position.set(0, 1.05, 0.36);
  const button = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 16), dark);
  button.position.set(0, 1.09, 0.36);

  group.add(base, bowl, seat, hole, tank, lid, button);
  group.name = 'toilet';
  // спина (бачок) смотрит в +z, игрок подходит к унитазу с -z
  return {
    group,
    box: { x0: -0.34, z0: -0.3, x1: 0.34, z1: 0.46 },
    anim: 0,
  };
}

const DIRECTIONS = [
  { dir: 'n', dx: 0, dz: -1 },
  { dir: 's', dx: 0, dz: 1 },
  { dir: 'e', dx: 1, dz: 0 },
  { dir: 'w', dx: -1, dz: 0 },
] as const;

export function createWorld(): World {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0e13);
  scene.fog = new THREE.Fog(0x0a0e13, 6, 26);

  const root = new THREE.Group();
  scene.add(root);

  const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTex(), roughness: 0.92 });
  const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTex(), roughness: 0.95 });
  const ceilMaterial = new THREE.MeshStandardMaterial({ map: ceilingTex(), roughness: 1 });

  const floorGeo = new THREE.PlaneGeometry(CELL, CELL);
  const ceilGeo = new THREE.PlaneGeometry(CELL, CELL);
  const wallGeo = new THREE.BoxGeometry(1, WALL_H, 0.12);
  for (const g of [floorGeo, ceilGeo, wallGeo]) g.userData.shared = true;
  const bulbGeo = new THREE.BoxGeometry(0.34, 0.06, 0.34);
  bulbGeo.userData.shared = true;
  const bulbMat = new THREE.MeshStandardMaterial({ color: 0xfff6dd, emissive: 0xfff0cf, emissiveIntensity: 0.7 });
  const markMat = new THREE.MeshBasicMaterial({ color: 0x5ad6c0, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
  const markGeo = new THREE.RingGeometry(0.4, 0.55, 32);
  markGeo.userData.shared = true;

  scene.add(new THREE.AmbientLight(0xaebccb, 1.1));
  const hemi = new THREE.HemisphereLight(0x8fa6bd, 0x14181d, 0.7);
  scene.add(hemi);

  let toilet: Toilet | null = null;
  let spawn = new THREE.Vector3(0, 1.6, 2);
  let cells: Cell[] = [];

  const world: World = {
    scene,
    root,
    get toilet() { return toilet; },
    get spawn() { return spawn; },
    hasCell(x, z) { return cells.some((c) => c.x === x && c.z === z); },
    rebuild(next) {
      cells = next.map((c) => ({ ...c }));
      toilet = null;
      while (root.children.length) {
        const c = root.children.pop()!;
        c.traverse((o) => {
          const m = o as THREE.Mesh;
          if (m.geometry && !m.geometry.userData.shared) m.geometry.dispose();
        });
      }

      for (const cell of cells) {
        const cx = cell.x * CELL;
        const cz = cell.z * CELL;

        const floor = new THREE.Mesh(floorGeo, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(cx, 0, cz);
        root.add(floor);

        const ceil = new THREE.Mesh(ceilGeo, ceilMaterial);
        ceil.rotation.x = Math.PI / 2;
        ceil.position.set(cx, WALL_H, cz);
        root.add(ceil);

        // стены: сосед есть → проём (притолоки строит только одна из двух клеток — иначе дубли);
        // соседа нет → глухая стена на всю клетку
        for (const d of DIRECTIONS) {
          const has = world.hasCell(cell.x + d.dx, cell.z + d.dz);
          const primary = d.dir === 'n' || d.dir === 'w';
          if (has && !primary) continue;
          const alongX = d.dx === 0; // стена север/юг тянется вдоль X
          const jamb = (CELL - DOOR_W) / 2;
          const pieces: { offset: number; width: number }[] = has
            ? [
                { offset: -(CELL / 2 - jamb / 2), width: jamb },
                { offset: CELL / 2 - jamb / 2, width: jamb },
              ]
            : [{ offset: 0, width: CELL }];
          for (const p of pieces) {
            const w = new THREE.Mesh(wallGeo, wallMaterial);
            w.scale.x = p.width;
            if (alongX) {
              w.position.set(cx + p.offset, WALL_H / 2, cz + (d.dz * CELL) / 2);
            } else {
              w.rotation.y = Math.PI / 2;
              w.position.set(cx + (d.dx * CELL) / 2, WALL_H / 2, cz + p.offset);
            }
            root.add(w);
          }
        }

        // лампочка как источник света — только в ключевых клетках (иначе 20 ламп тормозят рендер)
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.set(cx, WALL_H - 0.06, cz);
        root.add(bulb);
        if (cell.kind !== 'room') {
          const lamp = new THREE.PointLight(0xfff0cf, 7, 7, 2);
          lamp.position.set(cx, WALL_H - 0.3, cz);
          root.add(lamp);
        }

        if (cell.kind === 'toilet') {
          toilet = buildToilet();
          toilet.group.position.set(cx, 0, cz + 0.5); // унитаз спиной к южной стене клетки
          root.add(toilet.group);
          const b = toilet.box;
          toilet.box = { x0: cx + b.x0, z0: cz + 0.5 + b.z0, x1: cx + b.x1, z1: cz + 0.5 + b.z1 };
        }
        if (cell.kind === 'spawn') {
          spawn = new THREE.Vector3(cx, 1.6, cz);
          const mark = new THREE.Mesh(markGeo, markMat);
          mark.rotation.x = -Math.PI / 2;
          mark.position.set(cx, 0.02, cz);
          root.add(mark);
        }
      }
    },
  } as World;

  return world;
}

