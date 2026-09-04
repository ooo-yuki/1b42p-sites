// Треки персонажей запоя: процедурные WebAudio-мотивы, у каждого свой вайб. Без файлов.
// Владимир — солидный марш, призрак — быстрый воздушный арп, винлайн — казино-свинг,
// демон — тяжёлый низкий рифф, а в демонической форме тот же трек чуть ускорен (×1.18),
// приспущен и с гулом — зловещее. 🦌
import { audioCtx } from '../ui/sound';

export type CharMusicId = 'vladimir' | 'ghost' | 'winline' | 'demon';

export interface Motif {
  name: string;
  bpm: number;
  wave: OscillatorType;
  bassWave: OscillatorType;
  /** Бас-рифф: полутона от корня, по четвертям. */
  bass: number[];
  /** Соло: полутона от корня (звучит на октаву выше), по восьмым. */
  lead: number[];
  /** Корень, Гц. */
  root: number;
  droneGain: number;
  swing: number;
  detune: number;
}

const TRACKS: Record<CharMusicId, Motif> = {
  // 🧔 Солидный марш: ровно, мажорно, никуда не спешит.
  vladimir: { name: 'Солидный марш', bpm: 92, wave: 'triangle', bassWave: 'square',
    bass: [0, 0, 7, 0, 5, 5, 7, 0], lead: [0, 4, 7, 12, 7, 4, 0, 4], root: 110, droneGain: 0, swing: 0, detune: 0 },
  // 👻 Сквозь стены: быстрый, высокий, невесомый синус.
  ghost: { name: 'Сквозь стены', bpm: 140, wave: 'sine', bassWave: 'sine',
    bass: [0, 7, 12, 7], lead: [12, 15, 19, 24, 19, 15, 12, 7], root: 220, droneGain: 0, swing: 0, detune: 0 },
  // 🎰 Джекпот-свинг: пританцовывающий бас, хроматика, свинг восьмых.
  winline: { name: 'Джекпот-свинг', bpm: 120, wave: 'square', bassWave: 'triangle',
    bass: [0, 0, 5, 0, 7, 0, 5, 4], lead: [0, 4, 7, 12, 11, 12, 7, 4], root: 130.81, droneGain: 0, swing: 0.12, detune: 0 },
  // 😈 Тёмный глоток: медленно, низко, пила + тритон, гул под ногами.
  demon: { name: 'Тёмный глоток', bpm: 72, wave: 'sawtooth', bassWave: 'sawtooth',
    bass: [0, 0, 1, 0, 0, 6, 1, 0], lead: [0, 1, 0, 6, 0, 1, 12, 1], root: 65.41, droneGain: 0.02, swing: 0, detune: 0 },
};

/** Форма ускоряет трек демона: 72 → 85 BPM. */
export const DEMON_FORM_FAST = 1.18;
/** ...и приспускает его (зловещее): корень вниз на малую терцию. */
export const DEMON_FORM_DOWN = 0.84;

export interface ResolvedMotif extends Motif {
  label: string;
  form: boolean;
}

export function motifFor(char: string, demonForm: number): ResolvedMotif {
  const id = (['vladimir', 'ghost', 'winline', 'demon'] as const).includes(char as CharMusicId)
    ? (char as CharMusicId) : 'vladimir';
  const base = TRACKS[id];
  const form = id === 'demon' && Number(demonForm || 0) > 0;
  if (!form) return { ...base, label: `🎵 ${base.name}`, form: false };
  return {
    ...base,
    name: 'Тёмный глоток (форма)',
    bpm: Math.round(base.bpm * DEMON_FORM_FAST),
    root: base.root * DEMON_FORM_DOWN,
    droneGain: 0.035,
    detune: 8,
    label: `🎵 Тёмный глоток (форма) — быстрее и зловещее 😈`,
    form: true,
  };
}

function semi(root: number, st: number): number {
  return root * Math.pow(2, st / 12);
}

class Radio {
  private ac: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: number | null = null;
  private step = 0;
  private nextT = 0;
  private motif: Motif = TRACKS.vladimir;
  private drone: { o: OscillatorNode; g: GainNode } | null = null;

  setMotif(m: Motif): void {
    this.motif = m;
    if (this.ac) this.syncDrone();
  }

  setMuted(muted: boolean): void {
    try {
      if (this.master && this.ac) this.master.gain.setValueAtTime(muted ? 0 : 1, this.ac.currentTime);
    } catch { /* тихо */ }
  }

  start(): void {
    try {
      const ac = audioCtx();
      if (!ac) return;
      this.ac = ac;
      if (!this.master) {
        this.master = ac.createGain();
        this.master.gain.value = 1;
        this.master.connect(ac.destination);
      }
      if (this.timer !== null) return;
      this.step = 0;
      this.nextT = ac.currentTime + 0.1;
      this.syncDrone();
      this.timer = window.setInterval(() => this.pump(), 90);
    } catch { /* тихо */ }
  }

  stop(): void {
    try {
      if (this.timer !== null) { window.clearInterval(this.timer); this.timer = null; }
    } catch { /* тихо */ }
    this.killDrone();
  }

  get running(): boolean {
    return this.timer !== null;
  }

  private syncDrone(): void {
    this.killDrone();
    try {
      const ac = this.ac;
      if (!ac || !this.master || this.motif.droneGain <= 0) return;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'sine';
      o.frequency.value = this.motif.root / 2;
      g.gain.value = this.motif.droneGain;
      o.connect(g); g.connect(this.master);
      o.start();
      this.drone = { o, g };
    } catch { /* тихо */ }
  }

  private killDrone(): void {
    try { this.drone?.o.stop(); } catch { /* тихо */ }
    try { this.drone?.o.disconnect(); this.drone?.g.disconnect(); } catch { /* тихо */ }
    this.drone = null;
  }

  private tone(freq: number, t: number, dur: number, type: OscillatorType, vol: number, detune: number): void {
    try {
      const ac = this.ac;
      if (!ac || !this.master) return;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = type;
      o.frequency.value = Math.max(20, freq);
      if (detune) o.detune.value = detune;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(Math.max(vol, 0.0011), t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(this.master);
      o.start(t); o.stop(t + dur + 0.05);
    } catch { /* тихо */ }
  }

  private pump(): void {
    try {
      const ac = this.ac;
      if (!ac) return;
      const m = this.motif;
      const spb = 60 / m.bpm / 4; // 16-е
      while (this.nextT < ac.currentTime + 0.35) {
        const s = this.step;
        if (s % 4 === 0) {
          const seq = (s / 4) | 0;
          this.tone(semi(m.root, m.bass[seq % m.bass.length]), this.nextT, spb * 3.5, m.bassWave, 0.05, 0);
        }
        if (s % 2 === 0) {
          const seq = (s / 2) | 0;
          let t = this.nextT;
          if (m.swing && seq % 2 === 1) t += spb * 2 * m.swing;
          this.tone(semi(m.root * 2, m.lead[seq % m.lead.length]), t, spb * 1.8, m.wave, 0.045, m.detune);
        }
        this.nextT += spb;
        this.step++;
      }
    } catch { /* тихо */ }
  }
}

export const radio = new Radio();
