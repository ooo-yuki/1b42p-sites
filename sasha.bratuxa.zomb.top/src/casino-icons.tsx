import type { JSX } from 'react';

/* Ручные пиксель-арт иллюстрации: каждая — сетка символов, где буква = цвет.
   '.' — прозрачный пиксель. Рендер — SVG из rect-блоков, crispEdges. */

type Pix = { grid: string[]; colors: Record<string, string> };

const K = '#20202e'; // общий контур

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
  'steed-gray': horseArt('#9aa3b5', '#4a5266', '#5a6376'),
  'steed-blue': horseArt('#6fb3f7', '#2b4a7a', '#3f6ea5'),
  'steed-brown': horseArt('#b07a3f', '#5e3a17', '#7a5025'),
  'steed-gold': horseArt('#ffd23f', '#b07818', '#c9a227'),

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
    colors: { k: K, G: '#37d67a', B: '#1f8a4c' },
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
    colors: { k: K, L: '#9a6530', D: '#5e3a17', S: '#2e2e3e' },
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
    colors: { k: K, R: '#ff4d4d', U: '#4f8ff7', O: '#ffd23f', W: '#fff3b0' },
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
    colors: { k: K, F: '#e03131', O: '#ff922b', Y: '#ffd43b' },
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
    colors: { k: K, O: '#ffd23f', W: '#fff3b0' },
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
    colors: { k: K, G: '#3d3d4a', B: '#6b4a2b' },
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
    colors: { k: K, V: '#6b7f3e', v: '#47542a', S: '#2e2e3e' },
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
    colors: { k: K, G: '#4c7a45', W: '#bfe3ff', T: '#22222c', H: '#8b93a8' },
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
    colors: { k: K, R: '#ff4d4d', W: '#eef1ff', B: '#4f8ff7', F: '#ff922b', O: '#ffd43b' },
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
    colors: { k: K, O: '#ffd23f', W: '#fff3b0', R: '#ff4d6d', B: '#4f8ff7' },
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
    colors: { k: K, A: '#c0c7e8', D: '#2e2e3e', W: '#bfe3ff', G: '#40c057', S: '#565664', s: K },
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
    colors: { k: K, P: '#f3e3b3', R: '#e03131', B: '#4f8ff7', G: '#40c057' },
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
    colors: { k: K, S: '#8b93a8' },
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
    colors: { k: K, B: '#8a5a2b', b: '#5e3a17', E: K, Y: '#ffd23f', W: '#e8e4d5' },
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
    colors: { k: K, O: '#ffd23f', W: '#fff3b0', R: '#ff4d4d', D: '#5e3a17' },
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
    colors: { k: K, W: '#b08948', w: '#7a5f30', N: '#565d75' },
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
    colors: { k: K, H: '#9aa3b5', R: '#e03131', r: '#a02323', L: '#ffd23f' },
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
    colors: { k: K, H: '#9aa3b5', B: '#2b3a67', O: '#ffd23f' },
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
    colors: { k: K, W: '#e8eefc', B: '#8fa3c9', b: '#4a5a7a' },
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
    colors: { k: K, T: '#2c2c36', H: '#9aa3b8' },
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
    colors: { S: '#7a5f30', G: '#40c057', R: '#ff4d6d' },
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
    colors: { O: '#ffd23f', o: '#e0a91f' },
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
    colors: { k: K, W: '#eef1ff', P: '#e03131' },
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
    colors: { k: K, D: '#2b2b3a', O: '#ffd23f' },
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
