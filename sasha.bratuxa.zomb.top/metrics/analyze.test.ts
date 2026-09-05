/* Метрики кода батальона — TDD-красное: metrics/analyze.ts ещё нет.
   Считаем сами, без зависимостей: строки (код/комменты/пустые) + цикломатика
   по функциям (1 + точки ветвления). Честно и парсится одним JSON. */
import { describe, expect, test } from 'bun:test';
import { analyzeFile, analyzeSite } from './analyze';

describe('countLines', () => {
  test('js: код, комменты, пустые', () => {
    const src = `// шапка\nconst a = 1;\n\n/* блок\n   коммент */\nif (a) { a++; }\n`;
    const r = analyzeFile('x.js', src);
    expect(r.code).toBe(2);
    expect(r.comment).toBe(3);
    expect(r.blank).toBe(1);
  });
  test('python: # — коммент', () => {
    const src = `# шапка\ndef f():\n    return 1\n\n`;
    const r = analyzeFile('x.py', src);
    expect(r.code).toBe(2);
    expect(r.comment).toBe(1);
    expect(r.blank).toBe(1);
  });
});

describe('complexity', () => {
  test('пустая функция — cc 1', () => {
    const r = analyzeFile('a.js', 'function hello() {\n  return 42;\n}\n');
    expect(r.funcs).toBe(1);
    expect(r.avgCc).toBe(1);
  });
  test('if + for + && — cc 4', () => {
    const src = 'function f(a) {\n  if (a && a.x) {\n    for (let i = 0; i < 9; i++) { a++; }\n  }\n}\n';
    const r = analyzeFile('a.js', src);
    expect(r.funcs).toBe(1);
    expect(r.avgCc).toBe(4);
  });
  test('python: if + elif — cc 3', () => {
    const src = 'def f(a):\n    if a:\n        return 1\n    elif a:\n        return 2\n    return 3\n';
    const r = analyzeFile('a.py', src);
    expect(r.funcs).toBe(1);
    expect(r.avgCc).toBe(3);
  });
  test('топ жирных: имя, файл, cc', () => {
    const src = 'function thin() { return 1; }\nfunction fat(a) {\n  if (a) { while (a) { a--; } }\n  switch (a) { case 1: break; case 2: break; }\n}\n';
    const r = analyzeFile('b.js', src);
    expect(r.top[0].name).toBe('fat');
    expect(r.top[0].cc).toBe(5);
    expect(r.top[0].file).toBe('b.js');
  });
});

describe('aggregate', () => {
  test('сайт: суммы и среднее', () => {
    const s = analyzeSite('sasha', [
      { path: 'a.js', content: 'function f() { return 1; }\n' },
      { path: 'b.py', content: 'def g(a):\n    if a:\n        return 1\n    return 2\n' },
    ]);
    expect(s.files).toBe(2);
    expect(s.funcs).toBe(2);
    expect(s.avgCc).toBe(1.5);
    expect(s.loc).toBeGreaterThan(0);
  });
});
