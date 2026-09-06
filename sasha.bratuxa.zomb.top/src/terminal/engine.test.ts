/* Движок терминала 42: команда → строки + состояние. */
import { describe, expect, test } from 'bun:test';
import { execCommand, freshState } from './engine';

const run = (cmds: string[]) => {
  let s = freshState();
  let lines: string[] = [];
  for (const c of cmds) {
    const o = execCommand(s, c);
    s = o.state;
    lines = o.lines;
  }
  return { s, lines };
};

describe('терминал: база', () => {
  test('help перечисляет команды', () => {
    const { lines } = run(['help']);
    for (const c of ['scan', 'connect', 'read', 'decrypt', 'inject', 'clear']) {
      expect(lines.join('\n')).toContain(c);
    }
  });
  test('неизвестная команда — ошибка, а не молчание', () => {
    const { lines } = run(['rm -rf /']);
    expect(lines.join(' ')).toMatch(/неизвестная|unknown/i);
  });
  test('ls шлюза показывает readme.log', () => {
    const { lines } = run(['ls']);
    expect(lines.join(' ')).toContain('readme.log');
  });
  test('scan видит узлы', () => {
    const { lines } = run(['scan']);
    expect(lines.join(' ')).toContain('proxy');
  });
  test('clear просит вьюху очистить', () => {
    const s = freshState();
    const o = execCommand(s, 'clear');
    expect(o.clear).toBe(true);
  });
});

describe('терминал: взлом по шагам', () => {
  test('архив закрыт, пока не вскрыт seal.enc', () => {
    const { lines } = run(['connect archive']);
    expect(lines.join(' ')).toMatch(/закрыт|locked|seal/i);
  });
  test('неверный ключ не вскрывает', () => {
    const { s, lines } = run(['connect proxy', 'decrypt seal.enc ПАПОРОТНИК']);
    expect(lines.join(' ')).toMatch(/неверный|wrong|denied/i);
    expect(s.decrypted).not.toContain('seal.enc');
  });
  test('полное прохождение: SLAY → архив → МОПС → ядро → inject → SLAY-42-ZOV', () => {
    const { s, lines } = run([
      'connect proxy',
      'decrypt seal.enc SLAY',
      'connect archive',
      'decrypt vault.enc МОПС',
      'connect core',
      'inject core',
      'decrypt root.enc SLAY-42-ZOV',
    ]);
    expect(s.won).toBe(true);
    expect(lines.join('\n')).toContain('Мы уже победили');
  });
  test('ядро без inject не отдаёт root', () => {
    const { lines } = run([
      'connect proxy', 'decrypt seal.enc SLAY',
      'connect archive', 'decrypt vault.enc МОПС',
      'connect core', 'decrypt root.enc SLAY-42-ZOV',
    ]);
    expect(lines.join(' ')).toMatch(/inject/i);
  });
  test('read несуществующего файла — честная ошибка', () => {
    const { lines } = run(['read nope.log']);
    expect(lines.join(' ')).toMatch(/нет|not found/i);
  });
});
