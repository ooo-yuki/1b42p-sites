import type { JSX } from 'react';

/* Ручные пиксель-арт иллюстрации: каждая — сетка символов, где буква = цвет.
   '.' — прозрачный пиксель. Рендер — SVG из rect-блоков, crispEdges. */

type Pix = { grid: string[]; colors: Record<string, string> };

const K = '#3d3d3d'; // общий контур

function PixSvg({ art, className }: { art: Pix; className?: string }): JSX.Element {
  const h = art.grid.length;
  const w = Math.max(...art.grid.map((r) => r.length));
  const rects: JSX.Element[] = [];
  art.grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === '.' || ch === ' ') continue;
      const fill = art.colors[ch];
      if (!fill) continue;
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={fill} />);
    }
  });
  return (
    <svg className={className ?? 'cic'} viewBox={`-0.5 -0.5 ${w + 1} ${h + 1}`}
      shapeRendering="crispEdges" aria-hidden focusable="false">
      {rects}
    </svg>
  );
}

/* Лошадь: одна база-голова в профиль, 4 масти параметром */
function horseArt(coat: string, mane: string, dark: string): Pix {
  return {
    grid: [
      '..kk..........',
      '..kMk...kk....',
      '..kMMkkMMMMkk.',
      '..kMMMMWWWWWkk',
      '..kMMWWWWWWWWk',
      '...kMWWWEWWWWk',
      '...kMWWWWWWWWk',
      '...kWWWWWWWNNk',
      '....kWWWWWWWWk',
      '....kWWWWWWWk.',
      '.....kWWWWWWk.',
      '.....kWWWWk...',
      '.....kWWk.....',
      '.....kkk......',
    ],
    colors: { k: K, M: mane, W: coat, E: K, N: dark },
  };
}

const ARTS: Record<string, Pix> = {
  'steed-gray': horseArt('#808080', '#4d4d4d', '#4d4d4d'),
  'steed-blue': horseArt('#0060AA', '#004578', '#0060AA'),
  'steed-brown': horseArt('#b07a3f', '#5e3a17', '#7a5025'),
  'steed-gold': horseArt('#f0f0f0', '#808080', '#808080'),

  hardhat: {
    grid: [
      '...kkkkkk...',
      '..kGGGGGGk..',
      '..kGGGGGGk..',
      '.kGGkGGkGGk.',
      '.kGGGGGGGGk.',
      'kGGGGGGGGGGk',
      'kBBBBBBBBBBk',
      'kkkkkkkkkkkk',
    ],
    colors: { k: K, G: '#0060AA', B: '#004578' },
  },
  boots: {
    grid: [
      '...kkkk......',
      '...kLLLk.....',
      '...kLLLk.....',
      '...kLLLk.....',
      '...kLLLkkkkk.',
      '...kLLLLLLLLk',
      '...kLLLLLLLLk',
      '..kDDDDDDDDDk',
      '..kSSSSSSSSSk',
      '..kkkkkkkkkkk',
    ],
    colors: { k: K, L: '#9a6530', D: '#5e3a17', S: '#4d4d4d' },
  },
  medal: {
    grid: [
      '..RRR..UUU..',
      '...RRR.UUU..',
      '....RRRUU...',
      '.....RRR....',
      '...kkOOOkk..',
      '..kOOOWWOOOk',
      '..kOOWWWOOOk',
      '..kOOOWWOOOk',
      '..kOOOOOOOOOk',
      '...kkOOOkk..',
      '.....kOk....',
      '.....kkk....',
    ],
    colors: { k: K, R: '#E31E25', U: '#0060AA', O: '#f0f0f0', W: '#ffffff' },
  },
  flame: {
    grid: [
      '.....FF.....',
      '.....FFOF...',
      '....FOOOF...',
      '....FOOYOF..',
      '...FFOYYOF..',
      '...FOYYYOF..',
      '...FOYYYOFF.',
      '...FOYYYYOF.',
      '....FOYYOF..',
      '....FFOOFF..',
      '.....FFFF...',
      '......kk....',
    ],
    colors: { k: K, F: '#E31E25', O: '#E31E25', Y: '#ffffff' },
  },
  coins: {
    grid: [
      '..kkkkkkkk..',
      '.kOOOOOOOOOk',
      '.kOWWWOOOOOk',
      '.kOOWWWOOOOOk',
      '.kOOOOOOOOOk',
      '..kkkkkkkk..',
      '.kOOOOOOOOOk',
      '.kOWWWOOOOOk',
      '..kkkkkkkk..',
    ],
    colors: { k: K, O: '#f0f0f0', W: '#ffffff' },
  },
  glock: {
    grid: [
      '............',
      '.kkkkkkkkk..',
      '.kGGGGGGGk..',
      '.kGGGGGGGGk.',
      '.kGGGGkkk...',
      '..kBBBk.....',
      '..kBBBk.....',
      '..kBBBk.....',
      '..kBBBk.....',
      '..kkkk......',
    ],
    colors: { k: K, G: '#4d4d4d', B: '#6b4a2b' },
  },
  vest: {
    grid: [
      '.kkk..kkk...',
      '.kVk..kVk...',
      '.kVVk.kVVk..',
      '.kVVVVVVVk..',
      '.kVVVSSVVVk.',
      '.kVVVSSVVVk.',
      '.kVVVVVVVVk.',
      '.kVvVVVVvVk.',
      '.kVVVVVVVVk.',
      '..kkkkkkkk..',
    ],
    colors: { k: K, V: '#6b7f3e', v: '#47542a', S: '#4d4d4d' },
  },
  truck: {
    grid: [
      '..............',
      '.kk........kk.',
      '.kGk..kkkkkGk.',
      '.kGGkkGGGGGGGk',
      'kGGGGkGWGGWGGk',
      'kGGGGGGGGGGGGk',
      '.kkkTTkkkkTTk.',
      '...kTHk..kTHk.',
      '...kkk...kkk..',
    ],
    colors: { k: K, G: '#4c7a45', W: '#ffffff', T: '#4d4d4d', H: '#808080' },
  },
  rocket: {
    grid: [
      '.....RR.....',
      '....RRRR....',
      '....RWWR....',
      '...RWBBWR...',
      '...RWWWWR...',
      '...RWWWWR...',
      '..FRWWWWRF..',
      '..FRWWWWRF..',
      '..FFRWWRFF..',
      '...FFWWFF...',
      '...FOWWOF...',
      '....FOOF....',
      '....FOOF....',
      '.....FF.....',
    ],
    colors: { k: K, R: '#E31E25', W: '#ffffff', B: '#0060AA', F: '#E31E25', O: '#ffffff' },
  },
  crown: {
    grid: [
      '.OO..OO..OO.',
      '.OOO.OO.OOO.',
      '.OOOOOOOOOO.',
      '.OOOOOOOOOO.',
      '..OOOOOOOO..',
      '..OWORRBOO..',
      '..OOOOOOOO..',
      '...kkkkkk...',
    ],
    colors: { k: K, O: '#f0f0f0', W: '#ffffff', R: '#E31E25', B: '#0060AA' },
  },
  radio: {
    grid: [
      '....AA......',
      '....AA......',
      '..kkkkkkkk..',
      '.kDDDDDDDDk.',
      '.kDWWWWDDGk.',
      '.kDWWWWDDGk.',
      '.kDDDDDDDDk.',
      '.kDSSSSSSSk.',
      '.kDSsSSSsSk.',
      '..kkkkkkkk..',
    ],
    colors: { k: K, A: '#ffffff', D: '#4d4d4d', W: '#ffffff', G: '#40c057', S: '#808080', s: K },
  },
  map: {
    grid: [
      '.kkkkkkkkkk.',
      'kPPPPPPPPPPk',
      'kPPPRRPPPGPk',
      'kPPPPRRPGGGk',
      'kPBBPPPRRPPk',
      'kPBBBPPPRRPk',
      'kPPPPPPPRRPk',
      'kPPGPPPBBPPk',
      'kPPPGPPBBBBk',
      'kPPPPPPPPPPk',
      '.kkkkkkkkkk.',
    ],
    colors: { k: K, P: '#f3e3b3', R: '#E31E25', B: '#0060AA', G: '#40c057' },
  },
  anchor: {
    grid: [
      '....kkkk....',
      '...kSSSSk...',
      '....kSSk....',
      '....kSSk....',
      '.k..kSSk..k.',
      '.kS.kSSk.Sk.',
      '.kSSkSSkSSk.',
      '..kSSSSSSk..',
      '...kSSSSk...',
      '....kSSk....',
      '.....kk.....',
    ],
    colors: { k: K, S: '#808080' },
  },
  eagle: {
    grid: [
      '.....kkk....',
      '....kBBBk...',
      '...kBBBBBBk.',
      '...kBBEBBBk.',
      '...kBBBBBBk.',
      '..kBBBBBBYYk',
      '..kBBBBBBBWk',
      '.kBBBBBBbbk.',
      '.kBBBBBbbk..',
      '..kBBBBBk...',
      '...kkkkk....',
    ],
    colors: { k: K, B: '#8a5a2b', b: '#5e3a17', E: K, Y: '#f0f0f0', W: '#e8e4d5' },
  },
  jackpot: {
    grid: [
      '.OO......OO.',
      '.OOO....OOO.',
      '.OOOOkkOOOO.',
      '.kOOOOOOOOOk',
      '..kOOOOOOOk.',
      '...kOWWOOOk.',
      '....kOOOOOk.',
      '.....kOOOk..',
      '.....kRRk...',
      '....kRRRRk..',
      '...kkRRRRkk.',
      '..kDDDDDDDDk',
    ],
    colors: { k: K, O: '#f0f0f0', W: '#ffffff', R: '#E31E25', D: '#5e3a17' },
  },
  barracks: {
    grid: [
      '.kkkkkkkkkk.',
      'kWWWWWWWWWWk',
      'kWwWWWWWWwWk',
      'kWWWWNNWWWWk',
      'kWwWWNNWWwWk',
      'kWWWWNNWWWWk',
      'kWwWWWWWWwWk',
      'kWWWWWWWWWWk',
      'kWWWWWWWWWWk',
      '.kkkkkkkkkk.',
    ],
    colors: { k: K, W: '#b08948', w: '#7a5f30', N: '#808080' },
  },
  arsenal: {
    grid: [
      '....kkkk....',
      '...kHHHHk...',
      '...kHkkHk...',
      '..kkkkkkkk..',
      '.kRRRRRRRRk.',
      '.kRrrRRRrRk.',
      '.kRRRRRRRRk.',
      '.kRLRRRRLRk.',
      '.kRRRRRRRRk.',
      '..kkkkkkkk..',
    ],
    colors: { k: K, H: '#808080', R: '#E31E25', r: '#8F1218', L: '#f0f0f0' },
  },
  hq42: {
    grid: [
      '....kkkk....',
      '...kHHHHk...',
      '..kkHHHHkk..',
      '.kBBBBBBBBk.',
      'kBBBBBBBBBBk',
      'kBBBOOOOBBBk',
      'kBBBBBOBBBBk',
      'kBBBBBOBBBBk',
      'kBBBBBBBBBBk',
      '.kkkkkkkkkk.',
    ],
    colors: { k: K, H: '#808080', B: '#4d4d4d', O: '#f0f0f0' },
  },
  tornado: {
    grid: [
      '..WWWWWWWWWW..',
      '.WWWWWWWWWWWW.',
      '.bBBBBBBBBBBb.',
      '..bBBBBBBBBb..',
      '...bBBBBBBb...',
      '....bBBBBb....',
      '.....bBBb.....',
      '.....bBBb.....',
      '......bBb.....',
      '......bBb.....',
      '.......b......',
      '......kkk.....',
    ],
    colors: { k: K, W: '#ffffff', B: '#808080', b: '#4d4d4d' },
  },
  wheel: {
    grid: [
      '....kkkk....',
      '..kkTTTTkk..',
      '.kTTTTTTTTk.',
      '.kTTkkkkTTk.',
      'kTTkHHHHkTTk',
      'kTTkHHHHkTTk',
      'kTTkHHHHkTTk',
      '.kTTkkkkTTk.',
      '.kTTTTTTTTk.',
      '..kkTTTTkk..',
      '....kkkk....',
    ],
    colors: { k: K, T: '#4d4d4d', H: '#808080' },
  },
  cherry: {
    grid: [
      '......SSSS..',
      '.....SS.....',
      '....SS......',
      '...SS.......',
      '..GG....RR..',
      '.GGGG..RRRR.',
      '.GGGG.RRRRRR',
      '..GG..RRRRRR',
      '......RRRRRR',
      '......RRRR..',
      '.......RR...',
    ],
    colors: { S: '#7a5f30', G: '#40c057', R: '#E31E25' },
  },
  clover: {
    grid: [
      '..GGG..GGG..',
      '.GGGGGgGGGG.',
      '.GGGGGgGGGG.',
      '..GGGGGGG...',
      '...GGGGG....',
      '.....G......',
      '.....G......',
      '.....G......',
    ],
    colors: { G: '#40c057', g: '#2b8a3e' },
  },
  star: {
    grid: [
      '.....OO.....',
      '.....OO.....',
      '....OOOO....',
      '.OOOOOOOOOO.',
      '..OOOOOOOO..',
      '...OOOOOO...',
      '...OOOOOO...',
      '..OOOOOOOO..',
      '..OOOooOOO..',
      '..OOO..oOO..',
      '..OO....oo..',
    ],
    colors: { O: '#f0f0f0', o: '#a8a8a8' },
  },
  dices: {
    grid: [
      '..kkkkkkkk..',
      '.kWWWWWWWWk.',
      '.kWPWWWWPWk.',
      '.kWWWWWWWWk.',
      '.kWWWWPPWWk.',
      '.kWWWWPPWWk.',
      '.kWWWWWWWWk.',
      '.kWPWWWWPWk.',
      '.kWWWWWWWWk.',
      '.kWWWWWWWWk.',
      '..kkkkkkkk..',
    ],
    colors: { k: K, W: '#ffffff', P: '#E31E25' },
  },
  seven: {
    grid: [
      '..kkkkkkkk..',
      '.kDDDDDDDDk.',
      '.kOOOOOOOOOk.',
      '.kDDDDDOOOk.',
      '.kDDDDOOODk.',
      '.kDDDOOODDk.',
      '.kDDDOODDDk.',
      '.kDDOODDDDk.',
      '.kDDOODDDDk.',
      '.kDDDDDDDDk.',
      '..kkkkkkkk..',
    ],
    colors: { k: K, D: '#4d4d4d', O: '#f0f0f0' },
  },
  bomb: {
    grid: [
      '.........YY.',
      '........FY..',
      '.......FF...',
      '...kkkkkk...',
      '..kBBBBBBk..',
      '.kBBWWBBBBk.',
      '.kBWWBBBBBk.',
      '.kBBBBBBBBk.',
      '.kBBBBBBBBk.',
      '..kBBBBBBk..',
      '...kkkkkk...',
    ],
    colors: { k: K, B: '#4d4d4d', W: '#808080', F: '#8a5a2b', Y: '#ffffff' },
  },
  spade: {
    grid: [
      '.....SS.....',
      '....SSSS....',
      '...SSSSSS...',
      '..SSSSSSSS..',
      '..SSSSSSSS..',
      '..SSSSSSSS..',
      '...SSSSSS...',
      '....SSSS....',
      '.....SS.....',
      '....SSSS....',
      '...SSSSSS...',
    ],
    colors: { S: '#ffffff' },
  },
  plinko: {
    grid: [
      '......K......',
      '.....KBK.....',
      '....KBWBK....',
      '...KBWBWBK...',
      '..KBWBWBWBK..',
      '.KBWBWBWBWBK.',
      'KBWBWBWBWBWBK',
      '......R......',
      '.....RRR.....',
      '.....RRR.....',
      '......R......',
    ],
    colors: { K: K, B: '#0060AA', W: '#ffffff', R: '#E31E25' },
  },
};

export function ItemIcon({ name, className }: { name: string; className?: string }): JSX.Element {
  const art = ARTS[name] ?? ARTS.star;
  return <PixSvg art={art} className={className} />;
}

export function iconNameForDrop(label: string): string {
  const m: Record<string, string> = {
    'Каска': 'hardhat', 'Берцы': 'boots', 'Медалька': 'medal', 'Запал': 'flame',
    'Касса части': 'coins', 'Глок': 'glock', 'Броник': 'vest', 'Урал': 'truck',
    'Ракета': 'rocket', 'Звезда генерала': 'crown', 'Рация': 'radio', 'Карта': 'map',
    'Якорь Авроры': 'anchor', 'Орёл': 'eagle', 'Джекпот 42': 'jackpot',
  };
  return m[label] ?? 'star';
}
