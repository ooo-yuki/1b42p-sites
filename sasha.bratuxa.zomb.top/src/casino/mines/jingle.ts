/* МИНЫ — звук полигона: люк, клёпанка, кристалл, взрыв, касса. */

let ctx: AudioContext | null = null;
let muted = false;

export function setMinesMuted(m: boolean): void { muted = m; }

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
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(a.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  } catch { /* полигон — украшение */ }
}

/** Люк бункера: тяжёлый засов. */
export function bunkerDoor(): void {
  tone(95, 0.16, 'square', 0.14, 0, -30);
  tone(65, 0.2, 'triangle', 0.16, 0.1, -15);
}

/** Клёпанка: глухой стук по плитке. */
export function tileTap(): void {
  tone(240, 0.05, 'square', 0.05, 0, -60);
}

/** Кристалл: тон растёт с множителем — чем дальше, тем выше. */
export function gemPing(mult: number): void {
  const f = 660 + Math.min(4, mult) * 160;
  tone(f, 0.12, 'sine', 0.1, 0, 120);
  tone(f * 2, 0.09, 'sine', 0.05, 0.03);
}

/** Взрыв: низкий удар + шипение осколков. */
export function boomBlast(): void {
  tone(70, 0.4, 'sawtooth', 0.2, 0, -30);
  tone(45, 0.5, 'sine', 0.18, 0.05, -10);
  tone(1800, 0.15, 'square', 0.03, 0.08, -1200);
}

/** Касса: звон выдачи. */
export function cashPing(): void {
  tone(880, 0.1, 'triangle', 0.11);
  tone(1174, 0.14, 'triangle', 0.1, 0.08);
}
