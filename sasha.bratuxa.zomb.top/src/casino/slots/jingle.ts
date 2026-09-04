/* СЛОТЫ — звук автомата: рычаг, треск барабанов, выигрыши. */

let ctx: AudioContext | null = null;
let muted = false;

export function setSlotsMuted(m: boolean): void { muted = m; }

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
  } catch { /* автомат — украшение */ }
}

/** Рычаг: глухой ход вниз + щелчок. */
export function leverClunk(): void {
  tone(180, 0.1, 'square', 0.1, 0, -80);
  tone(620, 0.06, 'triangle', 0.09, 0.1);
}

/** Треск барабана: тон растёт к остановке. */
export function reelBlur(p: number): void {
  tone(300 + p * 300, 0.035, 'square', 0.035);
}

/** Барабан встал — стопор. */
export function reelLock(i: number): void {
  tone(500 + i * 150, 0.08, 'triangle', 0.1);
  tone(1000 + i * 300, 0.06, 'sine', 0.06, 0.03);
}

/** Джекпот 777 — сирена салона. */
export function jackpotSiren(): void {
  [523, 659, 784, 1046, 784, 1046, 1318, 1568].forEach((f, i) =>
    tone(f, 0.16, 'triangle', 0.12, i * 0.09));
  tone(2093, 0.6, 'sine', 0.06, 0.75);
}

/** Три одинаковых — весёлый перезвон. */
export function tripsChime(): void {
  [659, 784, 1046].forEach((f, i) => tone(f, 0.12, 'triangle', 0.1, i * 0.07));
}

/** Пара — скромный двойной щелчок. */
export function pairClick(): void {
  tone(660, 0.07, 'sine', 0.08);
  tone(880, 0.08, 'sine', 0.07, 0.07);
}
