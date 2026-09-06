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
