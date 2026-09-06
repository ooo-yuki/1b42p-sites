// Обыски и карцер верхнего слоя. Берёт суму из things.ts (bag),
// часы из clock.ts (heat), отдаёт search и leaveSolitary.
// Обыск в камере находит запретное, уводит в карцер до утра, вещи отобраны.

export interface SearchState {
  bag?: string[];
  items?: string[];
  solitary?: boolean;
  heat?: number;
  wanted?: number;
  seal?: { x: number; y: number };
  cell?: { x: number; y: number };
  spawn?: { x: number; y: number };
}

// Запретное для обысков: орудия и сборка (ложка, верёвка, кляп, спуск).
// Тряпка и мыло — безвинны, обыск их не берёт.
const FORBIDDEN: string[] = ['ложка', 'верёвка', 'кляп', 'спуск'];

export function isForbidden(id: string): boolean {
  return FORBIDDEN.indexOf(id) >= 0;
}

function sack(S: SearchState): string[] {
  if (S === null || S === undefined) return [];
  if (Array.isArray(S.bag)) return S.bag;
  if (Array.isArray(S.items)) return S.items;
  return [];
}

// Обыск: возвращает найденное запретное. Нашёл — карцер до утра:
// розыск три, возврат в камеру, вещи отобраны. Чист — тишина.
export function search(S: SearchState): string[] {
  if (S === null || S === undefined) return [];
  const found: string[] = [];
  const have = sack(S);
  for (const id of have) {
    if (isForbidden(id)) found.push(id);
  }
  if (found.length === 0) return found;
  if (typeof S.heat === 'number') S.heat = 3;
  if (typeof S.wanted === 'number') S.wanted = 3;
  if (S.heat === undefined && S.wanted === undefined) S.heat = 3;
  S.solitary = true;
  const home = S.cell ? S.cell : S.spawn;
  if (S.seal && home) {
    S.seal.x = home.x;
    S.seal.y = home.y;
  }
  if (Array.isArray(S.bag)) S.bag.length = 0;
  if (Array.isArray(S.items)) S.items.length = 0;
  return found;
}

// Утро: карцер отпускает.
export function leaveSolitary(S: SearchState): void {
  if (S === null || S === undefined) return;
  S.solitary = false;
}
