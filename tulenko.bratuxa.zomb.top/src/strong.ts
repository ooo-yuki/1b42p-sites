// Сила слоя 2. Качалка раз в день: pump(S) даёт +1 к силе, потолок 5,
// повторный вызов в тот же день не растёт. need(S, n): хватает ли силы.

export function pump(S: { power: number; pumpedDay: number; day: number }): number {
  if (S.pumpedDay === S.day) return S.power;
  S.pumpedDay = S.day;
  S.power = Math.min(5, S.power + 1);
  return S.power;
}

export function need(S: { power: number }, n: number): boolean {
  return S.power >= n;
}
