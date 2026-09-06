import { CFG } from './config.js';
import { LEVELS } from './levels.js';

const SOLID = '#=-';

function cellSolid(map, c, r) {
  if (r < 0 || r >= map.length) return true;
  if (c < 0 || c >= map[r].length) return true;
  return SOLID.includes(map[r][c]);
}

function solidAt(map, x, y) {
  const H = map.length;
  const c = Math.floor(x);
  const r = H - 1 - Math.floor(y);
  return cellSolid(map, c, r);
}

function findMark(map, ch) {
  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[r].length; c++) {
      if (map[r][c] === ch) return { c, r };
    }
  }
  return null;
}

function loadLevel(S, idx) {
  S.level = idx;
  const map = LEVELS[idx];
  const H = map.length;
  const cellY = (r) => H - 1 - r;
  const p = findMark(map, 'P');
  S.spawn = { x: p.c + 0.5, y: cellY(p.r) };
  S.seal.x = S.spawn.x;
  S.seal.y = S.spawn.y;
  S.seal.vx = 0;
  S.seal.vy = 0;
  S.seal.onGround = false;
  S.guards = [];
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < map[r].length; c++) {
      if (map[r][c] === 'G') S.guards.push({ x: c + 0.5, y: cellY(r), dir: 1, stun: 0 });
    }
  }
  const k = findMark(map, 'K');
  S.key = k ? { x: k.c + 0.5, y: cellY(k.r) + 0.5, taken: false } : null;
  const f = findMark(map, 'F');
  S.fish = f ? { x: f.c + 0.5, y: cellY(f.r) + 0.5, taken: false } : null;
  const e = findMark(map, 'E');
  S.exit = e ? { x: e.c + 0.5, y: cellY(e.r) + 0.5 } : null;
  S.hasKey = false;
  S.hasFish = false;
  S.caught = false;
}

export function newRun(level) {
  const S = {
    level: 0,
    seal: { x: 0, y: 0, vx: 0, vy: 0, onGround: false },
    guards: [],
    hearts: CFG.hearts,
    caught: false,
    hasKey: false,
    hasFish: false,
    won: false,
    dead: false,
    spawn: { x: 0, y: 0 },
    key: null,
    fish: null,
    exit: null,
  };
  loadLevel(S, level || 0);
  return S;
}

export function step(S, input) {
  if (S.won || S.dead) return;
  const inp = input || {};
  const dt = CFG.step;
  const map = LEVELS[S.level];
  S.caught = false;

  const move = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
  S.seal.vx = move * CFG.walk;
  let nx = S.seal.x + S.seal.vx * dt;
  if (move !== 0) {
    const edge = nx + (move > 0 ? 0.3 : -0.3);
    if (solidAt(map, edge, S.seal.y + 0.05) || solidAt(map, edge, S.seal.y + 0.6)) {
      nx = S.seal.x;
    }
  }
  S.seal.x = nx;

  S.seal.vy -= CFG.gravity * dt;
  if (inp.jump && S.seal.onGround) {
    S.seal.vy = CFG.jump;
    S.seal.onGround = false;
  }
  let ny = S.seal.y + S.seal.vy * dt;
  S.seal.onGround = false;
  if (S.seal.vy <= 0) {
    if (solidAt(map, S.seal.x - 0.25, ny) || solidAt(map, S.seal.x + 0.25, ny) || solidAt(map, S.seal.x, ny)) {
      ny = Math.floor(ny) + 1;
      S.seal.vy = 0;
      S.seal.onGround = true;
    }
  } else if (solidAt(map, S.seal.x, ny + 0.9)) {
    ny = Math.floor(ny + 0.9) - 0.9 - 0.001;
    S.seal.vy = 0;
  }
  S.seal.y = ny;

  for (const g of S.guards) {
    if (g.stun > 0) {
      g.stun = Math.max(0, g.stun - dt);
      continue;
    }
    const nxg = g.x + g.dir * CFG.guardSpeed * dt;
    const edge = nxg + (g.dir > 0 ? 0.3 : -0.3);
    if (solidAt(map, edge, g.y + 0.05) || solidAt(map, edge, g.y + 0.6)) {
      g.dir = -g.dir;
    } else {
      g.x = nxg;
    }
  }

  if (inp.shove) {
    for (const g of S.guards) {
      if (g.stun > 0) continue;
      if (Math.abs(S.seal.x - g.x) <= 1.0 && Math.abs(S.seal.y - g.y) <= 1.0) {
        g.stun = CFG.stunSec;
      }
    }
  }

  for (const g of S.guards) {
    if (g.stun > 0) continue;
    const dx = S.seal.x - g.x;
    const dy = S.seal.y - g.y;
    if (Math.abs(dy) > 0.9) continue;
    if (Math.abs(dx) > CFG.sight) continue;
    if (dx !== 0 && Math.sign(dx) !== g.dir && Math.abs(dx) > 0.5) continue;
    let blocked = false;
    const n = Math.max(2, Math.ceil(Math.abs(dx) / 0.25));
    for (let i = 1; i < n; i++) {
      const px = g.x + (dx * i) / n;
      if (solidAt(map, px, g.y + 0.5)) { blocked = true; break; }
    }
    if (blocked) continue;
    S.hearts -= 1;
    S.caught = true;
    S.seal.x = S.spawn.x;
    S.seal.y = S.spawn.y;
    S.seal.vx = 0;
    S.seal.vy = 0;
    break;
  }

  if (S.key && !S.key.taken && Math.abs(S.seal.x - S.key.x) <= 1.0 && Math.abs(S.seal.y + 0.5 - S.key.y) <= 1.0) {
    S.key.taken = true;
    S.hasKey = true;
  }
  if (S.fish && !S.fish.taken && Math.abs(S.seal.x - S.fish.x) <= 1.0 && Math.abs(S.seal.y + 0.5 - S.fish.y) <= 1.0) {
    S.fish.taken = true;
    S.hasFish = true;
  }
  if (S.exit && S.hasKey && S.hasFish && Math.abs(S.seal.x - S.exit.x) <= 1.0 && Math.abs(S.seal.y + 0.5 - S.exit.y) <= 1.2) {
    if (S.level >= LEVELS.length - 1) {
      S.won = true;
    } else {
      const hearts = S.hearts;
      loadLevel(S, S.level + 1);
      S.hearts = hearts;
    }
  }

  if (S.hearts <= 0) S.dead = true;
}

export function putSeal(S, x, y) {
  S.seal.x = x;
  S.seal.y = y;
  S.seal.vx = 0;
  S.seal.vy = 0;
}

export function giveAll(S) {
  S.hasKey = true;
  S.hasFish = true;
  if (S.key) S.key.taken = true;
  if (S.fish) S.fish.taken = true;
}

export function killAll(S) {
  S.hearts = 0;
  S.dead = true;
}
