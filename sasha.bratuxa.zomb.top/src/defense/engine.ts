import { PATH, WAVES, ENEMIES, TURRETS, CARDS } from './content';
import type { Cell, WaveDef, EnemyDef, TurretDef, CardDef } from './content';

export { PATH, WAVES, ENEMIES, TURRETS, CARDS };
export type { Cell, WaveDef, EnemyDef, TurretDef, CardDef };

export interface Unit { kind: string; seg: number; pos: number; hp: number; maxHp: number; speed: number; reward: number; dead?: boolean }
export interface Turret { x: number; y: number; kind: string; cd: number }

export interface GameState { wave: number; lives: number; coins: number; units: Unit[]; turrets: Turret[]; buffs: string[]; over: boolean; stars: number; dmgMul?: number; rateMul?: number; pierce?: boolean; pugs?: number; saleMul?: number }

export function createGame(): GameState {
  return { wave: 0, lives: 10, coins: 200, units: [], turrets: [], buffs: [], over: false, stars: 0 };
}

export function placeTurret(g: GameState, x: number, y: number, kind: string): boolean {
  const t = TURRETS[kind];
  if (!t || g.coins < t.cost) return false;
  if (PATH.some((c) => c.x === x && c.y === y)) return false;
  if (g.turrets.some((u) => u.x === x && u.y === y)) return false;
  if (g.turrets.length >= 12) return false;
  g.coins -= t.cost;
  g.turrets.push({ x, y, kind, cd: 0 });
  return true;
}

export function sellTurret(g: GameState, i: number): void {
  const [t] = g.turrets.splice(i, 1);
  if (t) g.coins += Math.floor(TURRETS[t.kind].cost * 0.7);
}

export function spawnWave(g: GameState, w: number): void {
  const def = WAVES[w];
  for (let i = 0; i < def.count; i++) {
    let kind = 'zevaka';
    if (def.tankEvery > 0 && i % def.tankEvery === def.tankEvery - 1) kind = 'zanuda';
    if (def.runnerEvery > 0 && i % def.runnerEvery === def.runnerEvery - 1) kind = 'sprinter';
    const e = ENEMIES[kind];
    g.units.push({ kind, seg: 0, pos: -i * 0.5, hp: e.hp * def.hpMul, maxHp: e.hp * def.hpMul, speed: e.speed * def.speed, reward: e.reward });
  }
  if (w === 9) {
    const e = ENEMIES.director;
    g.units.push({ kind: 'director', seg: 0, pos: -def.count * 0.5 - 2, hp: e.hp * def.hpMul, maxHp: e.hp * def.hpMul, speed: e.speed * def.speed, reward: e.reward });
  }
}

function cellOf(u: Unit): { x: number; y: number } {
  const a = PATH[Math.max(0, Math.min(u.seg, PATH.length - 1))];
  const b = PATH[Math.min(u.seg + 1, PATH.length - 1)];
  return { x: a.x + (b.x - a.x) * u.pos, y: a.y + (b.y - a.y) * u.pos };
}

function distToSeg(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  let t = len2 === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + dx * t;
  const cy = ay + dy * t;
  return Math.hypot(px - cx, py - cy);
}

function damage(g: GameState, u: Unit, dmg: number): void {
  if (u.dead) return;
  u.hp -= dmg;
  if (u.hp <= 0) {
    u.dead = true;
    g.coins += u.reward;
  }
}

export function applyCard(g: GameState, id: string): void {
  const n = g.buffs.filter((b) => b === id).length;
  const k = 0.7 ** n;
  g.buffs.push(id);
  if (id === 'rate') g.rateMul = (g.rateMul || 1) + 0.3 * k;
  if (id === 'dmg') g.dmgMul = (g.dmgMul || 1) + 0.4 * k;
  if (id === 'pierce') g.pierce = true;
  if (id === 'pugs') g.pugs = 5;
  if (id === 'sale') g.saleMul = 0.75;
  if (id === 'repair') g.lives = Math.min(10, g.lives + 3);
}

export function offerCards(_g: GameState): string[] {
  const ids = Object.keys(CARDS);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids.slice(0, 3);
}

export function finishWave(g: GameState, lost: number): void {
  g.stars = lost === 0 ? 3 : lost <= 3 ? 2 : 1;
}

export function tick(g: GameState): void {
  const dt = 0.1;
  const dmgMul = g.dmgMul || 1;
  const rateMul = g.rateMul || 1;
  // Движение: pos += speed*dt, переход на следующий сегмент; дошедшие до штаба снимают жизнь.
  for (const u of g.units) {
    if (u.dead) continue;
    u.pos += u.speed * dt;
    while (u.pos >= 1) {
      u.pos -= 1;
      u.seg += 1;
    }
    if (u.seg >= PATH.length - 1) {
      u.dead = true;
      g.lives -= 1;
      if (g.lives <= 0) g.over = true;
    }
  }
  g.units = g.units.filter((u) => !u.dead || u.hp <= 0);
  // Стрельба: ближайший в range; scarlet бьёт по линии «турель→цель» (1 клетка, с pierce — 2).
  for (const t of g.turrets) {
    const def = TURRETS[t.kind];
    if (!def) continue;
    t.cd -= dt;
    if (t.cd > 0) continue;
    let best: Unit | null = null;
    let bestD = Infinity;
    for (const u of g.units) {
      if (u.dead || u.hp <= 0) continue;
      const c = cellOf(u);
      const d = Math.hypot(c.x - t.x, c.y - t.y);
      if (d <= def.range && d < bestD) {
        bestD = d;
        best = u;
      }
    }
    if (!best) continue;
    t.cd = 1 / (def.rate * rateMul);
    const dmg = def.dmg * dmgMul;
    if (t.kind === 'scarlet') {
      const tc = cellOf(best);
      const radius = g.pierce ? 2 : 1;
      const targets = g.units.filter((u) => {
        if (u.dead || u.hp <= 0) return false;
        const c = cellOf(u);
        return distToSeg(c.x, c.y, t.x, t.y, tc.x, tc.y) <= radius;
      });
      for (const u of targets) damage(g, u, dmg);
    } else {
      damage(g, best, dmg);
    }
  }
}
