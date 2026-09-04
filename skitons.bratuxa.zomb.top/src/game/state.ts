// Состояние игры: монеты, уровни, заработок, метка сейва для офлайна.
import { UPGRADES, costOf, incomePerSec, levelOf, type Levels, type UpgradeId } from './balance';

export type { Levels, UpgradeId };
export const SAVE_KEY = 'skitons-cafe-v1';
export const START_COINS = 350;
export const CLICK_COOLDOWN = 10;

export interface GameState { coins: number; levels: Levels; totalEarned: number; savedAt: number }

export function newGame(): GameState {
  return { coins: START_COINS, levels: {}, totalEarned: 0, savedAt: Date.now() };
}

export function load(): GameState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return newGame();
    const p = JSON.parse(raw) as Partial<GameState>;
    if (typeof p.coins !== 'number' || typeof p.levels !== 'object' || !p.levels) return newGame();
    return {
      coins: p.coins,
      levels: p.levels,
      totalEarned: p.totalEarned ?? 0,
      savedAt: typeof p.savedAt === 'number' ? p.savedAt : Date.now(),
    };
  } catch { return newGame(); }
}

export function save(s: GameState): void {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify({ ...s, savedAt: Date.now() })); } catch { /* ignore */ }
}

/** null — нельзя купить (нет денег или max). */
export function buy(s: GameState, id: UpgradeId): GameState | null {
  const lv = levelOf(s.levels, id);
  const meta = UPGRADES[id];
  if (lv >= meta.max) return null;
  const cost = costOf(id, lv);
  if (s.coins < cost) return null;
  return { coins: s.coins - cost, levels: { ...s.levels, [id]: lv + 1 }, totalEarned: s.totalEarned, savedAt: s.savedAt };
}

export function tick(s: GameState, dtSec: number): GameState {
  const gain = incomePerSec(s.levels) * dtSec;
  return { coins: s.coins + gain, levels: s.levels, totalEarned: s.totalEarned + gain, savedAt: s.savedAt };
}

/** Десерт: мгновенный бонус ~5 сек дохода, минимум 8. */
export function clickBonus(s: GameState): { state: GameState; amount: number } {
  const amount = Math.max(8, incomePerSec(s.levels) * 5);
  const state: GameState = { coins: s.coins + amount, levels: s.levels, totalEarned: s.totalEarned + amount, savedAt: s.savedAt };
  return { state, amount };
}
