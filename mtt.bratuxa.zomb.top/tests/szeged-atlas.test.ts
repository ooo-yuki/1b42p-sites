import { expect, test } from 'bun:test';
import { existsSync, statSync } from 'node:fs';
import mesh from '../src/assets/szeged.mesh.json';

const ATLAS = new URL('../src/assets/szeged-atlas.jpg', import.meta.url);

test('szeged atlas: файл существует и не пуст', () => {
  expect(existsSync(ATLAS), 'нет src/assets/szeged-atlas.jpg — запусти tools/bake-szeged.py').toBe(true);
  const bytes = statSync(ATLAS).size;
  expect(bytes).toBeGreaterThan(10 * 1024);
  expect(bytes).toBeLessThan(1.5 * 1024 * 1024);
});

test('szeged mesh-3: uv.length == verts (пары на угол)', () => {
  expect(mesh.format).toBe('szeged-mesh-3');
  const corners = (mesh.pos_index as number[]).length;
  const uvPairs = (mesh.uv as number[]).length / 2;
  expect((mesh.uv as number[]).length % 2).toBe(0);
  expect(uvPairs).toBe(corners);
  expect(uvPairs).toBeGreaterThan(10000);
});

test('szeged unresolved: меньше 10, список в ошибке', () => {
  const un = mesh.unresolved as string[];
  expect(Array.isArray(un)).toBe(true);
  expect(un.length, `unresolved textures: ${JSON.stringify(un)}`).toBeLessThan(10);
});
