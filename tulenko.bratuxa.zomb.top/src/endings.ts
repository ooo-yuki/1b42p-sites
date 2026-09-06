// Концовка крыши слоя 3. Берёт things.ts (спуск), clock.ts (ночь). Даёт tryRoof(S).
// Ночь, клетка крыши, спуск в суме — победа. Нет спуска — предупреждение.
// День — ждать ночи.

export interface RoofState {
  atRoof: boolean;
  night: boolean;
  bag: string[];
}

function has(S: RoofState, id: string): boolean {
  if (!S || !S.bag) return false;
  return S.bag.indexOf(id) >= 0;
}

// Крыша: ночью со спуском — 'win', ночью без спуска — 'warn', днём — 'wait'.
export function tryRoof(S: RoofState): string {
  if (!S || S.atRoof !== true) return 'wait';
  if (S.night !== true) return 'wait';
  if (has(S, 'спуск')) return 'win';
  return 'warn';
}

// Концовка ворот слоя 3. Берёт things.ts (кляп), розыск. Даёт tryGate(S).
// День, ворота, кляп в суме, розыск ноль — победа. Иначе отказ молча.

export interface GateState {
  atGate: boolean;
  day: boolean;
  bag: string[];
  heat: number;
}

function hasGate(S: GateState, id: string): boolean {
  if (!S || !S.bag) return false;
  return S.bag.indexOf(id) >= 0;
}

// Ворота: день + ворота + кляп + розыск ноль — 'win', иначе — 'deny'.
export function tryGate(S: GateState): string {
  if (!S || S.atGate !== true) return 'deny';
  if (S.day !== true) return 'deny';
  if (S.heat !== 0) return 'deny';
  if (!hasGate(S, 'кляп')) return 'deny';
  return 'win';
}
