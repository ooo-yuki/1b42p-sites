import { describe, expect, test } from 'bun:test';
import { getTex } from '../src/three/textures';

describe('textures', () => {
  test('возвращает 256 canvas и кэширует по kind', () => {
    const a = getTex('fur');
    expect(a.image.width).toBe(256);
    expect(getTex('fur')).toBe(a);
  });
});
