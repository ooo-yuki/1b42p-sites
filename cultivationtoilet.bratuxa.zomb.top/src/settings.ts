/* Настройки графики: качество текстур, отражения, свет, разрешение, FPS, дальность. */
export interface Gfx {
  tex: number; // 0 = 512, 1 = 1024, 2 = оригинал
  refl: number; // 0 = выкл, 1 = вкл
  light: number; // 0 = низкое, 1 = среднее, 2 = высокое
  res: number; // 0 = 50%, 1 = 75%, 2 = 100%
  fps: number; // 0 = без лимита, 30, 60
  draw: number; // 0 = 14м, 1 = 20м, 2 = 26м
}

export const GFX_DEF: Gfx = { tex: 2, refl: 1, light: 2, res: 2, fps: 0, draw: 2 };
export const RES_SCALE = [0.5, 0.75, 1];
export const DRAW_FAR = [14, 20, 26];
const KEY = 'ctgfx';

let gfx: Gfx = { ...GFX_DEF };
try {
  const s = localStorage.getItem(KEY);
  if (s) gfx = { ...GFX_DEF, ...(JSON.parse(s) as Partial<Gfx>) };
} catch {
  gfx = { ...GFX_DEF };
}

const listeners: ((g: Gfx) => void)[] = [];
export const gfxState = (): Gfx => gfx;
export function onGfx(fn: (g: Gfx) => void): void {
  listeners.push(fn);
}
function set(patch: Partial<Gfx>): void {
  gfx = { ...gfx, ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(gfx));
  } catch {
    /* приватный режим — просто не сохраняем */
  }
  for (const fn of listeners) fn(gfx);
}

// ---------------------------------------------------------------- панель
interface Row {
  key: keyof Gfx;
  label: string;
  note: string;
  opts: [string, number][];
}
const ROWS: Row[] = [
  { key: 'tex', label: 'Качество текстур', note: 'меньше — быстрее грузится и меньше память', opts: [['низк', 0], ['сред', 1], ['выс', 2]] },
  { key: 'refl', label: 'Отражения', note: 'глянцевые блики на полу и керамике', opts: [['выкл', 0], ['вкл', 1]] },
  { key: 'light', label: 'Освещение', note: 'лампы в клетках: больше ламп — больше нагрузка', opts: [['низк', 0], ['сред', 1], ['выс', 2]] },
  { key: 'res', label: 'Разрешение', note: 'масштаб картинки 3D-сцены', opts: [['50%', 0], ['75%', 1], ['100%', 2]] },
  { key: 'fps', label: 'Лимит FPS', note: 'экономит батарею и охлаждение', opts: [['30', 30], ['60', 60], ['нет', 0]] },
  { key: 'draw', label: 'Дальность видимости', note: 'дальше стены растворяются в тумане', opts: [['14м', 0], ['20м', 1], ['26м', 2]] },
];

let panel: HTMLElement | null = null;
let openFlag = false;
const stateFns: ((open: boolean) => void)[] = [];
export function onGfxPanelState(fn: (open: boolean) => void): void {
  stateFns.push(fn);
}
export const gfxPanelOpen = (): boolean => openFlag;

function renderRows(): void {
  if (!panel) return;
  const box = panel.querySelector('#gfxRows');
  if (!box) return;
  box.innerHTML = '';
  for (const r of ROWS) {
    const row = document.createElement('div');
    row.className = 'gfxRow';
    row.innerHTML = `<span class="gfxLabel">${r.label}<small>${r.note}</small></span>`;
    const opts = document.createElement('span');
    opts.className = 'gfxOpts';
    for (const [text, val] of r.opts) {
      const b = document.createElement('button');
      b.className = 'gfxOpt' + (gfx[r.key] === val ? ' on' : '');
      b.textContent = text;
      b.onclick = () => set({ [r.key]: val } as Partial<Gfx>);
      opts.appendChild(b);
    }
    row.appendChild(opts);
    box.appendChild(row);
  }
}

function setState(open: boolean): void {
  openFlag = open;
  panel?.classList.toggle('hidden', !open);
  if (open) renderRows();
  for (const fn of stateFns) fn(open);
}

export function gfxPanelToggle(): void {
  setState(!openFlag);
}
export function gfxPanelClose(): void {
  if (openFlag) setState(false);
}

/** Строит панель и вешает кнопки ⚙. Вызывать один раз после DOM. */
export function initSettingsUI(): void {
  panel = document.getElementById('gfx');
  document.querySelectorAll('.gfxBtn').forEach((b) => b.addEventListener('click', () => setState(true)));
  document.getElementById('gfxClose')?.addEventListener('click', () => setState(false));
  panel?.addEventListener('click', (e) => {
    if (e.target === panel) setState(false);
  });
}
