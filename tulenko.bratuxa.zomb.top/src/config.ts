export interface Balance {
  hearts: number; saveKey: string; step: number;
  walk: number; jump: number; gravity: number;
  guardSpeed: number; sight: number; stunSec: number;
}
export const CFG: Balance = {
  hearts: 3, saveKey: 'tulenko_best_v1', step: 0.016,
  walk: 3.2, jump: 7.5, gravity: 22.0,
  guardSpeed: 1.6, sight: 4.5, stunSec: 4.0,
};
