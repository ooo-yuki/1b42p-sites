/* БЛЭКДЖЕК — звук салона: тасовка, сдача, фишки, итоги. */

let ctx: AudioContext | null = null;
let muted = false;

export function setBjMuted(m: boolean): void { muted = m; }

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
  } catch { /* салон — украшение */ }
}

/** Тасовка шузы: шелест трёх пачек. */
export function shuffleRiffle(): void {
  [0, 0.09, 0.18].forEach((d, k) => {
    tone(1400 + k * 300, 0.05, 'square', 0.03, d);
    tone(900 + k * 200, 0.05, 'square', 0.025, d + 0.04);
  });
}

/** Карта ложится на сукно — щелчок. */
export function cardSnap(): void {
  tone(700, 0.05, 'triangle', 0.08, 0, -200);
}

/** Фишка встаёт на дугу. */
export function chipPlace(): void {
  tone(520, 0.06, 'triangle', 0.09);
  tone(780, 0.07, 'sine', 0.06, 0.04);
}

/** Победа игрока — тёплая мажорная тройка. */
export function playerWin(natural: boolean): void {
  const seq = natural ? [523, 659, 784, 1046, 1318] : [392, 523, 659];
  seq.forEach((f, i) => tone(f, 0.16, 'triangle', 0.11, i * 0.08));
}

/** Дилер забрал — низкий кивок. */
export function dealerWin(): void {
  tone(233, 0.2, 'sine', 0.09);
  tone(175, 0.26, 'sine', 0.08, 0.13);
}

/** Ничья — стук по столу, фишки назад. */
export function pushKnock(): void {
  tone(330, 0.07, 'triangle', 0.09);
  tone(330, 0.07, 'triangle', 0.08, 0.12);
}
