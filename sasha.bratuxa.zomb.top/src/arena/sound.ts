/* АРЕНА — звук клуба на WebAudio, без файлов. */

let ctx: AudioContext | null = null;
let muted = false;

export function setArenaMuted(m: boolean): void { muted = m; }

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
  } catch { /* клуб — украшение */ }
}

/** Кнопка клуба — щелчок. */
export function arenaClick(): void {
  tone(620, 0.06, 'triangle', 0.09);
}

/** Кости гремят в стакане. */
export function diceRattle(): void {
  [0, 0.07, 0.14].forEach((d, k) => {
    tone(900 + k * 250, 0.04, 'square', 0.04, d);
    tone(1400 + k * 300, 0.03, 'square', 0.03, d + 0.03);
  });
}

/** Твой куб встал. */
export function diceLand(v: number): void {
  tone(420 + v * 60, 0.09, 'triangle', 0.1);
}

/** Вылет — глухой гонг. */
export function elimGong(): void {
  tone(140, 0.3, 'sawtooth', 0.12, 0, -60);
  tone(70, 0.4, 'sine', 0.12, 0.05, -20);
}

/** Победа в бою — фанфары арены. */
export function arenaWin(): void {
  [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, 0.16, 'triangle', 0.12, i * 0.09));
  tone(2093, 0.5, 'sine', 0.06, 0.5);
}

/** Сообщение в чате комнаты — короткий поп. */
export function chatPop(): void {
  tone(990, 0.05, 'sine', 0.06);
}

/** Карта легла на стол — сухой щелчок. */
export function cardSnap(): void {
  tone(2100, 0.03, 'square', 0.05);
  tone(1500, 0.04, 'triangle', 0.06, 0.02);
}

/** Защитник взял — сгребание. */
export function takeScoop(): void {
  [300, 240, 180].forEach((f, i) => tone(f, 0.08, 'sawtooth', 0.07, i * 0.06, -40));
}
