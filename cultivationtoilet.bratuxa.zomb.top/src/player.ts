// Контроллер от первого лица: WASD, мышь через pointer lock, коллизии по клеткам карты.
import * as THREE from 'three';
import { CELL, type World } from './world';

const EYE = 1.6;
const RADIUS = 0.32;
const SPEED = 3.2;
const RUN = 1.7;
const SENS = 0.0022;

export class Player {
  pos = new THREE.Vector3(0, EYE, 2); // глаза
  yaw = 0; // куда смотрим (рад); 0 — взгляд на -z, PI — взгляд на +z
  pitch = 0;
  bob = 0;
  moving = false;

  private keys: Record<string, boolean> = {};
  private enabled = false;
  private readonly onKeyDown = (e: KeyboardEvent) => {
    this.keys[e.code] = true;
    if (['Space', 'Tab', 'KeyE'].includes(e.code)) e.preventDefault();
  };
  private readonly onKeyUp = (e: KeyboardEvent) => { this.keys[e.code] = false; };
  private readonly onMouse = (e: MouseEvent) => {
    if (!this.enabled) return;
    this.yaw -= e.movementX * SENS;
    this.pitch = Math.max(-1.45, Math.min(1.45, this.pitch - e.movementY * SENS));
  };
  private readonly onLockChange = () => {
    this.enabled = document.pointerLockElement === this.lockTarget;
  };

  constructor(private world: World, private lockTarget: HTMLElement) {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('mousemove', this.onMouse);
    document.addEventListener('pointerlockchange', this.onLockChange);
  }

  dispose(): void {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('mousemove', this.onMouse);
    document.removeEventListener('pointerlockchange', this.onLockChange);
  }

  get locked(): boolean { return this.enabled; }

  async lock(): Promise<void> {
    try {
      await this.lockTarget.requestPointerLock();
    } catch { /* браузер может отказать */ }
  }

  unlock(): void {
    if (document.pointerLockElement) document.exitPointerLock();
    this.enabled = false;
  }

  reset(spawn: THREE.Vector3): void {
    this.pos.copy(spawn);
    this.pos.y = EYE;
    this.yaw = 0;
    this.pitch = -0.45;
    this.keys = {};
  }

  /** Есть ли клетка под точкой и не упирается ли игрок в унитаз. */
  private canStand(x: number, z: number): boolean {
    const pts: [number, number][] = [
      [x - RADIUS, z - RADIUS],
      [x + RADIUS, z - RADIUS],
      [x - RADIUS, z + RADIUS],
      [x + RADIUS, z + RADIUS],
    ];
    for (const [px, pz] of pts) {
      const cx = Math.round(px / CELL);
      const cz = Math.round(pz / CELL);
      if (!this.world.hasCell(cx, cz)) return false;
    }
    const t = this.world.toilet?.box;
    if (t) {
      const inX = x + RADIUS > t.x0 && x - RADIUS < t.x1;
      const inZ = z + RADIUS > t.z0 && z - RADIUS < t.z1;
      if (inX && inZ) return false;
    }
    return true;
  }

  /** Шаг с раздельной проверкой осей — скольжение вдоль стен. */
  update(dt: number, blocked: boolean): void {
    this.moving = false;
    if (this.enabled && !blocked) {
      let fx = 0;
      let str = 0;
      if (this.keys.KeyW || this.keys.ArrowUp) fx += 1;
      if (this.keys.KeyS || this.keys.ArrowDown) fx -= 1;
      if (this.keys.KeyA || this.keys.ArrowLeft) str -= 1;
      if (this.keys.KeyD || this.keys.ArrowRight) str += 1;
      if (fx || str) {
        const len = Math.hypot(fx, str);
        fx /= len;
        str /= len;
        const run = this.keys.ShiftLeft || this.keys.ShiftRight ? RUN : 1;
        const sp = SPEED * run * dt;
        const sin = Math.sin(this.yaw);
        const cos = Math.cos(this.yaw);
        // вперёд по направлению взгляда (по горизонтали), вбок — поперёк
        const dx = (-sin * fx + cos * str) * sp;
        const dz = (-cos * fx - sin * str) * sp;
        if (this.canStand(this.pos.x + dx, this.pos.z)) this.pos.x += dx;
        if (this.canStand(this.pos.x, this.pos.z + dz)) this.pos.z += dz;
        this.moving = true;
      }
    }
    // лёгкое покачивание головы при ходьбе
    const target = this.moving ? 1 : 0;
    this.bob += (target - this.bob) * Math.min(1, dt * 8);
    const t = performance.now() / 1000;
    this.pos.y = EYE + Math.sin(t * 9) * 0.035 * this.bob;
  }

  /** Применить позицию/поворот к камере. */
  apply(camera: THREE.Camera): void {
    camera.position.copy(this.pos);
    camera.rotation.order = 'YXZ';
    camera.rotation.set(this.pitch, this.yaw, 0);
  }

  /** Смотрит ли игрок в направлении точки (для тестов и подсказок). */
  forward(): THREE.Vector3 {
    return new THREE.Vector3(
      -Math.sin(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch),
      -Math.cos(this.yaw) * Math.cos(this.pitch),
    );
  }
}


