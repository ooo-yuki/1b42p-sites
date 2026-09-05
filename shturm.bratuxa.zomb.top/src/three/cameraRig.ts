import * as THREE from 'three';

let view: 'first' | 'third' = 'third';

export function setView(v: 'first' | 'third') {
  view = v;
}

export function getView(): 'first' | 'third' {
  return view;
}

export function updateCamera(camera: THREE.PerspectiveCamera, p: { x: number; z: number; yaw: number }) {
  if (view === 'first') camera.position.set(p.x, 1.62, p.z);
  else camera.position.set(p.x + Math.sin(p.yaw) * 2.2 + 0.8, 2.4, p.z + Math.cos(p.yaw) * 2.2);
  camera.rotation.set(0, p.yaw, 0);
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyV') setView(view === 'first' ? 'third' : 'first');
  });
}
