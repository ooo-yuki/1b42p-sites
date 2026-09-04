/* гимн + клёкот орла после взрыва (WebAudio, без файлов) */
let AU: AudioContext | null = null;

function auCtx(): AudioContext | null {
  try {
    if (!AU) {
      const C =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!C) return null;
      AU = new C();
    }
    if (AU.state === 'suspended') void AU.resume();
    return AU;
  } catch {
    return null;
  }
}

/** Торжественный мотив после взрыва */
export function playAnthem(): void {
  try {
    const ac = auCtx();
    if (!ac) return;
    const seq: Array<[number, number]> = [
      [392, 0.22],
      [392, 0.22],
      [392, 0.4],
      [440, 0.4],
      [466.16, 0.4],
      [466.16, 0.4],
      [440, 0.22],
      [392, 0.22],
      [440, 0.9],
      [523.25, 0.9],
    ];
    const g = ac.createGain();
    g.gain.value = 0.22;
    g.connect(ac.destination);
    let t = ac.currentTime + 0.05;
    seq.forEach(([freq, dur]) => {
      if (!ac) return;
      const o = ac.createOscillator();
      o.type = 'triangle';
      o.frequency.value = freq;
      const og = ac.createGain();
      og.gain.setValueAtTime(0, t);
      og.gain.linearRampToValueAtTime(1, t + 0.03);
      og.gain.setValueAtTime(1, t + Math.max(0.05, dur - 0.05));
      og.gain.linearRampToValueAtTime(0, t + dur);
      o.connect(og);
      og.connect(g);
      o.start(t);
      o.stop(t + dur + 0.05);
      t += dur + 0.04;
    });
  } catch {
    /* ignore */
  }
}

/** Двойной клёкот орла */
export function eagleScream(delay = 0): void {
  try {
    const ac = auCtx();
    if (!ac) return;
    const t0 = ac.currentTime + delay;
    [1, 0.6].forEach((v, i) => {
      if (!ac) return;
      const o = ac.createOscillator();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(2400, t0 + i * 0.4);
      o.frequency.exponentialRampToValueAtTime(750, t0 + i * 0.4 + 1.0);
      const lfo = ac.createOscillator();
      lfo.frequency.value = 28;
      const lg = ac.createGain();
      lg.gain.value = 0.5 * v;
      lfo.connect(lg);
      const g = ac.createGain();
      g.gain.value = 0.12 * v;
      lg.connect(g.gain);
      o.connect(g);
      g.connect(ac.destination);
      o.start(t0 + i * 0.4);
      o.stop(t0 + i * 0.4 + 1.1);
      lfo.start(t0 + i * 0.4);
      lfo.stop(t0 + i * 0.4 + 1.1);
    });
  } catch {
    /* ignore */
  }
}
