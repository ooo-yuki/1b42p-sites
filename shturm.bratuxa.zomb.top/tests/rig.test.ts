import { describe, expect, test } from 'bun:test';
import { buildHumanoid, makeClips } from '../src/three/rig';

describe('rig', () => {
  test('гуманоид: 15 костей с именами', () => {
    const { bones } = buildHumanoid();
    expect(Object.keys(bones).length).toBe(15);
    expect(bones.kneeL.name).toBe('kneeL');
  });
  test('клипы: 4 шт, death короче 1с', () => {
    const clips = makeClips('biped');
    expect(Object.keys(clips).sort()).toEqual(['attack', 'death', 'idle', 'walk']);
    expect(clips.death.duration).toBeLessThan(1);
  });
});
