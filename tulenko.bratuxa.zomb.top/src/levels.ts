export const GLYPHS = '#=-KFE GPcfpbrt';
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
    if (!('#=-KFE GPcfpbrt'.includes(ch))) bad.push('чужой знак ' + ch);
  }
  return [...new Set(bad)];
}
// Знаки мебели (густо, проход держат полом): c ящик, f поднос, p плакат,
// b бочка, r тачка — в работу, t факел — на стены.
// Стоят на полу у стен, стены и коридоры целы, P/E/K/F на месте.
export const LEVELS: string[][] = [
  [
    '################',
    '#P t   K  t   E#',
    '#   ######     #',
    '#cc  b    b r p#',
    '#t     G      t#',
    '# b F  G  r    #',
    '#t ff      ff t#',
    '################',
  ],
  [
    '################',
    '#P t ff   t  pE#',
    '# r F    K b   #',
    '#   ----- b r  #',
    '#cc b r  G   tp#',
    '# r-----b t ---#',
    '################',
  ],
  [
    '################',
    '#Ppt  == t  K E#',
    '#  r  == b     #',
    '#  G r ==b F   #',
    '#   b  == r G  #',
    '#cc fft b pprt #',
    '################',
  ],
];
