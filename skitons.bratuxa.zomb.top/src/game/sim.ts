// Подсказки и офлайн-прогресс: что купить дальше, доход за отсутствие.
// Работает поверх src/game/balance.ts (UPGRADES — Record) и src/game/state.ts.
import { UPGRADES, costOf, guestsPerSec, incomePerSec, levelOf, type UpgradeId } from './balance';
import type { GameState } from './state';

export interface Affordable {
  id: UpgradeId;
  name: string;
  level: number;
  price: number;
}

const IDS = Object.keys(UPGRADES) as UpgradeId[];

/** Апгрейды, которые игрок может купить прямо сейчас (хватает монет, не макс). */
export function affordables(state: GameState): Affordable[] {
  const out: Affordable[] = [];
  for (const id of IDS) {
    const meta = UPGRADES[id];
    const lvl = levelOf(state.levels, id);
    if (lvl >= meta.max) continue;
    const price = costOf(id, lvl);
    if (price <= state.coins) out.push({ id, name: meta.name, level: lvl, price });
  }
  return out.sort((a, b) => a.price - b.price);
}

/** Следующая подсказка: самый дешёвый доступный, иначе самый дешёвый вообще. */
export function nextHint(state: GameState): string {
  const aff = affordables(state);
  if (aff.length > 0) {
    const a = aff[0];
    return `Купи «${a.name}» за ${a.price}`;
  }
  let cheapest = IDS[0];
  let cheapestPrice = costOf(cheapest, levelOf(state.levels, cheapest));
  for (const id of IDS.slice(1)) {
    const p = costOf(id, levelOf(state.levels, id));
    if (p < cheapestPrice) {
      cheapest = id;
      cheapestPrice = p;
    }
  }
  const need = Math.ceil(cheapestPrice - state.coins);
  return `Копи ${need} на «${UPGRADES[cheapest].name}»`;
}

/** Офлайн-прогресс: доход за отсутствие, кап — 8 часов. Не мутирует вход. */
export function offlineProgress(
  state: GameState,
  awaySec: number,
  capSec = 8 * 3600,
): { gained: number; seconds: number } {
  const seconds = Math.max(0, Math.min(awaySec, capSec));
  const gained = incomePerSec(state.levels) * seconds;
  return { gained, seconds };
}

/** Сколько гостей «обслужили», пока вкладка была закрыта (для статистики). */
export function offlineGuests(levels: GameState['levels'], awaySec: number): number {
  return guestsPerSec(levels) * Math.max(0, awaySec);
}
