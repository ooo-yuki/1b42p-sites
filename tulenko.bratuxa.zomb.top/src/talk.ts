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
  heat?: number;
  opened?: string[];
}

export const FACE: string = 'img/face_wisp.png';

const NODES: TalkLine[] = [
  { id: 'm1', who: 'дух', text: 'Утро. Поверка скоро — держись места, не шуми.', face: FACE },
  { id: 'n1', who: 'дух', text: 'Обед. Миска лечит сердце, работа даёт монеты.', face: FACE },
  { id: 'e1', who: 'дух', text: 'Вечер. Ночью торговец, тихо — спуск или кляп.', face: FACE },
  { id: 'cook_help', who: 'повар', text: 'Помогу на кухне — отрава для мисок будет твоя.', face: FACE },
  { id: 'cook_rude', who: 'повар', text: 'Грубишь повару — повар зовёт охрану.', face: FACE },
  { id: 'brig_help', who: 'бригадир', text: 'Выйдешь в смену — смена прикроет твои дела.', face: FACE },
  { id: 'brig_rude', who: 'бригадир', text: 'Грубишь бригадиру — бригадир свистит охране.', face: FACE },
  { id: 'chief_help', who: 'начальник', text: 'Служишь тихо — пропуск подпишу без шума.', face: FACE },
  { id: 'chief_rude', who: 'начальник', text: 'Грубишь начальнику — розыск растёт.', face: FACE },
  { id: 'trade_help', who: 'торговец', text: 'Платишь делом — кляп для ворот будет твой.', face: FACE },
  { id: 'trade_rude', who: 'торговец', text: 'Грубишь торговцу — торговец сдаёт тебя.', face: FACE },
  { id: 'cell_help', who: 'сокамерник', text: 'Держимся вместе — спуск с крыши покажу.', face: FACE },
  { id: 'cell_rude', who: 'сокамерник', text: 'Грубишь своим — камера шумит, охрана идёт.', face: FACE },
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

function helpStep(id: string): string {
  if (id === 'cook_help') return 'poison';
  if (id === 'brig_help') return 'shift';
  if (id === 'chief_help') return 'pass';
  if (id === 'trade_help') return 'gag';
  if (id === 'cell_help') return 'descent';
  return '';
}

export function say(S: TalkState, id: string): void {
  S.flags[id] = true;
  const step = helpStep(id);
  if (step && S.opened && !S.opened.includes(step)) S.opened.push(step);
  if (id.endsWith('_rude') && typeof S.heat === 'number') S.heat += 1;
}
