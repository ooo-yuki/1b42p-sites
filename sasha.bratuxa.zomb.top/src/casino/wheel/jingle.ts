/* КОЛЕСО — звук фортуны: треск клиньев, фанфары топа. */

let ctx: AudioContext | null = null;
let muted = false;

export function setWheelMuted(m: boolean): void { muted = m; }

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
  } catch { /* фортуна — украшение */ }
}

/** Колесо пущено — свист разгона. */
export function spinWhirr(): void {
  tone(300, 0.4, 'sawtooth', 0.04, 0, 500);
}

/** Треск клина под стрелкой. */
export function pegClack(): void {
  tone(700, 0.03, 'square', 0.04);
}

/** Сектор встал: высота звона растёт с множителем. */
export function sectorChime(mult: number): void {
  if (mult <= 0) {
    tone(180, 0.2, 'sine', 0.09, 0, -50);
    return;
  }
  const base = 540 + mult * 90;
  tone(base, 0.12, 'triangle', 0.1);
  tone(base * 1.5, 0.16, 'sine', 0.08, 0.08);
  if (mult >= 4) [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.14, 'triangle', 0.1, 0.16 + i * 0.08));
}
