# Task 10 brief (single source of truth)

### Task 10: Интеграция + браузерная приёмка + build

**Files:**
- Modify: `shturm.bratuxa.zomb.top/src/main.tsx` (цикл sim 60Гц + render)

- [ ] **Step 1: Цикл + билд**

```bash
cd /root/sites/shturm.bratuxa.zomb.top && bun test && bun run build && ls dist/
```

- [ ] **Step 2: Браузер-чек harness-chrome :9222 (обязательно)**

```python
# browser_exec: открыть dist через file:// или vite preview, скрины: меню, 3 лицо, 1 лицо (V), стрельба, консоль без ошибок
```

- [ ] **Step 3: Финальный коммит**

```bash
git add shturm.bratuxa.zomb.top/dist
git commit -m "shturm: ШТУРМ-43 v1 playable, 3 карты волны босс 🏆"
```

