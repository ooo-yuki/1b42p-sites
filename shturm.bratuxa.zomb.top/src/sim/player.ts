export const MAX_HP = 160;
export const WALK_SPEED = 4.6;
export const SPRINT_SPEED = 7.8;
export interface PlayerState { x: number; z: number; vx: number; vz: number; hp: number; stamina: number; yaw: number; }
export interface InputState { fwd: number; strafe: number; sprint: boolean; dt: number; }
export function createPlayer(): PlayerState { return { x: 0, z: 0, vx: 0, vz: 0, hp: MAX_HP, stamina: 43, yaw: 0 }; }
export function movePlayer(p: PlayerState, inp: InputState, dt: number) {
  const wantSprint = inp.sprint && p.stamina > 1 && inp.fwd !== 0;
  const speed = wantSprint ? SPRINT_SPEED : WALK_SPEED;
  if (wantSprint) p.stamina = Math.max(0, p.stamina - 10 * dt);
  else p.stamina = Math.min(43, p.stamina + 12 * dt);
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
