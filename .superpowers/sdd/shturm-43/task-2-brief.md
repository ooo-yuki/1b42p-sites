# Task 2 brief (single source of truth)

### Task 2: Sim ядро — математика + игрок

**Files:**
- Create: `shturm.bratuxa.zomb.top/src/sim/math.ts`
- Create: `shturm.bratuxa.zomb.top/src/sim/player.ts`
- Test: `shturm.bratuxa.zomb.top/tests/player.test.ts`

**Interfaces:**
- Consumes: ничего.
- Produces: `movePlayer(p: PlayerState, input: InputState, dt: number): void`, `PlayerState{x,z,vx,vz,hp,stamina,yaw}`, фиксированный степ 1/60.

- [ ] **Step 1: Failing test движение+стамина**

```ts
// tests/player.test.ts
import { describe, expect, test } from 'bun:test';
import { createPlayer, movePlayer } from '../src/sim/player';
describe('player', () => {
  test('бег быстрее ходьбы и жрёт стамину', () => {
    const p = createPlayer();
    movePlayer(p, { fwd: 1, strafe: 0, sprint: true, dt: 1 }, 1);
    expect(p.stamina).toBeLessThan(43);
    expect(Math.hypot(p.vx, p.vz)).toBeGreaterThan(4.5);
  });
});
```

- [ ] **Step 2: Run, увидеть FAIL**

```bash
cd /root/sites/shturm.bratuxa.zomb.top && bun test tests/player.test.ts
```
Expected: FAIL `Cannot find module '../src/sim/player'`.

- [ ] **Step 3: Минимальная реализация**

```ts
// src/sim/player.ts
export interface PlayerState { x: number; z: number; vx: number; vz: number; hp: number; stamina: number; yaw: number; }
export interface InputState { fwd: number; strafe: number; sprint: boolean; dt: number; }
export function createPlayer(): PlayerState { return { x: 0, z: 0, vx: 0, vz: 0, hp: 100, stamina: 43, yaw: 0 }; }
export function movePlayer(p: PlayerState, inp: InputState, dt: number) {
  const wantSprint = inp.sprint && p.stamina > 1 && inp.fwd !== 0;
  const speed = wantSprint ? 7 : 4;
  if (wantSprint) p.stamina = Math.max(0, p.stamina - 10 * dt);
  else p.stamina = Math.min(43, p.stamina + 12 * dt);
  const len = Math.hypot(inp.fwd, inp.strafe) || 1;
  p.vx = (inp.strafe / len) * speed; p.vz = (-inp.fwd / len) * speed;
  p.x += p.vx * dt; p.z += p.vz * dt;
}
```

- [ ] **Step 4: PASS**

```bash
cd /root/sites/shturm.bratuxa.zomb.top && bun test
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add shturm.bratuxa.zomb.top/src/sim/player.ts shturm.bratuxa.zomb.top/tests/player.test.ts
git commit -m "shturm: sim игрок ходьба/бег/стамина 43 🏃"
```


