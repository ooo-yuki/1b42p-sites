/* Пищалка 1:1 с legacy blip: квадрат, 0.08 → тихо за 0.15с. */
let ac: AudioContext | null = null;

export function blip(f: number): void {
  try {
    if (!ac) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      ac = new Ctor();
    }
    if (ac.state === 'suspended') void ac.resume();
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = 'square';
    o.frequency.value = f;
    g.gain.setValueAtTime(0.08, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.15);
    o.connect(g);
    g.connect(ac.destination);
    o.start();
    o.stop(ac.currentTime + 0.16);
  } catch {
    /* без звука — игра идёт дальше */
  }
}
