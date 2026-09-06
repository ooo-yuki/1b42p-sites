# Task 9 brief (single source of truth)

### Task 9: React HUD + ввод + тач

**Files:**
- Create: `shturm.bratuxa.zomb.top/src/ui/App.tsx`
- Create: `shturm.bratuxa.zomb.top/src/ui/hud.tsx`
- Modify: `shturm.bratuxa.zomb.top/src/main.tsx` (рендер App + canvas связка)

- [ ] **Step 1: HUD HP/волна/патроны/карта + кнопки 1/2/3/V**

```tsx
export function Hud({ hp, wave, ammo, slot }: { hp: number; wave: number; ammo: number; slot: string }) {
  return (<div style={{ position: 'fixed', top: 8, left: 8, color: '#fff', fontFamily: 'system-ui' }}>
    <div>HP {hp} | Волна {wave}/7 | {slot} [{ammo}]</div>
    <div style={{ fontSize: 12 }}>V — 1/3 лицо • 1/2/3 — оружие • R — перезарядка 🏆</div>
  </div>);
}
```

- [ ] **Step 2: Тач-джойстики (левый движение, правый обзор), Commit**

```bash
git add shturm.bratuxa.zomb.top/src/ui/App.tsx shturm.bratuxa.zomb.top/src/ui/hud.tsx shturm.bratuxa.zomb.top/src/main.tsx
git commit -m "shturm: React HUD джойстики 📱"
```


