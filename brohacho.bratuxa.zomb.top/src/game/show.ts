/* Движок шоу 1:1 с legacy: те же скорости, окна, хейтеры, рейд, тексты.
   DOM — только через Layer (тесты подменяют), сейв читается, не пишется:
   банк хайпа отдаёт событием ended, кладёт вызывающий. */
import type { Save } from './formulas';
import { fmt, judgeDist, scoreHit } from './formulas';
import type { Venue } from './content';

export type NoteView = {
  setX(x: number): void;
  pop(): void;
  remove(): void;
};

export type HaterView = { remove(): void };

export type Layer = {
  spawnNote(raid: boolean): NoteView;
  spawnHater(onKick: () => void): HaterView;
};

export type ShowSummary = {
  hype: number; perfects: number; greats: number; goods: number; misses: number; best: number;
};

export type ShowEvents = {
  say(t: string): void;
  blip(f: number): void;
  ended(sum: ShowSummary): void;
  raid(on: boolean): void;
};

type Note = { x: number; hit: boolean; raid: boolean; view: NoteView };
type Hater = { age: number; dead: boolean; view: HaterView };

const stSpeed = (v: Venue, s: Save): number => v.speed * (1 - 0.12 * s.team.denis);
const stZone = (v: Venue, s: Save): number => v.zone + 3 * s.look.jacket;
const stBase = (v: Venue, s: Save): number => Math.round(v.base * (1 + 0.25 * s.bld.arena));
const stCritM = (s: Save): number =>
  (1 + 0.25 * s.team.freak) * (1 + [0, 0.25, 0.5, 1][s.look.hair]);
const stComboStep = (s: Save): number => 0.1 + 0.02 * s.bld.garden;
const stComboCap = (s: Save): number => [10, 15, 22, 30][s.look.sneakers] ?? 10;
const stDouble = (s: Save): number => [0, 0.1, 0.2, 0.35][s.look.mantle] ?? 0;
const stHaterEvery = (s: Save): number => 12 * (1 + 0.6 * s.team.oper);

export class ShowEngine {
  t = 30;
  hype = 0;
  combo = 0;
  best = 0;
  golds = 0;
  perfects = 0;
  greats = 0;
  goods = 0;
  misses = 0;
  over = false;
  cursorHidden = true;
  raid: { got: number; need: number; t: number } | null = null;
  notes: Note[] = [];
  haters: Hater[] = [];
  private elapsed = 0;
  private tRun = 0;
  private runRand = 1;
  private phase = 0;
  private zc = 0;
  private nextN = 0.8;
  private nextH = 5;
  private raidCd = 0;
  private cd = 0;
  private v: Venue;
  private s: Save;
  private layer: Layer;
  private ev: ShowEvents;
  private rng: () => number;

  constructor(v: Venue, s: Save, layer: Layer, ev: ShowEvents, rng: () => number = Math.random) {
    this.v = v;
    this.s = s;
    this.layer = layer;
    this.ev = ev;
    this.rng = rng;
    this.zc = 6 + stZone(v, s) / 2;
    this.runRand = 0.95 + rng() * 0.15;
    this.phase = rng() * 6.28;
  }

  private spd(): number {
    const ramp = 1 + Math.min(this.elapsed * 0.012, 0.25);
    const wave = 1 + 0.15 * Math.sin(this.tRun * 2.1 + this.phase);
    return stSpeed(this.v, this.s) * ramp * wave * this.runRand * (this.raid ? 1.25 : 1);
  }

  private gw(): number {
    return stZone(this.v, this.s);
  }

  /** Темп относительно базы площадки — для строки tempo в UI. */
  tempo(): number {
    return this.spd() / stSpeed(this.v, this.s);
  }

  step(dt: number): void {
    if (this.over) return;
    if (this.cd > 0) this.cd -= dt;
    if (this.raidCd > 0) this.raidCd -= dt;
    this.t -= dt;
    if (this.t <= 0) {
      this.over = true;
      this.ev.ended({
        hype: Math.floor(this.hype),
        perfects: this.perfects, greats: this.greats,
        goods: this.goods, misses: this.misses, best: this.best,
      });
      return;
    }
    this.tRun += dt;
    this.elapsed += dt;
    const spd = this.spd();
    this.nextN -= dt;
    if (this.nextN <= 0) {
      this.nextN = this.v.gap * (this.raid ? 0.45 : 0.85 + this.rng() * 0.3);
      if (this.notes.length < 8) {
        const raid = !!this.raid;
        this.notes.push({ x: 105, hit: false, raid, view: this.layer.spawnNote(raid) });
      } else this.nextN = 0.2;
    }
    const gw = this.gw();
    for (let m = this.notes.length - 1; m >= 0; m--) {
      const nt = this.notes[m];
      if (nt.hit) { this.notes.splice(m, 1); continue; }
      nt.x -= spd * dt;
      nt.view.setX(nt.x);
      if (nt.x < this.zc - gw) {
        nt.view.remove();
        this.notes.splice(m, 1);
        this.combo = 0;
        this.misses++;
        this.ev.say(nt.raid ? '👹 Рейд-нота ушла!' : 'Пропустил ноту! 💨');
        this.ev.blip(180);
      }
    }
    if (this.raid) {
      this.raid.t -= dt;
      if (this.raid.t <= 0) {
        this.raid = null;
        this.ev.raid(false);
        this.ev.say('Рейд ушёл... держи обычный темп 🎤');
      }
    }
    this.nextH -= dt;
    if (this.nextH <= 0) {
      this.nextH = stHaterEvery(this.s) * (0.7 + this.rng() * 0.6);
      if (this.haters.length < 2) {
        const h: Hater = { age: 0, dead: false, view: this.layer.spawnHater(() => this.kickSelf(h)) };
        this.haters.push(h);
      } else this.nextH = 2;
    }
    if (this.s.team.guard > 0) {
      for (let i = this.haters.length - 1; i >= 0; i--) {
        this.haters[i].age += dt;
        if (this.haters[i].age > 2.5 - 0.5 * this.s.team.guard) this.rmHater(i, true);
      }
    } else for (const h of this.haters) h.age += dt;
    for (let k = this.haters.length - 1; k >= 0; k--) {
      if (this.haters[k].age > 5) {
        this.haters[k].view.remove();
        this.haters.splice(k, 1);
        this.combo = 0;
        this.ev.say('Хейтер сорвал кусок шоу! −10% 😡');
        this.hype *= 0.9;
        this.ev.blip(200);
      }
    }
  }

  private kickSelf(h: Hater): void {
    if (h.dead) return;
    h.dead = true;
    const i = this.haters.indexOf(h);
    if (i >= 0) this.rmHater(i, false);
  }

  kickHater(i: number): void {
    if (i < 0 || i >= this.haters.length) return;
    const h = this.haters[i];
    if (h.dead) return;
    h.dead = true;
    this.rmHater(i, false);
  }

  private rmHater(i: number, silent: boolean): void {
    if (i < 0 || i >= this.haters.length) return;
    this.haters[i].view.remove();
    this.haters.splice(i, 1);
    if (!silent) {
      const v = stBase(this.v, this.s) * 0.5;
      this.hype += v;
      this.ev.say('Хейтер сброшен с полосы! +' + fmt(v) + ' 🔥');
      this.ev.blip(660);
    }
  }

  zavoz(): void {
    if (this.over || this.cd > 0) return;
    this.cd = 0.22;
    const zw = this.gw();
    const base = stBase(this.v, this.s);
    let best: Note | null = null;
    let bestD = 1e9;
    for (const n of this.notes) {
      if (n.hit) continue;
      const d = Math.abs(n.x - this.zc);
      if (d < bestD) { bestD = d; best = n; }
    }
    if (!best || bestD > zw) {
      this.combo = 0;
      this.misses++;
      this.ev.say('Мимо! Рано/поздно 💨');
      this.ev.blip(200);
      return;
    }
    let j = judgeDist(bestD, zw);
    if (this.haters.length > 0 && j !== 'good') {
      j = j === 'perfect' || j === 'great' ? 'good' : j;
      this.ev.say('😡 Хейтер глушит звук! Сбей его!');
    }
    best.hit = true;
    best.view.pop();
    const { val, doubled } = scoreHit(
      base, j, this.combo, stCritM(this.s), stComboStep(this.s), stDouble(this.s), this.rng,
    );
    if (doubled) this.ev.say((j === 'perfect' ? '✨ ДВОЙНОЙ PERFECT! +' : '✨ ДВОЙНОЙ! +') + fmt(val));
    else if (j === 'perfect') this.ev.say((this.combo + 1 >= 8 ? '🔥 ФИЕВЕР! PERFECT +' : '💯 PERFECT! +') + fmt(val));
    else if (j === 'great' && this.combo + 1 >= 8) this.ev.say('🔥 ФИЕВЕР! +' + fmt(val));
    if (j === 'perfect') this.perfects++;
    else if (j === 'great') this.greats++;
    else this.goods++;
    this.combo = Math.min(this.combo + 1, stComboCap(this.s));
    this.best = Math.max(this.best, this.combo);
    if (j === 'perfect' || j === 'great') this.golds++;
    this.hype += val;
    this.ev.blip(j === 'perfect' ? 990 : j === 'great' ? 880 : 500);
    if (this.raid) {
      this.raid.got++;
      if (this.raid.got >= this.raid.need) {
        this.hype += base * 10 * stCritM(this.s);
        this.ev.say('👹 РЕЙД ОТБИТ! ×10!');
        this.raid = null;
        this.ev.raid(false);
      }
    }
  }

  callRaid(): void {
    if (this.over || this.raid || this.raidCd > 0) return;
    this.raid = { got: 0, need: 6, t: 10 };
    this.ev.raid(true);
    this.raidCd = 20;
    this.nextN = 0;
    this.ev.say('👹 РЕЙД-БОСС! Поток нот — держи темп!');
    this.ev.blip(300);
  }
}
