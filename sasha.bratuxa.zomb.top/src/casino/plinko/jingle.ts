/* ПЛИНКО — звук водопада: стук колышков, звон лунки. */

let ctx: AudioContext | null = null;
let muted = false;

export function setPlinkoMuted(m: boolean): void { muted = m; }

function ac(): AudioContext | null {
  if (muted) return null;
  try {
    if (!ctx) {
      const W = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
      const Ctor = W.AudioContext ?? W.webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch { return null; }
}

function tone(freq: number, dur: number, type: OscillatorType, vol: number, delay = 0, slide = 0): void {
  const a = ac();
  if (!a) return;
  try {
    const t0 = a.currentTime + delay;
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (slide !== 0) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(a.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  } catch { /* водопад — украшение */ }
}

/** Шарик пущен — всплеск вниз. */
export function dropSplash(): void {
  tone(700, 0.12, 'sine', 0.08, 0, -400);
}

/** Удар о колышек: тон растёт с глубиной. */
export function pinTick(depth: number): void {
  tone(420 + depth * 55, 0.045, 'triangle', 0.06);
}

/** Лунка: высота звона растёт с множителем, центр — глухой всплеск. */
export function binChime(mult: number): void {
  if (mult < 1) {
    tone(220, 0.14, 'sine', 0.09, 0, -60);
    return;
  }
  const base = 520 + Math.min(4, Math.log10(mult + 1) * 2) * 160;
  tone(base, 0.14, 'triangle', 0.11);
  tone(base * 1.5, 0.18, 'sine', 0.08, 0.08);
  if (mult >= 10) tone(base * 2, 0.3, 'sine', 0.07, 0.16);
}
