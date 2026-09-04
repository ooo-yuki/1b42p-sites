/* КЕЙСЫ — джинглы арсенала на чистом WebAudio, без файлов.
   Замок щёлкает, лента тикает с ростом тона, игла звенит, победа — фанфары. */

let ctx: AudioContext | null = null;
let muted = false;

export function setCasesMuted(m: boolean): void { muted = m; }

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

function blip(freq: number, dur: number, type: OscillatorType, vol: number, slide = 0, delay = 0): void {
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
  } catch { /* звук — украшение, молчим */ }
}

/** Тяжёлый щелчок замка сейфа. */
export function lockClick(): void {
  blip(140, 0.09, 'square', 0.16, -60);
  blip(90, 0.12, 'triangle', 0.2, -30, 0.03);
}

/** Выбор сейфа — короткий металлический «дзынь». */
export function vaultSelect(): void {
  blip(660, 0.07, 'triangle', 0.1, 120);
  blip(990, 0.09, 'sine', 0.08, 0, 0.05);
}

/** Тик ленты. pitch 0..1 растёт к финалу — лента «натягивается». */
export function reelTick(p: number): void {
  const f = 380 + p * 620;
  blip(f, 0.045, 'square', 0.055, 40);
}

/** Игла прошла ячейку — звонкий щелчок. */
export function needlePing(): void {
  blip(1320, 0.06, 'sine', 0.07, 240);
}

/** Фанфары победы: арпеджио вверх; big — джекпот, длиннее и ярче. */
export function winFanfare(big: boolean): void {
  const seq = big
    ? [523, 659, 784, 1046, 784, 1046, 1318]
    : [523, 659, 784, 1046];
  seq.forEach((f, i) => {
    blip(f, big ? 0.22 : 0.16, 'triangle', 0.14, 0, i * (big ? 0.09 : 0.08));
    blip(f / 2, 0.18, 'sine', 0.07, 0, i * 0.08);
  });
  if (big) blip(2093, 0.5, 'sine', 0.06, 0, seq.length * 0.09);
}

/** Глухой удар — мимо окупаемости. Без драмы, по-батальонному. */
export function loseThud(): void {
  blip(110, 0.16, 'triangle', 0.14, -40);
  blip(73, 0.2, 'sine', 0.1, -15, 0.06);
}
