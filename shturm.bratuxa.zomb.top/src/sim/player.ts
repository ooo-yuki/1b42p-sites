export interface PlayerState { x: number; z: number; vx: number; vz: number; hp: number; stamina: number; yaw: number; }
export interface InputState { fwd: number; strafe: number; sprint: boolean; dt: number; }
export function createPlayer(): PlayerState { return { x: 0, z: 0, vx: 0, vz: 0, hp: 100, stamina: 43, yaw: 0 }; }
export function movePlayer(p: PlayerState, inp: InputState, dt: number) {
  const wantSprint = inp.sprint && p.stamina > 1 && inp.fwd !== 0;
  const speed = wantSprint ? 7 : 4;
  if (wantSprint) p.stamina = Math.max(0, p.stamina - 10 * dt);
  else p.stamina = Math.min(43, p.stamina + 12 * dt);
  const len = Math.hypot(inp.fwd, inp.strafe) || 1;
  p.vx = (inp.strafe / len) * speed; p.vz = (-inp.fwd / len) * speed;
  p.x += p.vx * dt; p.z += p.vz * dt;
}
