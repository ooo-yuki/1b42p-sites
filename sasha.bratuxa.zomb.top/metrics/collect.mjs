/* Сборщик метрик кода батальона: проходит 13 сайтов трекера,
   считает analyze.ts, кладёт dist/metrics.json для страницы статы.
   Шаг сборки sasha (после bun build): bun ./metrics/collect.mjs */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { analyzeSite } from './analyze.ts';

const SITES = {
  hub: 'hub.bratuxa.zomb.top',
  chaev: 'chaev.bratuxa.zomb.top',
  doom: 'doom.bratuxa.zomb.top',
  evaelph: 'evaelph.bratuxa.zomb.top',
  smolgrad: 'smolgrad.bratuxa.zomb.top',
  miqqil: 'miqqil.bratuxa.zomb.top',
  setden: 'setden.bratuxa.zomb.top',
  svyatoslav: 'svyatoslav.bratuxa.zomb.top',
  denis: 'denis.bratuxa.zomb.top',
  sasha: 'sasha.bratuxa.zomb.top',
  gtaevv: 'gtaevv.bratuxa.zomb.top',
  brohacho: 'brohacho.bratuxa.zomb.top',
  '1b42p': '1b42p.bratuxa.zomb.top',
};
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '__pycache__', '.tmp-test', '.hermes']);
const SKIP_EXT = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'mp3', 'm4a', 'wav', 'mp4', 'woff', 'woff2', 'ttf', 'map', 'pyc']);
const SKIP_FILES = new Set(['package-lock.json', 'bun.lock']);

function walk(dir, base, out) {
  for (const e of readdirSync(dir)) {
    if (SKIP_DIRS.has(e)) continue;
    const full = join(dir, e);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full, base, out);
    } else if (st.isFile() && st.size < 2 * 1024 * 1024) {
      const ext = e.split('.').pop()?.toLowerCase() ?? '';
      if (SKIP_EXT.has(ext) || SKIP_FILES.has(e)) continue;
      try {
        const content = readFileSync(full, 'utf8');
        if (content.includes('\0')) continue; // бинарь
        out.push({ path: full.slice(base.length + 1), content });
      } catch { /* сокеты и прочее — мимо */ }
    }
  }
}

const sites = {};
let tFiles = 0;
let tLoc = 0;
let tFuncs = 0;
let tCc = 0;
for (const [key, dir] of Object.entries(SITES)) {
  const root = join('/root/sites', dir);
  const files = [];
  try {
    walk(root, root, files);
  } catch {
    files.length = 0;
  }
  const m = analyzeSite(key, files);
  sites[key] = m;
  tFiles += m.files;
  tLoc += m.loc;
  tFuncs += m.funcs;
  tCc += m.funcs * m.avgCc;
}
const payload = {
  generated: new Date().toISOString(),
  sites,
  total: {
    files: tFiles, loc: tLoc, funcs: tFuncs,
    avgCc: tFuncs ? Math.round((tCc / tFuncs) * 100) / 100 : 0,
  },
};
writeFileSync(join(import.meta.dir, '..', 'dist', 'metrics.json'), JSON.stringify(payload));
console.log(`metrics: ${tFiles} файлов, ${tLoc} строк, ${tFuncs} функций, cc ${payload.total.avgCc}`);
