export const ENEMIES = {
  runner: { hp: 40, speed: 5.0, dmg: 10, cost: 1 },
  shooter: { hp: 50, speed: 3.2, dmg: 8, cost: 2 },
  tank: { hp: 200, speed: 2.0, dmg: 20, cost: 4 },
  boss: { hp: 1200, speed: 3.0, dmg: 25, cost: 99 },
};
// Дальности атак (м): шутер урезан 25→18, мили ужаты на полшага.
export const ATTACK_RANGE = { shooter: 18, melee: 1.3, tank: 2.5, boss: 3.0 };

export type EnemyType = keyof typeof ENEMIES;

/** Визитка моба для Вики: имя, иконка-эмодзи, описание и тактика. */
export interface EnemyMeta {
  name: string;
  icon: string;
  desc: string;
  tactic: string;
}
export const ENEMY_META: Record<EnemyType, EnemyMeta> = {
  runner: {
    name: 'Бегун',
    icon: '🏃',
    desc: 'Быстрый милишник. Бежит толпой, кусает в упор (10 урона).',
    tactic: 'Дробовик в упор или очередь из АК. Не давай окружить.',
  },
  shooter: {
    name: 'Стрелок',
    icon: '🔫',
    desc: 'Держит 12м и стреляет (8 урона, дальность 18м). Подсвечивает фонарём.',
    tactic: 'Сокращай дистанцию или снимай из ПМ издалека.',
  },
  tank: {
    name: 'Танк',
    icon: '🛡️',
    desc: 'Живая стена: 200 HP, бьёт на 20 и отбрасывает. По броне — рикошет-искры.',
    tactic: 'Кайти, стреляй в корпус из АК, держи дистанцию 3м+.',
  },
  boss: {
    name: 'Чайка Рукрасии',
    icon: 'Чайка',
    desc: 'Босс 7-й волны: 1200 HP, бьёт на 25, раз в 12с призывает 2 бегунов.',
    tactic: 'Круги по арене, фокус в голову стаи — босса последним.',
  },
};
