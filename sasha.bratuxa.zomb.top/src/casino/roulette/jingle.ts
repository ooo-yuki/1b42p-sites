/* РУЛЕТКА — звук салона: шарик цокает с ростом тона, финал — аккорд. */

let ctx: AudioContext | null = null;
let muted = false;

export function setRouletteMuted(m: boolean): void { muted = m; }

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

function tone(freq: number, dur: number, type: OscillatorType, vol: number, delay = 0): void {
  const a = ac();
  if (!a) return;
  try {
    const t0 = a.currentTime + delay;
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(a.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  } catch { /* шарик — украшение */ }
}

/** Цок шарика. p 0..1 — круг замедляется, тон растёт. */
export function ballTick(p: number): void {
  tone(900 + p * 900, 0.04, 'square', 0.045);
}

/** Ставка принята — фишка щёлкает о сукно. */
export function chipClick(): void {
  tone(520, 0.06, 'triangle', 0.09);
  tone(780, 0.07, 'sine', 0.06, 0.04);
}

/** Выигрыш — короткий мажорный аккорд салона. */
export function salonWin(): void {
  [392, 494, 587, 784].forEach((f, i) => tone(f, 0.18, 'triangle', 0.11, i * 0.07));
}

/** Мимо — мягкий вздох контрабаса. */
export function salonLose(): void {
  tone(196, 0.22, 'sine', 0.09);
  tone(147, 0.28, 'sine', 0.08, 0.14);
}
