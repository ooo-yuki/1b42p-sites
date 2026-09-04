// Дино-движок 42: чистая логика без DOM/canvas — рендер в DinoGame.
// 1-в-1 из legacy.html: гравитация, двойной прыжок, уровни, скорость, спавн, коллизии.
export const W = 600;
export const H = 200;
export const GROUND_Y = 150;
export const FLOOR_Y = 185;

// Магические числа физики в одном месте.
export const GRAVITY = 0.7;
export const JUMP_V1 = -12;
export const JUMP_V2 = -10;
export const MAX_JUMPS = 2;
export const FLASH_FRAMES = 12;

export interface DinoBox {
  x: number;
  y: number;
  w: number;
  h: number;
  vy: number;
  jumps: number;
}

export interface Obstacle {
  x: number;
  w: number;
  h: number;
}

export interface DinoState {
  dino: DinoBox;
  obstacles: Obstacle[];
  score: number;
  record: number;
  level: number;
  speed: number;
  t: number;
  alive: boolean;
  flash: number;
}

export type DinoEvent = 'levelup' | 'death' | null;

export function createDinoState(): DinoState {
  return {
    dino: { x: 50, y: GROUND_Y, w: 30, h: 40, vy: 0, jumps: 0 },
    obstacles: [],
    score: 0,
    record: 0,
    level: 1,
    speed: 5,
    t: 0,
    alive: true,
    flash: 0,
  };
}

export function jumpDino(s: DinoState): void {
  if (!s.alive) {
    const fresh = createDinoState();
    fresh.record = s.record;
    Object.assign(s, fresh);
    return;
  }
  if (s.dino.jumps < MAX_JUMPS) {
    s.dino.vy = s.dino.jumps === 0 ? JUMP_V1 : JUMP_V2;
    s.dino.jumps++;
  }
}

export function levelForScore(score: number): number {
  return 1 + Math.floor(score / 400);
}

export function speedForScore(score: number): number {
  return Math.min(5 + score / 350, 12);
}

export function gapForLevel(level: number): number {
  return Math.max(38, 70 - level * 6);
}

// Один тик кадра. Возвращает событие: null | 'levelup' | 'death'. rand — для тестов.
export function stepDino(s: DinoState, rand: () => number = Math.random): DinoEvent {
  let event: DinoEvent = null;
  s.t++;
  if (s.alive) {
    s.dino.vy += GRAVITY;
    s.dino.y += s.dino.vy;
    if (s.dino.y >= GROUND_Y) {
      s.dino.y = GROUND_Y;
      s.dino.vy = 0;
      s.dino.jumps = 0;
    }
  }
  const newLevel = levelForScore(s.score);
  if (newLevel !== s.level) {
    s.level = newLevel;
    if (s.alive) event = 'levelup';
  }
  s.speed = speedForScore(s.score);
  const gap = gapForLevel(s.level);
  if (s.t % Math.round(gap) === 0 && s.alive) {
    const big = s.level >= 3 && rand() < 0.3;
    s.obstacles.push({
      x: W,
      w: 20 + rand() * 20,
      h: big ? 55 + rand() * 15 : 30 + rand() * 25,
    });
  }
  for (const o of s.obstacles) {
    o.x -= s.speed;
    const oh = FLOOR_Y - o.h;
    if (
      s.alive &&
      s.dino.x < o.x + o.w &&
      s.dino.x + s.dino.w > o.x &&
      // NB: дино всегда выше FLOOR_Y (стоит на GROUND_Y=150 < FLOOR_Y=185),
      // вертикаль проверяется только перекрытием хитбокса с препятствием.
      s.dino.y + s.dino.h > oh
    ) {
      s.alive = false;
      s.flash = FLASH_FRAMES;
      event = 'death';
    }
  }
  s.obstacles = s.obstacles.filter((o) => o.x > -40);
  if (s.alive) s.score++;
  if (s.flash > 0) s.flash--;
  return event;
}
