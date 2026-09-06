# Task 8 brief (single source of truth)

### Task 8: 3 карты визуал + коллизии

**Files:**
- Create: `shturm.bratuxa.zomb.top/src/sim/maps.ts`
- Create: `shturm.bratuxa.zomb.top/src/three/mapsVisual.ts`

- [ ] **Step 1: maps.ts данные (spawn-точки, препятствия)**

```ts
export interface Obstacle { x: number; z: number; r: number; }
export const MAPS = {
  yard: { size: 42, spawns: [{ x: -18, z: -18 }, { x: 18, z: -18 }, { x: 0, z: 18 }], obstacles: [{ x: 0, z: 0, r: 2 }, { x: -8, z: 5, r: 1.5 }] as Obstacle[] },
  island: { size: 60, spawns: [{ x: -25, z: 0 }, { x: 25, z: 0 }], obstacles: [] as Obstacle[] },
  neon: { size: 50, spawns: [{ x: -20, z: 20 }, { x: 20, z: -20 }], obstacles: [{ x: 5, z: 5, r: 2 }] as Obstacle[] },
};
```

- [ ] **Step 2: mapsVisual.ts merged статика + неон-фонари, Commit**

```bash
git add shturm.bratuxa.zomb.top/src/sim/maps.ts shturm.bratuxa.zomb.top/src/three/mapsVisual.ts
git commit -m "shturm: 3 карты двор остров неон 🗺️"
```


