export const GLYPHS = '#=-KFE GP';
export function checkMap(map: string[]): string[] {
  const bad: string[] = [];
  if (map.length === 0) return ['пустая карта'];
  const w = map[0].length;
  const flat = map.join('');
  if (!map.every((r) => r.length === w)) bad.push('строки разной длины');
  for (const must of ['P', 'E', 'K', 'F']) {
    if (!flat.includes(must)) bad.push('нет знака ' + must);
  }
  for (const ch of flat) {
    if (!('#=-KFE GP'.includes(ch))) bad.push('чужой знак ' + ch);
  }
  return [...new Set(bad)];
}
export const LEVELS: string[][] = [
  [
    '################',
    '#P     K      E#',
    '#   ######     #',
    '#              #',
    '#      G       #',
    '#   F  G       #',
    '#              #',
    '################',
  ],
  [
    '################',
    '#P            E#',
    '#   F    K     #',
    '#   -----      #',
    '#        G     #',
    '#  -----    ---#',
    '################',
  ],
  [
    '################',
    '#P    ==    K E#',
    '#     ==       #',
    '#  G   ==  F   #',
    '#      ==   G  #',
    '#              #',
    '################',
  ],
];
