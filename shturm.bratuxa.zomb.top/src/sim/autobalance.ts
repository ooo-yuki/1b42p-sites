export function autobalance(deaths: number, accuracy: number): number {
  if (deaths >= 2) return 0.85;
  if (deaths === 0 && accuracy > 0.4) return 1.15;
  return 1.0;
}
