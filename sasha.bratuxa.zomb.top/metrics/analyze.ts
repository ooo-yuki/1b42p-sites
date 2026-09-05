/* Метрики кода батальона без зависимостей: строки + цикломатика.
   Строки: код / комменты / пустые по стилю комментов языка.
   Сложность: 1 + точки ветвления в теле каждой функции
   (JS/TS: if/for/while/case/catch/&&/| |/??; Python: if/elif/for/while/except/and/or).
   Терnарник и match не считаем — честно написано в секции статы. */

export type Fat = { name: string; file: string; cc: number };
export type FileMetrics = {
  file: string; code: number; comment: number; blank: number;
  funcs: number; totalCc: number; avgCc: number; top: Fat[];
};
export type SiteMetrics = {
  site: string; files: number; loc: number; funcs: number; avgCc: number; top: Fat[];
};

type Lang = 'c' | 'hash' | 'sql' | 'html' | 'plain';
function langOf(path: string): Lang {
  const e = path.split('.').pop()?.toLowerCase() ?? '';
  if (['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs', 'css'].includes(e)) return 'c';
  if (['py', 'sh', 'rb', 'yml', 'yaml', 'toml', 'ini', 'cfg'].includes(e)) return 'hash';
  if (['sql'].includes(e)) return 'sql';
  if (['html', 'xml', 'vue', 'svelte'].includes(e)) return 'html';
  return 'plain';
}

/** Убрать строки и комменты — чтобы && в строке не врали в сложность. */
function stripNoise(src: string, lang: Lang): string {
  let s = src.replace(/`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '""');
  if (lang === 'c') {
    s = s.replace(/\/\*[\s\S]*?\*\//g, '');
    s = s.replace(/\/\/[^\n]*/g, '');
  } else if (lang === 'hash') {
    s = s.replace(/^[ \t]*#[^\n]*/gm, '');
  } else if (lang === 'sql') {
    s = s.replace(/--[^\n]*/g, '');
  } else if (lang === 'html') {
    s = s.replace(/<!--[\s\S]*?-->/g, '');
  }
  return s;
}

function countLines(path: string, content: string): { code: number; comment: number; blank: number } {
  const lang = langOf(path);
  let code = 0;
  let comment = 0;
  let blank = 0;
  let inBlock = false;
  const parts = content.split('\n');
  if (parts.length > 1 && parts[parts.length - 1].trim() === '') parts.pop(); // хвост файла — не строка
  for (const raw of parts) {
    const line = raw.trim();
    if (line === '') { blank++; continue; }
    if (lang === 'c') {
      if (inBlock) {
        comment++;
        if (line.includes('*/')) inBlock = false;
        continue;
      }
      if (line.startsWith('//')) { comment++; continue; }
      if (line.startsWith('/*')) {
        comment++;
        if (!line.includes('*/', 2)) inBlock = true;
        continue;
      }
      code++;
    } else if (lang === 'hash') {
      if (line.startsWith('#')) comment++;
      else code++;
    } else if (lang === 'sql') {
      if (line.startsWith('--')) comment++;
      else code++;
    } else if (lang === 'html') {
      if (line.startsWith('<!--')) comment++;
      else code++;
    } else {
      code++;
    }
  }
  return { code, comment, blank };
}

const JS_POINTS: Array<[RegExp, number]> = [
  [/\b(if|for|while|case|catch)\b/g, 1],
  [/&&/g, 1],
  [/\|\|/g, 1],
  [/\?\?/g, 1],
];
const PY_POINTS: Array<[RegExp, number]> = [
  [/\b(if|elif|for|while|except)\b/g, 1],
  [/\band\b/g, 1],
  [/\bor\b/g, 1],
];
function points(body: string, table: Array<[RegExp, number]>): number {
  let n = 1;
  for (const [re, w] of table) {
    re.lastIndex = 0;
    const m = body.match(re);
    if (m) n += m.length * w;
  }
  return n;
}

/** Тело от открывающей скобки: баланс до закрывающей. Возвращает [body, endIdx]. */
function braceBody(src: string, openIdx: number): [string, number] {
  let depth = 0;
  for (let i = openIdx; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) return [src.slice(openIdx + 1, i), i];
    }
  }
  return [src.slice(openIdx + 1), src.length];
}

function jsFuncs(clean: string): Array<{ name: string; cc: number }> {
  const out: Array<{ name: string; cc: number }> = [];
  const seen = new Set<string>();
  const grab = (name: string, braceIdx: number): void => {
    const key = `${name}@${braceIdx}`;
    if (seen.has(key)) return;
    seen.add(key);
    const [body] = braceBody(clean, braceIdx);
    out.push({ name, cc: points(body, JS_POINTS) });
  };
  // function name() {
  for (const m of clean.matchAll(/function\s+([A-Za-z_$][\w$]*)\s*\(/g)) {
    const bi = clean.indexOf('{', (m.index ?? 0) + m[0].length);
    if (bi >= 0) grab(m[1], bi);
  }
  // name = (...) => {  /  name: (...) => {  /  const name = ... — только с телом
  for (const m of clean.matchAll(/(?:^|[;{},\s])([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{/gm)) {
    const bi = m[0].lastIndexOf('{');
    grab(m[1], (m.index ?? 0) + bi);
  }
  // методы и короткие записи name(...) { — кроме ключевых слов
  for (const m of clean.matchAll(/(^|[;{},\s])(?!if|for|while|switch|catch|function|return)([A-Za-z_$][\w$]*)\s*\([^()]*\)\s*\{/gm)) {
    const bi = m[0].lastIndexOf('{');
    grab(m[2], (m.index ?? 0) + bi);
  }
  // стрелки без тела: => expr — cc 1
  for (const m of clean.matchAll(/(?:^|[;{},\s])([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>(?!\s*\{)/gm)) {
    if (!seen.has(`${m[1]}@e`)) {
      seen.add(`${m[1]}@e`);
      out.push({ name: m[1], cc: 1 });
    }
  }
  return out;
}

function pyFuncs(clean: string): Array<{ name: string; cc: number }> {
  const out: Array<{ name: string; cc: number }> = [];
  const lines = clean.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^([ \t]*)def\s+([A-Za-z_]\w*)\s*\(/);
    if (!m) continue;
    const base = m[1].replace(/\t/g, '    ').length;
    const body: string[] = [];
    for (let j = i + 1; j < lines.length; j++) {
      const ln = lines[j];
      if (ln.trim() === '') { body.push(''); continue; }
      const ind = (ln.match(/^[ \t]*/)![0]).replace(/\t/g, '    ').length;
      if (ind <= base) break;
      body.push(ln);
    }
    out.push({ name: m[2], cc: points(body.join('\n'), PY_POINTS) });
  }
  return out;
}

export function analyzeFile(path: string, content: string): FileMetrics {
  const lang = langOf(path);
  const { code, comment, blank } = countLines(path, content);
  const clean = stripNoise(content, lang);
  const fns = lang === 'c' ? jsFuncs(clean) : lang === 'hash' && path.endsWith('.py') ? pyFuncs(clean) : [];
  const totalCc = fns.reduce((a, f) => a + f.cc, 0);
  const top = fns
    .map(f => ({ name: f.name, file: path.split('/').pop() ?? path, cc: f.cc }))
    .sort((a, b) => b.cc - a.cc)
    .slice(0, 5);
  return {
    file: path, code, comment, blank,
    funcs: fns.length, totalCc,
    avgCc: fns.length ? Math.round((totalCc / fns.length) * 100) / 100 : 0,
    top,
  };
}

export function analyzeSite(site: string, files: Array<{ path: string; content: string }>): SiteMetrics {
  let loc = 0;
  let funcs = 0;
  let totalCc = 0;
  const tops: Fat[] = [];
  for (const f of files) {
    const m = analyzeFile(f.path, f.content);
    loc += m.code;
    funcs += m.funcs;
    totalCc += m.totalCc;
    tops.push(...m.top);
  }
  tops.sort((a, b) => b.cc - a.cc);
  return {
    site, files: files.length, loc, funcs,
    avgCc: funcs ? Math.round((totalCc / funcs) * 100) / 100 : 0,
    top: tops.slice(0, 5),
  };
}
