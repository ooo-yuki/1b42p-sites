// WebAudio-бипы без файлов — 1-в-1 из legacy.html. Единый модуль звука.
let AC: AudioContext | null = null;

function ctx(): AudioContext | null {
  try {
    const W = window as unknown as { AudioContext: typeof AudioContext; webkitAudioContext: typeof AudioContext };
    AC = AC || new (W.AudioContext || W.webkitAudioContext)();
    if (AC.state === 'suspended') void AC.resume();
    return AC;
  } catch {
    return null;
  }
}

export function beep(f0: number, f1: number, dur: number, type?: OscillatorType, vol?: number): void {
  try {
    const ac = ctx();
    if (!ac) return;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type || 'square';
    o.frequency.setValueAtTime(f0, ac.currentTime);
    o.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), ac.currentTime + dur);
    g.gain.setValueAtTime(vol || 0.08, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
    o.connect(g);
    g.connect(ac.destination);
    o.start();
    o.stop(ac.currentTime + dur);
  } catch {
    /* тихо */
  }
}

export const sndJump = (): void => {
  beep(300, 700, 0.15, 'square', 0.07);
};

export const sndLose = (): void => {
  beep(400, 80, 0.5, 'sawtooth', 0.1);
  setTimeout(() => beep(300, 60, 0.5, 'sawtooth', 0.08), 120);
};

export const sndLevel = (): void => {
  beep(500, 1000, 0.12, 'square', 0.06);
};

export function blip(f: number): void {
  try {
    const ac = ctx();
    if (!ac) return;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = 'square';
    o.frequency.value = f;
    g.gain.setValueAtTime(0.12, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.15);
    o.connect(g);
    g.connect(ac.destination);
    o.start();
    o.stop(ac.currentTime + 0.16);
  } catch {
    /* тихо */
  }
}
