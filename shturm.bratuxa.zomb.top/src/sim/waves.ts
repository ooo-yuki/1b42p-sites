import { ENEMIES } from './enemies';
export interface Spawn { type: keyof typeof ENEMIES; }
const BUDGET = [0, 10, 14, 18, 24, 30, 36];
export function makeWave(n: number): Spawn[] {
  if (n >= 7) return [{ type: 'boss' }, { type: 'runner' }, { type: 'runner' }, { type: 'shooter' }];
  let b = BUDGET[n] ?? 10; const out: Spawn[] = [];
  while (b >= 4 && out.length < 20) { out.push({ type: 'tank' }); b -= 4; }
  while (b >= 2) { out.push({ type: 'shooter' }); b -= 2; }
  while (b >= 1) { out.push({ type: 'runner' }); b -= 1; }
  return out;
}
