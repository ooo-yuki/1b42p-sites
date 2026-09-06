import type { Slot } from '../sim/weapons';
import type { MapId } from '../sim/maps';
import { MAX_HP } from '../sim/player';

export type Phase = 'menu' | 'playing' | 'paused' | 'won' | 'lost';
export type View = 'first' | 'third';
export type Difficulty = 'fighter' | 'veteran' | 'legend';

export interface Snapshot {
  phase: Phase;
  map: MapId;
  difficulty: Difficulty;
  view: View;
  hp: number;
  maxHp: number;
  stamina: number;
  wave: number;
  slot: Slot;
  mag: number;
  reserve: number;
  kills: number;
  enemiesLeft: number;
  fps: number;
  timeSec: number;
  accuracy: number;
  message: string;
}

const initial: Snapshot = {
  phase: 'menu',
  map: 'yard',
  difficulty: 'veteran',
  view: 'third',
  hp: MAX_HP,
  maxHp: MAX_HP,
  stamina: 43,
  wave: 1,
  slot: 'auto',
  mag: 30,
  reserve: 210,
  kills: 0,
  enemiesLeft: 0,
  fps: 60,
  timeSec: 0,
  accuracy: 0,
  message: '',
};

let snap: Snapshot = { ...initial };
const listeners = new Set<() => void>();

export const gameStore = {
  get(): Snapshot {
    return snap;
  },
  set(patch: Partial<Snapshot>) {
    snap = { ...snap, ...patch };
    listeners.forEach((fn) => fn());
  },
  reset(map: MapId, difficulty: Difficulty) {
    const keepView = snap.view;
    snap = { ...initial, map, difficulty, view: keepView };
    listeners.forEach((fn) => fn());
  },
  subscribe(fn: () => void): () => void {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};

export const DIFF_MULT: Record<Difficulty, number> = {
  fighter: 0.8,
  veteran: 1.0,
  legend: 1.25,
};
