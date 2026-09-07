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

// Мир большой тюрьмы: 6 корпусов. Карты — копии src/maps/*
// (импорт сюда нельзя: пробы levels.test.js клеят файл грубой
// склейкой без import/export — лишний export ломает их сборку).
// При правке src/maps/* обнови копии здесь же.
// Имена те же, что ждут двери doors.ts.
const WORLD_IDS: string[] = ['cells', 'kitchen', 'yard', 'wash', 'work', 'gate'];
const WORLD_NAMES: string[] = ['Камеры', 'Кухня', 'Двор', 'Душ', 'Работа', 'Ворота'];
const WORLD_MAPS: string[][] = [
  [
    '##############################',
    '#P      BBBB      BBBB      E#',
    '#       BBBB      BBBB       #',
    '#                            #',
    '#  BBBB        K       BBBB  #',
    '#  BBBB                   G  #',
    '#                            #',
    '#       D            D       #',
    '#                            #',
    '#  BBBB               BBBB   #',
    '#  BBBB      F        BBBB   #',
    '#                            #',
    '#       BBBB      BBBB       #',
    '#       BBBB      BBBB       #',
    '#G                           #',
    '##############################',
  ],
  [
    '##############################',
    '#P      OOOO      TTTT      E#',
    '#       OOOO      TTTT       #',
    '#                            #',
    '#  TTTT       K       TTTT   #',
    '#  TTTT                   G  #',
    '#       OOOO      OOOO       #',
    '#        D          D        #',
    '#                            #',
    '#  TTTT               TTTT   #',
    '#  TTTT      F        OOOO   #',
    '#                     OOOO   #',
    '#       TTTT      TTTT       #',
    '#       TTTT      TTTT       #',
    '#G                           #',
    '##############################',
  ],
  [
    '##############################',
    '#P      K        F       G   #',
    '#                            #',
    '#            HHHH            #',
    '#         G  HHHH            #',
    'D                            #',
    '#                            #',
    '#         G                  D',
    '#                            #',
    '#                            #',
    'ZZZZZZZZZZZZZEZZZZZZZZZZZZZZZZ',
    '##############################',
  ],
  [
    '##############################',
    '#  SSS  SSS  SSS  SSS        #',
    '#  SSS  SSS  SSS  SSS    K   #',
    '#                            #',
    '#P           G           F   #',
    '#                            #',
    '#                          VV#',
    '#                          VV#',
    '#                            #',
    '#                            #',
    '#             E              #',
    '##############D###############',
  ],
  [
    '########################',
    '#P    JJ  JJ    K     E#',
    '#     JJ  JJ           #',
    '#                      #',
    '#  A        G       F  #',
    '#  A                   #',
    '#     JJ  JJ           #',
    '#     JJ  JJ           #',
    '#D                     #',
    '########################',
  ],
  [
    '########################',
    '#P   CC        K       #',
    '#    CC               F#',
    '#    CC    G           #',
    '#D   CC                #',
    '#    CC                #',
    '#####E##################',
    '=====E==================',
    '                       #',
    '########################',
  ],
];

// Карта корпуса по имени. Чужое имя — камеры.
function worldMap(id: string): string[] {
  const i = WORLD_IDS.indexOf(id);
  if (i < 0) return WORLD_MAPS[0];
  return WORLD_MAPS[i];
}
