import { PATH, WAVES, WAVE_NAMES, ENEMIES, TURRETS, CARDS, ARSENAL_DMG_MUL, CARD_GATES, MEDAL_GATES } from './content';
import type { Cell, WaveDef, EnemyDef, TurretDef, CardDef } from './content';

export { PATH, WAVES, WAVE_NAMES, ENEMIES, TURRETS, CARDS, CARD_GATES, MEDAL_GATES };
export type { Cell, WaveDef, EnemyDef, TurretDef, CardDef };

export interface Unit { kind: string; seg: number; pos: number; hp: number; maxHp: number; speed: number; reward: number; regen?: number; dead?: boolean }
export interface Turret { x: number; y: number; kind: string; cd: number }

export interface GameState { wave: number; lives: number; coins: number; units: Unit[]; turrets: Turret[]; buffs: string[]; over: boolean; stars: number; medals: number; fearT?: number; liveT?: number; slowT?: number; maxLives?: number; dmgMul?: number; rateMul?: number; pierce?: boolean; pugs?: number; saleMul?: number }

export function medalMult(medals: number): number {
  return 1 + 0.25 * Math.max(0, Math.floor(medals));
}

export function createGame(): GameState {
  return { wave: 0, lives: 10, coins: 200, units: [], turrets: [], buffs: [], over: false, stars: 0, medals: 0 };
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

export function endlessWave(n: number): WaveDef {
  const k = n - 10;
  return {
    count: WAVES[9].count + 8 * k,
    hpMul: WAVES[9].hpMul * 1.5 ** k,
    speed: WAVES[9].speed + 0.03 * k,
    tankEvery: 3, runnerEvery: 2,
  };
}

export function spawnWave(g: GameState, w: number): void {
  const endless = w > 9;
  const def = endless ? endlessWave(w) : WAVES[w];
  for (let i = 0; i < def.count; i++) {
    let kind = 'zevaka';
    if (def.tankEvery > 0 && i % def.tankEvery === def.tankEvery - 1) kind = 'zanuda';
    if (def.runnerEvery > 0 && i % def.runnerEvery === def.runnerEvery - 1) kind = 'sprinter';
    if (endless && g.medals >= 2) {
      if (i % 6 === 5) kind = 'troll';
      else if (i % 4 === 3) kind = 'double';
    }
    const e = ENEMIES[kind];
    g.units.push({ kind, seg: 0, pos: -i * 0.5, hp: e.hp * def.hpMul, maxHp: e.hp * def.hpMul, speed: e.speed * def.speed, reward: e.reward, regen: e.regen ?? 0 });
  }
  if (w === 9 || (endless && (w - 10) % 5 === 0)) {
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
    if ((g.liveT || 0) > 0) g.coins += 5;
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
  if (id === 'repair') g.lives = Math.min(g.maxLives ?? 10, g.lives + 3);
  if (id === 'warhorn') g.fearT = 3;
  if (id === 'live') g.liveT = 10;
  if (id === 'barricade') {
    g.maxLives = (g.maxLives ?? 10) + 2;
    g.lives = Math.min(g.maxLives, g.lives + 2);
  }
  if (id === 'sabotage') g.slowT = 10;
}

export function offerCards(_g: GameState, medals = 0): string[] {
  const ids = Object.keys(CARDS).filter((id) => (CARD_GATES[id] ?? 0) <= medals);
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
  const arsenal = g.medals >= 5 ? 1 + ARSENAL_DMG_MUL : 1;
  const dmgMul = (g.dmgMul || 1) * medalMult(g.medals || 0) * arsenal;
  const rateMul = g.rateMul || 1;
  g.fearT = Math.max(0, (g.fearT || 0) - dt);
  g.liveT = Math.max(0, (g.liveT || 0) - dt);
  g.slowT = Math.max(0, (g.slowT || 0) - dt);
  const slowed = (g.slowT || 0) > 0;
  const feared = (g.fearT || 0) > 0;
  // Движение: pos += speed*dt, переход на следующий сегмент; дошедшие до штаба снимают жизнь.
  for (const u of g.units) {
    if (u.dead) continue;
    if (!feared) {
      u.pos += u.speed * (slowed ? 0.7 : 1) * dt;
      while (u.pos >= 1) {
        u.pos -= 1;
        u.seg += 1;
      }
    }
    if ((u.regen || 0) > 0 && u.hp > 0) u.hp = Math.min(u.maxHp, u.hp + u.regen! * dt);
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
    if (t.kind === 'tesla') {
      const chained = g.units
        .filter((u) => {
          if (u.dead || u.hp <= 0) return false;
          const c = cellOf(u);
          return Math.hypot(c.x - t.x, c.y - t.y) <= def.range;
        })
        .sort((a, b) => {
          const ca = cellOf(a), cb = cellOf(b);
          return (Math.hypot(ca.x - t.x, ca.y - t.y) - Math.hypot(cb.x - t.x, cb.y - t.y));
        })
        .slice(0, 3);
      for (const u of chained) damage(g, u, dmg);
    } else if (t.kind === 'scarlet') {
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
