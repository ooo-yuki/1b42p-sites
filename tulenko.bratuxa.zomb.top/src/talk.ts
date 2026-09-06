// Разговоры и нить верхнего слоя. Берёт флаги памяти, даёт talkFor и say.
// Три узла на день: утро, обед, вечер. Концы: крыша (нужен спуск),
// ворота (нужен кляп). Лицо духа рядом с речью: img/face_wisp.png.

export interface TalkLine {
  id: string;
  who: string;
  text: string;
  face: string;
}

export interface TalkState {
  flags: Record<string, boolean>;
}

export const FACE: string = 'img/face_wisp.png';

const NODES: TalkLine[] = [
  { id: 'm1', who: 'дух', text: 'Утро. Поверка скоро — держись места, не шуми.', face: FACE },
  { id: 'n1', who: 'дух', text: 'Обед. Миска лечит сердце, работа даёт монеты.', face: FACE },
  { id: 'e1', who: 'дух', text: 'Вечер. Ночью торговец, тихо — спуск или кляп.', face: FACE },
  { id: 'roof', who: 'дух', text: 'Спуск готов. Тихий уход через крышу ждёт.', face: FACE },
  { id: 'gate', who: 'дух', text: 'Кляп готов. Громкий уход через ворота ждёт.', face: FACE },
];

export function talkFor(S: TalkState): TalkLine[] {
  const out: TalkLine[] = [];
  for (const n of NODES) {
    if (S.flags[n.id]) continue;
    if (n.id === 'roof' && !S.flags.descent) continue;
    if (n.id === 'gate' && !S.flags.gag) continue;
    out.push(n);
  }
  return out;
}

export function say(S: TalkState, id: string): void {
  S.flags[id] = true;
}
