# Task 3 brief (single source of truth)

### Task 3: Оружие — хитскан 3 ствола

**Files:**
- Create: `shturm.bratuxa.zomb.top/src/sim/weapons.ts`
- Test: `shturm.bratuxa.zomb.top/tests/weapons.test.ts`

**Interfaces:**
- Consumes: `PlayerState` из Task 2.
- Produces: `WEAPONS: Record<Slot, Stats>`, `fire(sim, slot, now): ShotResult`, `reload()`.

- [ ] **Step 1: Failing test дробовик веер**

```ts
import { describe, expect, test } from 'bun:test';
import { WEAPONS, fireShot } from '../src/sim/weapons';
describe('weapons', () => {
  test('дробовик даёт 6 дробин', () => {
    expect(WEAPONS.shotgun.pellets).toBe(6);
    const r = fireShot('shotgun', 10, 0);
    expect(r.pellets.length).toBe(6);
  });
});
```

- [ ] **Step 2: Run FAIL**

```bash
cd /root/sites/shturm.bratuxa.zomb.top && bun test tests/weapons.test.ts
```

- [ ] **Step 3: Реализация ТТХ из спека**

```ts
// src/sim/weapons.ts
export type Slot = 'pistol' | 'auto' | 'shotgun';
export const WEAPONS = {
  pistol: { dmg: 25, mag: 12, reserve: 120, interval: 0.35, spread: 0.5, reload: 1.1, pellets: 1, range: 60 },
  auto: { dmg: 16, mag: 30, reserve: 210, interval: 0.11, spread: 1.8, reload: 1.8, pellets: 1, range: 80 },
  shotgun: { dmg: 12, mag: 6, reserve: 42, interval: 0.9, spread: 5, reload: 2.4, pellets: 6, range: 25 },
};
export function fireShot(slot: Slot, dist: number, seed: number) {
  const w = WEAPONS[slot];
  const pellets = Array.from({ length: w.pellets }, (_, i) => ({ dmg: dist > 15 && slot === 'shotgun' ? w.dmg * 0.5 : w.dmg, idx: i }));
  return { pellets };
}
```

- [ ] **Step 4: PASS + commit**

```bash
cd /root/sites/shturm.bratuxa.zomb.top && bun test
git add shturm.bratuxa.zomb.top/src/sim/weapons.ts shturm.bratuxa.zomb.top/tests/weapons.test.ts
git commit -m "shturm: sim 3 ствола хитскан 🔫"
```


