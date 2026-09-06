export const GLYPHS = '#=-KFE GPcfp';
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
    if (!('#=-KFE GPcfp'.includes(ch))) bad.push('чужой знак ' + ch);
  }
  return [...new Set(bad)];
}
// Знаки мебели (густо, проход держат полом): c ящик, f поднос, p плакат.
// Стоят на полу у стен, стены и коридоры целы, P/E/K/F на месте.
export const LEVELS: string[][] = [
  [
    '################',
    '#P     K      E#',
    '#   ######     #',
    '#cc           p#',
    '#      G       #',
    '#   F  G       #',
    '#  ff      ff  #',
    '################',
  ],
  [
    '################',
    '#P   ff      pE#',
    '#   F    K     #',
    '#   -----      #',
    '#cc      G    p#',
    '#  -----    ---#',
    '################',
  ],
  [
    '################',
    '#Pp   ==    K E#',
    '#     ==       #',
    '#  G   ==  F   #',
    '#      ==   G  #',
    '#cc ff    pp   #',
    '################',
  ],
];
