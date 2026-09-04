/* Общий синтезатор зала: WebAudio, без файлов. Тихий по умолчанию? Нет — играет,
   пока пользователь не выключил. Флаг в localStorage sasha_sound. */

const KEY = 'sasha_sound';
let ctx: AudioContext | null = null;
let muted = false;

try {
  muted = localStorage.getItem(KEY) === '0';
} catch { /* приватный режим */ }

export function isMuted(): boolean {
  return muted;
}

export function setMuted(m: boolean): void {
  muted = m;
  try {
    localStorage.setItem(KEY, m ? '0' : '1');
  } catch { /* приватный режим */ }
}

function ac(): AudioContext | null {
  if (muted) return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, dur: number, type: OscillatorType, vol: number, when = 0): void {
  const c = ac();
  if (!c) return;
  try {
    const t0 = c.currentTime + when;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(c.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  } catch { /* звук не критичен */ }
}

function noise(dur: number, vol: number, lowpass: number): void {
  const c = ac();
  if (!c) return;
  try {
    const t0 = c.currentTime;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource();
    src.buffer = buf;
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = lowpass;
    const g = c.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f);
    f.connect(g);
    g.connect(c.destination);
    src.start(t0);
  } catch { /* звук не критичен */ }
}

export const sfx = {
  click(): void {
    tone(660, 0.07, 'square', 0.04);
  },
  tick(): void {
    tone(880, 0.05, 'square', 0.03);
  },
  coin(): void {
    tone(988, 0.09, 'square', 0.05);
    tone(1319, 0.16, 'square', 0.05, 0.08);
  },
  win(): void {
    tone(523, 0.12, 'triangle', 0.07);
    tone(659, 0.12, 'triangle', 0.07, 0.1);
    tone(784, 0.22, 'triangle', 0.08, 0.2);
  },
  bigwin(): void {
    tone(523, 0.12, 'triangle', 0.08);
    tone(659, 0.12, 'triangle', 0.08, 0.1);
    tone(784, 0.12, 'triangle', 0.08, 0.2);
    tone(1047, 0.3, 'triangle', 0.09, 0.3);
    tone(1319, 0.34, 'sine', 0.06, 0.42);
  },
  lose(): void {
    tone(330, 0.16, 'sawtooth', 0.05);
    tone(233, 0.26, 'sawtooth', 0.05, 0.14);
  },
  rumble(dur = 1.2): void {
    noise(dur, 0.12, 320);
  },
  boom(): void {
    noise(0.7, 0.2, 900);
    tone(110, 0.5, 'sine', 0.12);
  },
  flip(): void {
    tone(440, 0.06, 'triangle', 0.04);
    tone(560, 0.06, 'triangle', 0.04, 0.05);
  },
  reveal(): void {
    tone(392, 0.1, 'triangle', 0.06);
    tone(523, 0.1, 'triangle', 0.06, 0.09);
    tone(659, 0.18, 'triangle', 0.07, 0.18);
  },
};
