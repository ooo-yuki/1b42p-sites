import * as THREE from 'three';
import { C, box, cyl, sph, mat } from '../palette';

// Статика мира: земля, деревья, облака (дрейф), забор, фонари, дорога.
export interface Environment {
  group: THREE.Group;
  update: (t: number) => void;
}

export function buildEnvironment(): Environment {
  const g = new THREE.Group();

  // Земля — большой кремовый диск + зелёная лужайка
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(30, 40),
    mat(0xead9c2, { rough: 1 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  g.add(ground);
  const lawn = new THREE.Mesh(
    new THREE.CircleGeometry(13, 32),
    mat(0xcdeac0, { rough: 1 }),
  );
  lawn.rotation.x = -Math.PI / 2;
  lawn.position.y = 0.01;
  lawn.receiveShadow = true;
  g.add(lawn);

  // Дорога (серая лента + пунктир)
  g.add(box(40, 0.04, 3.2, 0xcfc4b8, 0, 0.02, 14.5));
  for (let i = -9; i <= 9; i += 2) {
    g.add(box(0.9, 0.05, 0.15, 0xfff6ea, i * 2, 0.03, 14.5));
  }

  // Деревья по периметру
  const treePos: Array<[number, number, number]> = [
    [-10, -4, 1], [10.5, -3, 1.3], [-8, 6, 0.9], [9, 9, 1.1], [-12, 2, 1.2], [12, 4, 0.8],
  ];
  for (const [x, z, s] of treePos) {
    const tree = new THREE.Group();
    tree.position.set(x, 0, z);
    tree.add(cyl(0.18 * s, 0.24 * s, 1.4 * s, C.trunk, 0, 0.7 * s, 0, 7));
    tree.add(sph(0.9 * s, C.leaf, 0, 1.9 * s, 0));
    tree.add(sph(0.6 * s, C.leafDark, 0.55 * s, 1.5 * s, 0.3 * s));
    tree.add(sph(0.5 * s, C.leaf, -0.5 * s, 1.6 * s, -0.2 * s));
    g.add(tree);
  }

  // Облака — плывут (имена для update)
  const clouds = new THREE.Group();
  clouds.name = 'clouds';
  const cloudDefs: Array<[number, number, number]> = [[-8, 12, -8], [6, 14, -10], [0, 11, 8]];
  for (const [x, y, z] of cloudDefs) {
    const cl = new THREE.Group();
    cl.position.set(x, y, z);
    const cm = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, flatShading: true });
    for (const [ox, s] of [[0, 1], [0.9, 0.7], [-0.9, 0.75]] as Array<[number, number]>) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(s, 10, 8), cm);
      puff.position.x = ox;
      puff.scale.y = 0.6;
      cl.add(puff);
    }
    clouds.add(cl);
  }
  g.add(clouds);

  // Забор по бокам
  for (const side of [-1, 1]) {
    for (let i = 0; i < 7; i++) {
      g.add(box(0.14, 0.9, 0.14, 0xffffff, side * 11.5, 0.45, -6 + i * 2));
    }
    g.add(box(0.08, 0.12, 13, 0xffffff, side * 11.5, 0.75, 0));
  }

  // Фонари (светятся)
  for (const [x, z] of [[-3.5, 7.5], [3.5, 7.5]] as Array<[number, number]>) {
    g.add(cyl(0.07, 0.09, 2.4, C.cocoa, x, 1.2, z, 8));
    const lamp = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 10, 8),
      new THREE.MeshStandardMaterial({ color: 0xffe6a3, emissive: 0xffc978, emissiveIntensity: 1.1, roughness: 0.5, flatShading: true }),
    );
    lamp.position.set(x, 2.55, z);
    g.add(lamp);
    g.add(new THREE.PointLight(0xffc978, 6, 9, 2));
    const pl = g.children[g.children.length - 1] as THREE.PointLight;
    pl.position.set(x, 2.55, z);
  }

  return {
    group: g,
    update: (t: number) => {
      clouds.children.forEach((cl, i) => {
        cl.position.x += Math.sin(t * 0.05 + i) * 0.002;
        if (cl.position.x > 16) cl.position.x = -16;
      });
    },
  };
}
