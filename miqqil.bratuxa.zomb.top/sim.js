// MIQQIL TANKS — авторитарная симуляция общего поля боя.
// Без DOM и без three.js: используется и сервером (Bun, авторитарно), и клиентом (предсказание/офлайн).
// Стиль 42: Мы уже победили 🏆
import {
  getVehicle, calcDamage, applyHit, zoneDps, zoneRadius,
  pickBots, botVehicleIds, mulberry32,
  BOT_AIM, botAimError, botReactionTime,
} from './game-logic.js';

const ARENA_SIZE = 400;
const ZONE_START_R = 170;
const ZONE_TICK = 30;
const ROUND_CAP = 360; // 6 минут — жёсткий потолок раунда
const RESULTS_TIME = 6;
const INTERMISSION_TIME = 8;
const SQUAD = 8; // общий состав боя: игроки + добивающие боты

// ---------- арена: детерминированная генерация по сиду ----------
export function makeArena(seed, size = ARENA_SIZE) {
  const rng = mulberry32(seed >>> 0);
  const obstacles = [];
  for (let i = 0; i < 26; i++) {
    const w = 4 + rng() * 8, h = 3 + rng() * 4, d = 4 + rng() * 8;
    const x = (rng() - 0.5) * (size - 60), z = (rng() - 0.5) * (size - 60);
    const rotY = rng() * Math.PI;
    const gold = i % 7 === 0;
    if (Math.hypot(x, z) < 25) continue;
    obstacles.push({ x, z, w, h, d, rotY, gold, hx: Math.max(w, d) / 2, hz: Math.max(w, d) / 2 });
  }
  const decor = [];
  const kinds = ['rock', 'bush', 'tree'];
  for (let i = 0; i < 90; i++) {
    const x = (rng() - 0.5) * (size - 20), z = (rng() - 0.5) * (size - 20);
    if (Math.hypot(x, z) < 20) continue;
    decor.push({ x, z, kind: kinds[(rng() * kinds.length) | 0], scale: 0.6 + rng() * 0.9, rot: rng() * Math.PI * 2 });
  }
  return { size, seed: seed >>> 0, obstacles, decor };
}

// ---------- мир ----------
export function makeWorld(seed = (Math.random() * 2 ** 31) | 0, size = ARENA_SIZE) {
  return {
    arena: makeArena(seed, size),
    units: new Map(),
    zone: { x: 0, z: 0, r: ZONE_START_R, phase: 0, t: ZONE_TICK, active: false },
    round: { phase: 'waiting', timer: 0, elapsed: 0, roster: new Map(), deaths: [], seq: 0 },
    time: 0,
    nextBotId: 1,
  };
}

function spawnPoint(world) {
  if (world.round.phase === 'live' && world.zone.active) {
    const a = Math.random() * Math.PI * 2;
    const r = world.zone.r * (0.55 + Math.random() * 0.35);
    return { x: world.zone.x + Math.cos(a) * r, z: world.zone.z + Math.sin(a) * r };
  }
  const R = world.arena.size / 2 - 30;
  const a = Math.random() * Math.PI * 2;
  return { x: Math.cos(a) * R * (0.7 + Math.random() * 0.3), z: Math.sin(a) * R * (0.7 + Math.random() * 0.3) };
}

export function spawnPositions(n, size = ARENA_SIZE) {
  const pts = [], R = size / 2 - 30;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + 0.3;
    pts.push({ x: Math.cos(a) * R * (0.7 + Math.random() * 0.3), z: Math.sin(a) * R * (0.7 + Math.random() * 0.3) });
  }
  return pts;
}

export function addUnit(world, { id, nick, vid, isBot = false, owner = null }) {
  const spec = getVehicle(vid);
  const midRound = world.round.phase === 'live';
  const pos = spawnPoint(world);
  const u = {
    id, nick: String(nick || 'Братуха').slice(0, 16), vid, spec, isBot, owner,
    x: pos.x, z: pos.z, y: spec.fly || 0,
    yaw: Math.random() * Math.PI * 2, turYaw: 0,
    hp: spec.hp, maxhp: spec.hp,
    reload: 0, kills: 0, dead: false, deadAt: 0,
    speed2d: 0,
    aiT: Math.random() * 2, aiWx: 0, aiWz: 0,
    aiTarget: null, aiLock: 0, aiErrT: 0, aimErr: 0,
    invuln: midRound ? 3 : 0,
    fullRound: !midRound,
    input: { dx: 0, dz: 0, aimYaw: 0, fire: false },
    connected: true, disconnectAt: 0,
  };
  world.units.set(id, u);
  return u;
}

export function removeUnit(world, id) {
  const u = world.units.get(id);
  if (u && world.round.phase === 'live' && world.round.roster.has(id)) {
    // сохраняем снимок для подсчёта результатов раунда, даже если игрок вышел
    world.round.roster.set(id, { nick: u.nick, isBot: u.isBot, kills: u.kills, vid: u.vid, owner: u.owner });
    if (!u.dead) world.round.deaths.push(id);
  }
  world.units.delete(id);
}

export function setInput(world, id, input) {
  const u = world.units.get(id);
  if (!u || u.isBot) return;
  let dx = Number(input?.dx) || 0, dz = Number(input?.dz) || 0;
  const len = Math.hypot(dx, dz);
  if (len > 1) { dx /= len; dz /= len; }
  const aimYaw = Number.isFinite(input?.aimYaw) ? input.aimYaw : u.turYaw;
  u.input = { dx, dz, aimYaw, fire: !!input?.fire };
}

export function fillBots(world, target = SQUAD) {
  const need = target - world.units.size;
  if (need <= 0) return;
  const nicks = pickBots(need);
  const vids = botVehicleIds(need);
  for (let i = 0; i < need; i++) {
    const id = 'bot_' + world.nextBotId++;
    addUnit(world, { id, nick: nicks[i], vid: vids[i], isBot: true });
  }
}

export function evictWeakestBot(world) {
  let weakest = null;
  for (const u of world.units.values()) {
    if (!u.isBot || u.dead) continue;
    if (!weakest || u.hp < weakest.hp) weakest = u;
  }
  if (weakest) { removeUnit(world, weakest.id); return weakest.id; }
  return null;
}

// ---------- физика/боёвка ----------
function collideUnit(arena, u) {
  const r = u.spec.type === 'ship' ? 3 : 2;
  for (const o of arena.obstacles) {
    const dx = u.x - o.x, dz = u.z - o.z;
    const px = o.hx + r - Math.abs(dx), pz = o.hz + r - Math.abs(dz);
    if (px > 0 && pz > 0) {
      if (px < pz) u.x = o.x + Math.sign(dx || 1) * (o.hx + r);
      else u.z = o.z + Math.sign(dz || 1) * (o.hz + r);
      u.speed2d *= 0.4;
    }
  }
  const B = arena.size / 2 - 4;
  u.x = Math.max(-B, Math.min(B, u.x));
  u.z = Math.max(-B, Math.min(B, u.z));
}

function moveUnit(arena, u, dt, dx, dz, turnRate) {
  const len = Math.hypot(dx, dz);
  if (len > 1) { dx /= len; dz /= len; }
  const sp = u.spec.speed;
  u.x += dx * sp * dt;
  u.z += dz * sp * dt;
  u.speed2d = Math.hypot(dx, dz) * sp;
  if (Math.hypot(dx, dz) > 0.08) {
    const want = Math.atan2(dx, dz);
    if (turnRate) {
      let d = want - u.yaw;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      u.yaw += Math.max(-turnRate * dt, Math.min(turnRate * dt, d));
    } else if (u.speed2d > 1) {
      u.yaw = want;
    }
  }
  collideUnit(arena, u);
  u.y += ((u.spec.fly || 0) - u.y) * Math.min(1, dt * 2);
}

// Публичная лёгкая версия — клиентское предсказание своего юнита между снапшотами сервера.
// state: { x,z,y,yaw,turYaw,speed2d,spec }; мутирует и возвращает тот же объект.
export function predictUnit(arena, state, dt, input) {
  let dx = Number(input?.dx) || 0, dz = Number(input?.dz) || 0;
  moveUnit(arena, state, dt, dx, dz);
  if (Number.isFinite(input?.aimYaw)) turnTurret(state, input.aimYaw, dt);
  return state;
}

function turnTurret(u, targetYaw, dt) {
  let d = targetYaw - u.turYaw;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  const maxStep = (u.spec.turretTurn || 2.2) * dt;
  u.turYaw += Math.max(-maxStep, Math.min(maxStep, d));
}

function tryFire(world, u, events) {
  if (u.reload > 0 || u.dead || u.invuln > 0) return;
  u.reload = u.spec.reload;
  const dir = { x: Math.sin(u.turYaw), z: -Math.cos(u.turYaw) };
  let best = null, bestD = u.spec.range;
  for (const e of world.units.values()) {
    if (e === u || e.dead || e.invuln > 0) continue;
    const dx = e.x - u.x, dz = e.z - u.z;
    const d = Math.hypot(dx, dz);
    if (d > u.spec.range) continue;
    const ang = Math.acos(Math.max(-1, Math.min(1, (dx * dir.x + dz * dir.z) / (d || 1))));
    if (ang < 0.14 && d < bestD) { best = e; bestD = d; }
  }
  if (best) {
    const dmg = calcDamage(u.spec.damage, bestD, u.spec.range);
    const r = applyHit(best.hp, dmg);
    best.hp = r.hp;
    events.push({ t: 'hit', by: u.id, target: best.id, dmg, hp: best.hp });
    if (r.dead) killUnit(world, best, u, events);
  }
  events.push({ t: 'shot', id: u.id, x: u.x, z: u.z, y: (u.spec.fly || 0) + 0.9, yaw: u.turYaw, len: best ? bestD : u.spec.range * 0.7 });
}

function killUnit(world, victim, killer, events) {
  if (victim.dead) return;
  victim.dead = true;
  victim.deadAt = world.time;
  if (killer && killer !== victim) {
    killer.kills++;
    const rec = world.round.roster.get(killer.id);
    if (rec) rec.kills = killer.kills;
  }
  if (world.round.phase === 'live' && world.round.roster.has(victim.id)) world.round.deaths.push(victim.id);
  events.push({ t: 'kill', victim: victim.id, victimNick: victim.nick, killer: killer ? killer.id : null, killerNick: killer ? killer.nick : null });
}

function updatePlayerUnit(world, u, dt, events) {
  const inp = u.input || { dx: 0, dz: 0, aimYaw: u.turYaw, fire: false };
  moveUnit(world.arena, u, dt, inp.dx, inp.dz);
  turnTurret(u, inp.aimYaw, dt);
  if (inp.fire) tryFire(world, u, events);
}

function updateBotAI(world, u, dt, events) {
  u.aiT -= dt;
  let target = null, pd = Infinity;
  for (const e of world.units.values()) {
    if (e === u || e.dead) continue;
    const d = Math.hypot(e.x - u.x, e.z - u.z);
    if (d < pd) { pd = d; target = e; }
  }
  const dx = target ? target.x - u.x : world.zone.x - u.x;
  const dz = target ? target.z - u.z : world.zone.z - u.z;
  const distP = target ? pd : 1e9;
  if (u.aiT <= 0) {
    u.aiT = 1.5 + Math.random() * 2;
    const dzx = world.zone.x - u.x, dzz = world.zone.z - u.z;
    const dd = Math.hypot(dzx, dzz);
    if (dd > world.zone.r * 0.8) { u.aiWx = dzx / (dd || 1); u.aiWz = dzz / (dd || 1); }
    else if (target && distP < 90) { u.aiWx = dx / (distP || 1); u.aiWz = dz / (distP || 1); }
    else { const a = Math.random() * Math.PI * 2; u.aiWx = Math.cos(a); u.aiWz = Math.sin(a); }
  }
  let mx = u.aiWx, mz = u.aiWz;
  if (target && distP < u.spec.range * 0.35) { mx = -dx / distP; mz = -dz / distP; }
  moveUnit(world.arena, u, dt, mx * 0.75, mz * 0.75, u.spec.turn);

  // Наводка: бот не снайпер. Новая цель — пауза на реакцию, плюс постоянно
  // гуляющая ошибка прицела, которая растёт с дистанцией. Мажет по-настоящему.
  const tid = target ? target.id : null;
  if (tid !== u.aiTarget) {
    u.aiTarget = tid;
    u.aiLock = botReactionTime(Math.random);
    u.aiErrT = 0;
  }
  if (u.aiLock > 0) u.aiLock = Math.max(0, u.aiLock - dt);
  u.aiErrT -= dt;
  if (u.aiErrT <= 0) {
    u.aiErrT = 0.6 + Math.random() * 0.9;
    u.aimErr = botAimError(Math.random, distP, u.spec.range);
  }
  if (target && distP < u.spec.range) {
    turnTurret(u, Math.atan2(dx, -dz) + u.aimErr, dt);
    if (u.aiLock <= 0 && distP < u.spec.range * BOT_AIM.rangeFrac && Math.random() < dt * 0.9) {
      tryFire(world, u, events);
    }
  }
}

// ---------- зона ----------
function updateZone(world, dt, events) {
  const z = world.zone;
  if (!z.active) return;
  z.t -= dt;
  if (z.t <= 0) {
    z.phase++;
    z.r = zoneRadius(ZONE_START_R, z.phase);
    z.x = (Math.random() - 0.5) * (ZONE_START_R - z.r);
    z.z = (Math.random() - 0.5) * (ZONE_START_R - z.r);
    z.t = ZONE_TICK;
    events.push({ t: 'zone', phase: z.phase });
  }
}

// ---------- раунд-машина ----------
function startRound(world, events) {
  fillBots(world, SQUAD);
  const r = world.round;
  r.phase = 'live'; r.elapsed = 0; r.deaths = []; r.seq++;
  r.roster = new Map();
  const ids = [...world.units.keys()];
  const pts = spawnPositions(ids.length, world.arena.size);
  ids.forEach((id, i) => {
    const u = world.units.get(id);
    u.hp = u.maxhp; u.dead = false; u.deadAt = 0; u.kills = 0; u.reload = 0; u.invuln = 1.5;
    u.aiTarget = null; u.aiLock = 0; u.aiErrT = 0; u.aimErr = 0;
    u.x = pts[i].x; u.z = pts[i].z; u.y = u.spec.fly || 0;
    u.yaw = Math.atan2(-pts[i].x, -pts[i].z); u.turYaw = u.yaw;
    u.fullRound = true;
    r.roster.set(id, { nick: u.nick, isBot: u.isBot, kills: 0, vid: u.vid, owner: u.owner });
  });
  world.zone = { x: 0, z: 0, r: ZONE_START_R, phase: 0, t: ZONE_TICK, active: true };
  events.push({ t: 'round', phase: 'live', total: ids.length });
}

function computeResults(world) {
  const r = world.round;
  const roster = [...r.roster.keys()];
  const total = roster.length;
  const info = id => world.units.get(id) || r.roster.get(id);
  const survivors = roster
    .filter(id => world.units.has(id) && !world.units.get(id).dead)
    .sort((a, b) => info(b).kills - info(a).kills);
  const deadDesc = [...r.deaths].filter(id => r.roster.has(id)).reverse();
  const seen = new Set(survivors);
  const ordered = [...survivors, ...deadDesc.filter(id => !seen.has(id) && !seen.add(id))];
  for (const id of roster) if (!seen.has(id)) { ordered.push(id); seen.add(id); }
  return ordered.map((id, i) => {
    const d = info(id) || {};
    return { id, nick: d.nick, isBot: !!d.isBot, kills: d.kills || 0, vid: d.vid, owner: d.owner || null, place: i + 1, total };
  });
}

function endRound(world, events) {
  const results = computeResults(world);
  world.round.phase = 'results';
  world.round.timer = RESULTS_TIME;
  world.zone.active = false;
  events.push({ t: 'round', phase: 'results', results });
  return results;
}

function maybeEndRound(world, events) {
  if (world.round.phase !== 'live') return;
  const roster = world.round.roster;
  if (roster.size <= 1) return;
  const aliveInRoster = [...roster.keys()].filter(id => world.units.has(id) && !world.units.get(id).dead);
  if (aliveInRoster.length <= 1) endRound(world, events);
}

function updateRound(world, dt, events) {
  const r = world.round;
  if (r.phase === 'waiting') {
    if (world.units.size > 0) startRound(world, events);
    return;
  }
  if (r.phase === 'live') {
    r.elapsed += dt;
    if (r.elapsed > ROUND_CAP) endRound(world, events);
    return;
  }
  if (r.phase === 'results') {
    r.timer -= dt;
    if (r.timer <= 0) { r.phase = 'intermission'; r.timer = INTERMISSION_TIME; }
    return;
  }
  if (r.phase === 'intermission') {
    r.timer -= dt;
    if (r.timer <= 0) startRound(world, events);
    return;
  }
}

// ---------- главный тик ----------
export function stepWorld(world, dt) {
  const events = [];
  world.time += dt;
  updateRound(world, dt, events);
  if (world.round.phase === 'live') {
    updateZone(world, dt, events);
    for (const u of world.units.values()) {
      if (u.invuln > 0) u.invuln = Math.max(0, u.invuln - dt);
      if (u.reload > 0) u.reload = Math.max(0, u.reload - dt);
      if (u.dead) continue;
      if (u.isBot) updateBotAI(world, u, dt, events);
      else updatePlayerUnit(world, u, dt, events);
    }
    if (world.zone.active) {
      for (const u of world.units.values()) {
        if (u.dead || u.invuln > 0) continue;
        const d = Math.hypot(u.x - world.zone.x, u.z - world.zone.z);
        if (d > world.zone.r) {
          const r = applyHit(u.hp, zoneDps(world.zone.phase) * dt);
          u.hp = r.hp;
          if (r.dead) killUnit(world, u, null, events);
        }
      }
    }
    maybeEndRound(world, events);
  }
  return events;
}

export function unitPublicState(u) {
  return {
    id: u.id, nick: u.nick, vid: u.vid, x: u.x, z: u.z, y: u.y,
    yaw: u.yaw, turYaw: u.turYaw, hp: u.hp, maxhp: u.maxhp,
    dead: u.dead, kills: u.kills, isBot: u.isBot, invuln: u.invuln > 0,
    speed2d: u.speed2d, reload: u.reload,
  };
}

export const CONSTS = { ARENA_SIZE, ZONE_START_R, ZONE_TICK, ROUND_CAP, RESULTS_TIME, INTERMISSION_TIME, SQUAD };
