// Вещи и сборка слоя 2. Ничего не берёт, даёт pick, craft, has,
// находки (тряпка, ложка, верёвка, мыло), сборку (кляп, спуск) и торговца.

export interface Sack {
  bag: string[];
  coins?: number;
  night?: boolean;
}

export const LOOT: string[] = ['тряпка', 'ложка', 'верёвка', 'мыло'];

export const RECIPES: Record<string, string[]> = {
  'кляп': ['ложка', 'тряпка'],
  'спуск': ['верёвка', 'мыло'],
};

// Запретное для обысков: с ним в суме — карцер.
export const FORBIDDEN: string[] = ['ложка', 'кляп', 'спуск'];

// Торговец ночью (ночь из clock.ts): монеты в запретное.
// Цены: ложка 2, верёвка 3, мыло 2. Днём торговца нет.
export const TRADER_PRICES: Record<string, number> = { 'ложка': 2, 'верёвка': 3, 'мыло': 2 };
export const TRADER_PRICE: number = 2;

export function has(S: Sack, id: string): boolean {
  if (!S || !S.bag) return false;
  return S.bag.indexOf(id) >= 0;
}

function take(S: Sack, id: string): boolean {
  if (!S || !S.bag) return false;
  const i = S.bag.indexOf(id);
  if (i < 0) return false;
  S.bag.splice(i, 1);
  return true;
}

// Подобрать находку в суму.
export function pick(S: Sack, id: string): void {
  if (!S || !S.bag) return;
  if (typeof id !== 'string' || id === '') return;
  S.bag.push(id);
}

// Сборка: без нужного в суме не выходит, состав уходит в дело.
export function craft(S: Sack, id: string): boolean {
  if (!S || !S.bag) return false;
  const parts = RECIPES[id];
  if (!parts) return false;
  if (has(S, id)) return true;
  for (const p of parts) {
    if (!has(S, p)) return false;
  }
  for (const p of parts) {
    take(S, p);
  }
  S.bag.push(id);
  return true;
}

// Запретное помечено для обысков.
export function isForbidden(id: string): boolean {
  return FORBIDDEN.indexOf(id) >= 0;
}

// В суме есть запретное — обыск ведёт в карцер.
export function hasForbidden(S: Sack): boolean {
  if (!S || !S.bag) return false;
  for (const id of S.bag) {
    if (isForbidden(id)) return true;
  }
  return false;
}

// Торговец ночью: монеты в обмен на ложку, верёвку, мыло.
// Мало монет или день — торга нет.
export function deal(S: Sack, id: string): boolean {
  if (!S || !S.bag) return false;
  if (S.night !== true) return false;
  const price = TRADER_PRICES[id];
  if (typeof price !== 'number') return false;
  if (typeof S.coins !== 'number' || S.coins < price) return false;
  S.coins -= price;
  S.bag.push(id);
  return true;
}
