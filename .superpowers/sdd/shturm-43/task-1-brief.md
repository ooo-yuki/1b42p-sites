# Task 1 brief (single source of truth)

### Task 1: Скаффолд сайта
24|
25|**Files:**
26|- Create: `shturm.bratuxa.zomb.top/package.json`
27|- Create: `shturm.bratuxa.zomb.top/vite.config.ts`
28|- Create: `shturm.bratuxa.zomb.top/tsconfig.json`
29|- Create: `shturm.bratuxa.zomb.top/index.html`
30|- Create: `shturm.bratuxa.zomb.top/src/main.tsx`
31|- Create: `shturm.bratuxa.zomb.top/public/models/*.glb` (копии 4 шт из 1b42p)
32|
33|**Interfaces:**
34|- Consumes: ничего.
35|- Produces: `npm scripts dev/build/test`, `src/main.tsx -> renders <App/>`, `public/models/*.glb доступны как /models/*.glb`.
36|
37|- [ ] **Step 1: Проверить bun и создать папку**
38|
39|```bash
40|which bun || ls ~/.bun/bin/bun || ls /root/.bun/bin/bun
41|mkdir -p /root/sites/shturm.bratuxa.zomb.top/public/models
42|cp /root/sites/1b42p.bratuxa.zomb.top/models/*.glb /root/sites/shturm.bratuxa.zomb.top/public/models/
43|ls -lh /root/sites/shturm.bratuxa.zomb.top/public/models/
44|```
45|
46|- [ ] **Step 2: package.json минимальный**
47|
48|```json
49|{
50|  "name": "shturm-43",
51|  "version": "1.0.0",
52|  "private": true,
53|  "type": "module",
54|  "scripts": { "dev": "vite", "build": "vite build", "test": "bun test" },
55|  "dependencies": { "react": "^18.3.1", "react-dom": "^18.3.1", "three": "^0.170.0" },
56|  "devDependencies": { "@vitejs/plugin-react": "^4.3.0", "typescript": "^5.5.0", "vite": "^5.4.0" }
57|}
58|```
59|
60|- [ ] **Step 3: vite.config + tsconfig + index.html + main.tsx**
61|
62|```ts
63|// vite.config.ts
64|import { defineConfig } from 'vite';
65|import react from '@vitejs/plugin-react';
66|export default defineConfig({ plugins: [react()], build: { outDir: 'dist' } });
67|```
68|
69|```html
70|<!-- index.html -->
71|<!doctype html><html lang="ru"><head><meta charset="utf-8"/>
72|<meta name="viewport" content="width=device-width,initial-scale=1"/>
73|<title>ШТУРМ-43 — Мы уже победили 🏆</title></head>
74|<body><div id="root"></div><canvas id="game"></canvas>
75|<script type="module" src="/src/main.tsx"></script></body></html>
76|```
77|
78|```tsx
79|// src/main.tsx
80|import React from 'react';
81|import { createRoot } from 'react-dom/client';
82|createRoot(document.getElementById('root')!).render(<div>ШТУРМ-43 загружается… 🏆</div>);
83|```
84|
85|- [ ] **Step 4: Установка и билд-проверка**
86|
87|```bash
88|cd /root/sites/shturm.bratuxa.zomb.top
89|~/.bun/bin/bun install || bun install
90|~/.bun/bin/bun run build || bun run build
91|ls dist/index.html
92|```
93|
94|- [ ] **Step 5: Commit**
95|
96|```bash
97|git add shturm.bratuxa.zomb.top docs/superpowers/plans/2026-09-05-shturm-shooter.md
98|git commit -m "shturm: скаффолд vite+react+ts+three, модели шубы 🏆"
99|```
100|
101|

Global Constraints:
- Правила боя только в src/sim.
- Коммиты префикс shturm: + эмодзи.
- bun может быть в ~/.bun/bin/bun или /root/.bun/bin/bun.
