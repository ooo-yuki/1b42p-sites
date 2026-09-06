// Звук гудками: гудок качается кодом через WebAudio, без внешних файлов.
//
// Первый вызов blip() должен случаться после кнопки игрока
// (user gesture), иначе браузер держит AudioContext закрытым и молчит.
// Без звука (нет WebAudio / исключение) — молча идём дальше, без throws.

export type BlipKind = "step" | "pickup" | "hit" | "win" | "lose";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (ctx) {
      if (ctx.state === "suspended") void ctx.resume().catch(() => {});
      return ctx;
    }
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    if (ctx.state === "suspended") void ctx.resume().catch(() => {});
    return ctx;
  } catch {
    return null;
  }
}

function beep(
  ac: AudioContext,
  freq: number,
  dur: number,
  type: OscillatorType,
  when = 0,
  gainValue = 0.15,
): void {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  const t0 = ac.currentTime + when;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(gainValue, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

// Высота и длина свои на каждый случай.
export function blip(kind: BlipKind): void {
  try {
    const ac = getCtx();
    if (!ac) return;
    switch (kind) {
      case "step": // шаг: короткий низкий квадрат
        beep(ac, 300, 0.06, "square", 0, 0.08);
        break;
      case "pickup": // подбор: высокий звонкий синус
        beep(ac, 880, 0.12, "sine");
        break;
      case "hit": // удар: низкий рычащий пилозуб
        beep(ac, 110, 0.25, "sawtooth", 0, 0.2);
        break;
      case "win": // победа: три восходящих гудка
        beep(ac, 523, 0.12, "sine");
        beep(ac, 659, 0.12, "sine", 0.13);
        beep(ac, 784, 0.25, "sine", 0.26);
        break;
      case "lose": // поражение: три нисходящих гудка
        beep(ac, 392, 0.15, "triangle");
        beep(ac, 311, 0.15, "triangle", 0.16);
        beep(ac, 233, 0.35, "triangle", 0.32);
        break;
    }
  } catch {
    // без звука — молча идём дальше
  }
}
