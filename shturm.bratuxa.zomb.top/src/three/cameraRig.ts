import * as THREE from 'three';

let view: 'first' | 'third' = 'third';

export function setView(v: 'first' | 'third') {
  if (view !== v) {
    view = v;
    // Смена вида — телепорт камеры без сглаживания, иначе кадр прыгает через стены.
    smoothed = null;
  }
}

export function getView(): 'first' | 'third' {
  return view;
}

/** Мгновенно приклеить камеру к цели (спавн/рестарт) — без сглаживания. */
export function snapCamera() {
  smoothed = null;
}

export interface CamPose {
  x: number;
  z: number;
  yaw: number;
  pitch?: number;
  /** Присед: глаз 1-го лица ниже, голова-цель 3-го лица ниже. Без флага — как раньше. */
  crouch?: boolean;
}

export interface CamCollider {
  x: number;
  z: number;
  r: number;
}

export interface CamOpts {
  colliders?: CamCollider[];
  /** Половина размера арены (границы). */
  half?: number;
  /** dt кадра для сглаживания. Без dt — жёсткая установка. */
  dt?: number;
}

// 3-е лицо: отступ назад + правое плечо + высота. Плечо строго yaw-relative,
// иначе при повороте камера уходит вбок и герой/ствол выглядят «боком».
const THIRD_BACK = 2.2;
const THIRD_SIDE = 0.8;
const THIRD_H = 2.4;
// Голова героя: камера смотрит сюда — герой всегда в кадре, а не за кадром.
const HEAD_H = 1.5;
// Базовый наклон вниз (глаз 2.4 → голова 1.5 на 2.34м): герой по центру кадра.
const BASE_PITCH = -Math.atan2(THIRD_H - HEAD_H, Math.hypot(THIRD_BACK, THIRD_SIDE));

let smoothed: THREE.Vector3 | null = null;

/** Желаемая точка глаза в 3-м лице (без коллизии и сглаживания). */
export function thirdEye(p: CamPose): THREE.Vector3 {
  const sy = Math.sin(p.yaw);
  const cy = Math.cos(p.yaw);
  return new THREE.Vector3(
    p.x + sy * THIRD_BACK + cy * THIRD_SIDE,
    THIRD_H,
    p.z + cy * THIRD_BACK - sy * THIRD_SIDE,
  );
}

/**
 * Коллизия камеры: тянем отрезок голова→глаз, упираемся в круги препятствий,
 * границы арены и пол. Проверяем ВЕСЬ отрезок, а не только точку — иначе камера
 * проскакивает сквозь тонкие стены. Мобы здесь не участвуют специально: подходящие
 * мобы не должны дёргать камеру.
 */
export function collideEye(
  head: THREE.Vector3,
  eye: THREE.Vector3,
  colliders: CamCollider[],
  half: number,
): THREE.Vector3 {
  const out = eye.clone();
  out.y = Math.max(out.y, 0.5);
  out.x = THREE.MathUtils.clamp(out.x, -half + 0.4, half - 0.4);
  out.z = THREE.MathUtils.clamp(out.z, -half + 0.4, half - 0.4);
  const dir = new THREE.Vector3().subVectors(out, head);
  const len = dir.length();
  if (len < 1e-6) return out;
  dir.divideScalar(len);
  let t = len;
  const m = 0.45; // зазор от шкуры препятствия
  for (const c of colliders) {
    const ox = head.x - c.x;
    const oz = head.z - c.z;
    const dx = dir.x;
    const dz = dir.z;
    const a = dx * dx + dz * dz;
    if (a < 1e-9) continue;
    const b = 2 * (ox * dx + oz * dz);
    const cc = ox * ox + oz * oz - (c.r + m) * (c.r + m);
    const disc = b * b - 4 * a * cc;
    if (disc < 0) continue;
    const sq = Math.sqrt(disc);
    const t0 = (-b - sq) / (2 * a);
    const t1 = (-b + sq) / (2 * a);
    // Голова внутри круга (t0<0<t1) — прижимаемся к голове, а не проваливаемся.
    const hit = t0 > 0 ? t0 : t1 > 0 ? 0 : -1;
    if (hit >= 0 && hit < t) t = Math.max(hit - 0.1, 0.3);
  }
  if (t < len) {
    out.copy(head).addScaledVector(dir, t);
    out.y = Math.max(out.y, 0.5);
  }
  return out;
}

export function updateCamera(camera: THREE.PerspectiveCamera, p: CamPose, opts?: CamOpts) {
  // YXZ: сначала yaw, потом pitch в повёрнутой рамке — крена («завала») нет по построению.
  camera.rotation.order = 'YXZ';
  const pitch = THREE.MathUtils.clamp(p.pitch ?? 0, -1.2, 1.2);
  if (view === 'first') {
    camera.position.set(p.x, p.crouch ? 1.02 : 1.62, p.z);
    camera.rotation.set(pitch, p.yaw, 0);
    smoothed = null;
    return;
  }
  const headH = p.crouch ? 0.95 : HEAD_H;
  const head = new THREE.Vector3(p.x, headH, p.z);
  const want = collideEye(head, thirdEye(p), opts?.colliders ?? [], opts?.half ?? 21);
  const dt = opts?.dt;
  if (dt === undefined || dt <= 0 || !smoothed) {
    smoothed = want.clone();
  } else {
    const distWant = want.distanceTo(head);
    const distSm = smoothed.distanceTo(head);
    if (distWant < distSm) {
      // Стена: внутрь — резко, иначе пролетаем сквозь стену на сглаживании.
      smoothed.copy(want);
    } else {
      // Наружу — плавно, без рывков.
      const k = 1 - Math.exp(-10 * dt);
      smoothed.lerp(want, k);
    }
  }
  camera.position.copy(smoothed);
  camera.rotation.set(BASE_PITCH + pitch, p.yaw, 0);
}
