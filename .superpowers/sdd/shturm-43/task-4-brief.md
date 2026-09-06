# Task 4 brief (single source of truth)

### Task 4: Мобы + волны + автобаланс

**Files:**
- Create: `shturm.bratuxa.zomb.top/src/sim/enemies.ts`
- Create: `shturm.bratuxa.zomb.top/src/sim/waves.ts`
- Create: `shturm.bratuxa.zomb.top/src/sim/autobalance.ts`
- Test: `shturm.bratuxa.zomb.top/tests/waves.test.ts`

**Interfaces:**
- Consumes: `WEAPONS` Task 3.
- Produces: `ENEMIES{runner,shooter,tank,boss}`, `makeWave(n): Spawn[]`, `autobalance(stats): mult`.

- [ ] **Step 1: Failing test волна 7 = босс**

```ts
import { describe, expect, test } from 'bun:test';
import { makeWave } from '../src/sim/waves';
describe('waves', () => {
  test('7-я волна содержит босса', () => { expect(makeWave(7).some(s => s.type === 'boss')).toBe(true); });
  test('1-я волна дешёвая', () => { expect(makeWave(1).length).toBeLessThan(12); });
});
```

- [ ] **Step 2: Run FAIL, Step 3: реализация**

```ts
// src/sim/enemies.ts
export const ENEMIES = {
  runner: { hp: 40, speed: 5.0, dmg: 10, cost: 1 },
  shooter: { hp: 50, speed: 3.2, dmg: 8, cost: 2 },
  tank: { hp: 200, speed: 2.0, dmg: 20, cost: 4 },
  boss: { hp: 1200, speed: 3.0, dmg: 25, cost: 99 },
};
// src/sim/waves.ts
import { ENEMIES } from './enemies';
export interface Spawn { type: keyof typeof ENEMIES; }
const BUDGET = [0, 10, 14, 18, 24, 30, 36];
export function makeWave(n: number): Spawn[] {
  if (n >= 7) return [{ type: 'boss' }, { type: 'runner' }, { type: 'runner' }, { type: 'shooter' }];
  let b = BUDGET[n] ?? 10; const out: Spawn[] = [];
  while (b >= 4 && out.length < 20) { out.push({ type: 'tank' }); b -= 4; }
  while (b >= 2) { out.push({ type: 'shooter' }); b -= 2; }
  while (b >= 1) { out.push({ type: 'runner' }); b -= 1; }
  return out;
}
// src/sim/autobalance.ts
export function autobalance(deaths: number, accuracy: number): number {
  if (deaths >= 2) return 0.85;
  if (deaths === 0 && accuracy > 0.4) return 1.15;
  return 1.0;
}
```

- [ ] **Step 4: PASS**

```bash
cd /root/sites/shturm.bratuxa.zomb.top && bun test
```

- [ ] **Step 5: Commit**

```bash
git add shturm.bratuxa.zomb.top/src/sim/enemies.ts shturm.bratuxa.zomb.top/src/sim/waves.ts shturm.bratuxa.zomb.top/src/sim/autobalance.ts shturm.bratuxa.zomb.top/tests/waves.test.ts
git commit -m "shturm: sim мобы волны автобаланс 🐛"
```


