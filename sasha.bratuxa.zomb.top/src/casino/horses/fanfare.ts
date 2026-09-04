/* СКАЧКИ — звук ипподрома на WebAudio: колокол, топот, трибуна. */

let ctx: AudioContext | null = null;
let muted = false;

export function setHorsesMuted(m: boolean): void { muted = m; }

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
  } catch { /* топот — украшение */ }
}

/** Стартовый колокол: два удара. */
export function startBell(): void {
  tone(880, 0.3, 'triangle', 0.16);
  tone(880, 0.4, 'triangle', 0.14, 0.28);
}

/** Топот копыт — вызывается каждый тик, alt чередует ногу. */
export function gallopTick(alt: boolean, speed: number): void {
  tone(alt ? 150 : 120, 0.06, 'sine', 0.05 + speed * 0.03, 0, -30);
}

/** Трибуна шумит: победа — рёв, мимо — вздох. */
export function crowd(win: boolean): void {
  if (win) {
    [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, 0.16, 'triangle', 0.1, i * 0.08));
    tone(2093, 0.4, 'sine', 0.05, 0.45);
  } else {
    tone(220, 0.25, 'sine', 0.09, 0, -60);
    tone(165, 0.3, 'sine', 0.08, 0.18, -40);
  }
}

/** Щелчок фотофиниша. */
export function photoClick(): void {
  tone(2400, 0.05, 'square', 0.05);
  tone(1200, 0.08, 'sine', 0.06, 0.04);
}
