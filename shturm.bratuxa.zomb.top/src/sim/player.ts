export const MAX_HP = 160;
export const WALK_SPEED = 4.6;
export const SPRINT_SPEED = 7.8;
// Прыжок/присед: скорость отрыва, гравитация, цена прыжка (стамина),
// скорость в приседе, высота приседа для уворота.
export const JUMP_V = 5.4;
export const GRAV = 14;
export const JUMP_COST = 6;
export const CROUCH_SPEED = 2.3;
export const DODGE_H = 0.9;
export interface PlayerState { x: number; z: number; vx: number; vz: number; hp: number; stamina: number; yaw: number; y: number; vy: number; crouch: boolean; }
export interface InputState { fwd: number; strafe: number; sprint: boolean; dt: number; jump?: boolean; crouch?: boolean; }
export function createPlayer(): PlayerState { return { x: 0, z: 0, vx: 0, vz: 0, hp: MAX_HP, stamina: 43, yaw: 0, y: 0, vy: 0, crouch: false }; }
export function movePlayer(p: PlayerState, inp: InputState, dt: number) {
  // Присед — из входа каждый тик; гасит спринт.
  p.crouch = inp.crouch === true;
  const wantSprint = inp.sprint && !p.crouch && p.stamina > 1 && inp.fwd !== 0;
  const speed = p.crouch ? CROUCH_SPEED : wantSprint ? SPRINT_SPEED : WALK_SPEED;
  if (wantSprint) p.stamina = Math.max(0, p.stamina - 10 * dt);
  else p.stamina = Math.min(43, p.stamina + 12 * dt);
  // Прыжок только с земли: стамина платит JUMP_COST.
  const onGround = p.y <= 0.001 && p.vy <= 0.001;
  if (inp.jump === true && onGround) {
    p.vy = JUMP_V;
    p.stamina = Math.max(0, p.stamina - JUMP_COST);
  }
  // Вертикаль: гравитация + приземление на 0. Всегда считается, даже стоя на месте.
  p.vy -= GRAV * dt;
  p.y += p.vy * dt;
  if (p.y <= 0) { p.y = 0; if (p.vy < 0) p.vy = 0; }
  // Движение строго относительно обзора (yaw): W — куда смотрит камера,
  // D — вправо от неё. Было: мировые оси, W всегда вёз на -Z мира.
  const ilen = Math.hypot(inp.fwd, inp.strafe);
  if (ilen < 1e-6) { p.vx = 0; p.vz = 0; return; }
  const n = Math.max(1, ilen);
  const nf = inp.fwd / n, ns = inp.strafe / n;
  const fx = -Math.sin(p.yaw), fz = -Math.cos(p.yaw);
  const rx = Math.cos(p.yaw), rz = -Math.sin(p.yaw);
  p.vx = (fx * nf + rx * ns) * speed; p.vz = (fz * nf + rz * ns) * speed;
  p.x += p.vx * dt; p.z += p.vz * dt;
}
