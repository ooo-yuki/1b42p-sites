/* ЛЕСЕНКА — звук сигнала: подъём, срыв, забор. */

let ctx: AudioContext | null = null;
let muted = false;

export function setLadderMuted(m: boolean): void { muted = m; }

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
  } catch { /* сигнал — украшение */ }
}

/** Подъём: тон растёт с высотой. */
export function stepUp(h: number): void {
  tone(380 + h * 90, 0.1, 'triangle', 0.09);
  tone(760 + h * 180, 0.08, 'sine', 0.05, 0.05);
}

/** Срыв: падение вниз. */
export function fallDown(): void {
  tone(500, 0.3, 'sawtooth', 0.08, 0, -380);
  tone(140, 0.25, 'sine', 0.1, 0.28);
}

/** Забор: касса звякает, выше высота — выше звон. */
export function cashChime(h: number): void {
  const base = 620 + h * 70;
  tone(base, 0.12, 'triangle', 0.1);
  tone(base * 1.5, 0.16, 'sine', 0.08, 0.08);
  if (h >= 6) tone(base * 2, 0.3, 'sine', 0.07, 0.16);
}
