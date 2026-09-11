export const GOOD_WORDS: string[] = [
  'легенда', 'лучший', 'лучшая', 'добрый', 'щедрый', 'умный', 'красивый',
  'великий', 'могучий', 'честный', 'смелый', 'храбрый', 'мудрый', 'талант',
  'гений', 'герой', 'титан', 'мастер', 'профи', 'красавчик', 'красавец',
  'молодец', 'уважаю', 'обожаю', 'восхищаюсь', 'горжусь', 'верю', 'поддерживаю',
  'сила', 'мощь', 'честь', 'слава', 'победа', 'чемпион', 'король', 'богатырь',
  'атлет', 'добряк', 'душка', 'солнце',
];

export const BAD_WORDS: string[] = [
  'дурак', 'лох', 'тупой', 'идиот', 'дебил', 'кретин', 'урод',
  'ничтожество', 'слабак', 'трус', 'жадный', 'злой', 'глупый', 'бездарь',
  'позор', 'отстой', 'дно', 'мудак', 'придурок', 'балбес',
];

const GOOD_POINTS = [10, 5, 2, 0];

function wordsOf(text: string): string[] {
  return text.toLowerCase().replace(/[^а-яёa-z\s]/gi, ' ').split(/\s+/).filter(Boolean);
}

export function scoreText(text: string): number {
  const ws = wordsOf(text);
  const seen = new Map<string, number>();
  let score = 0;
  for (const w of ws) {
    if (GOOD_WORDS.includes(w)) {
      const n = seen.get(w) ?? 0;
      score += GOOD_POINTS[Math.min(n, GOOD_POINTS.length - 1)] ?? 0;
      seen.set(w, n + 1);
    } else if (BAD_WORDS.includes(w)) {
      score -= 15;
    }
  }
  return score;
}
