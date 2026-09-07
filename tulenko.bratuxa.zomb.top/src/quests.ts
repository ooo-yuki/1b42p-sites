// Дела путей слоя 3. Берёт things.ts (спуск, кляп, ствол, ложка,
// отрава, BRIBE = 30) и strong.ts (need: хватает ли силы).
// Даёт QUESTS (8 дел) и done(S, id): все шаги честно сошлись
// (вещь/место/время/сила/монеты).

export interface Quest {
  bag: string[];
  at?: string;
  night?: boolean;
  power?: number;
  coins?: number;
  heat?: number;
  dug?: number;
  deal?: boolean;
}

export const QUESTS = [
  { id: 'roof', steps: ['ночь', 'крыша', 'спуск в суме'] },
  { id: 'gate', steps: ['день', 'ворота', 'кляп в суме', 'розыск 0'] },
  { id: 'fence', steps: ['ночь', 'двор', 'сила 3'] },
  { id: 'bribe', steps: ['начальник', '30 монет'] },
  { id: 'guns', steps: ['ворота', 'ствол в суме', 'сила 2'] },
  { id: 'tunnel', steps: ['камера', 'ложка в суме', 'копки 3 ночи'] },
  { id: 'poison', steps: ['кухня', 'отрава в суме', 'договор'] },
  { id: 'quiet', steps: ['ночь', 'ворота', 'розыск 0'] },
];

function has(S: Quest, id: string): boolean {
  if (!S || !S.bag) return false;
  return S.bag.indexOf(id) >= 0;
}

// Хватает ли силы (need из strong.ts).
function need(S: Quest, n: number): boolean {
  const p: number = typeof S.power === 'number' ? S.power : 0;
  return p >= n;
}

function coins(S: Quest): number {
  return typeof S.coins === 'number' ? S.coins : 0;
}

// Дело сделано: вещь, место, время, сила и монеты сошлись.
export function done(S: Quest, id: string): boolean {
  if (!S) return false;
  if (id === 'roof') {
    return S.at === 'roof' && S.night === true && has(S, 'спуск');
  }
  if (id === 'gate') {
    return S.at === 'gate' && S.night !== true && S.heat === 0 && has(S, 'кляп');
  }
  if (id === 'fence') {
    return S.at === 'yard' && S.night === true && need(S, 3);
  }
  if (id === 'bribe') {
    return S.at === 'boss' && coins(S) >= 30;
  }
  if (id === 'guns') {
    return S.at === 'gate' && has(S, 'ствол') && need(S, 2);
  }
  if (id === 'tunnel') {
    const dug: number = typeof S.dug === 'number' ? S.dug : 0;
    return S.at === 'cell' && has(S, 'ложка') && dug >= 3;
  }
  if (id === 'poison') {
    return S.at === 'kitchen' && has(S, 'отрава') && S.deal === true;
  }
  if (id === 'quiet') {
    return S.at === 'gate' && S.night === true && S.heat === 0;
  }
  return false;
}
