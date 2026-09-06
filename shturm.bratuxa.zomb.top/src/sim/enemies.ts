export const ENEMIES = {
  runner: { hp: 40, speed: 5.0, dmg: 10, cost: 1 },
  shooter: { hp: 50, speed: 3.2, dmg: 8, cost: 2 },
  tank: { hp: 200, speed: 2.0, dmg: 20, cost: 4 },
  boss: { hp: 1200, speed: 3.0, dmg: 25, cost: 99 },
};
// Дальности атак (м): шутер урезан 25→18, мили ужаты на полшага.
export const ATTACK_RANGE = { shooter: 18, melee: 1.3, tank: 2.5, boss: 3.0 };
