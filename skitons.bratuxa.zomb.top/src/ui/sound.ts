// Крошечный WebAudio-синтезатор: клики/покупки без внешних файлов.
let ctx: AudioContext | null = null;
let muted = false;

function ac(): AudioContext | null {
  try {
    if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch { return null; }
}

function blip(freq: number, dur = 0.09, type: OscillatorType = 'sine', gain = 0.12, when = 0): void {
  if (muted) return;
  const c = ac();
  if (!c) return;
  const t = c.currentTime + when;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t); o.stop(t + dur + 0.02);
}

export const sound = {
  unlock(): void { ac(); },
  toggleMute(): boolean { muted = !muted; return muted; },
  get muted(): boolean { return muted; },
  click(): void { blip(660, 0.07, 'sine', 0.1); },
  buy(): void { blip(523, 0.09, 'triangle', 0.14); blip(784, 0.12, 'triangle', 0.14, 0.08); },
  deny(): void { blip(220, 0.12, 'sawtooth', 0.06); },
  coin(): void { blip(988, 0.08, 'sine', 0.1); blip(1319, 0.1, 'sine', 0.1, 0.07); },
  dessert(): void { blip(587, 0.1, 'triangle', 0.14); blip(880, 0.14, 'triangle', 0.14, 0.09); },
};
