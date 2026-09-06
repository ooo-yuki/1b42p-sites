# Task 7 brief (single source of truth)

### Task 7: Миграция 19 хостов (по одному в день)

**Files:**
- Modify: `infra/Caddyfile` (на каждый хост: свой блок вместо строки в общем списке).

**Interfaces:**
- Consumes: зелёный прод Task 5.
- Produces: хост раздаётся нативно (статика из папки/dist, /api на свой 809X); `caddy reload` без обрывов.

Шаблон блока на хост (пример — танки, dist нет, API 8091):

```caddy
miqqil.bratuxa.zomb.top {
	import common
	root * /root/sites/miqqil.bratuxa.zomb.top
	file_server
	try_files {path} /index.html
	reverse_proxy /api/* 127.0.0.1:8091
}
```

- [ ] **Step 1..N: На хост — блок + reload + curl + браузер-спотчек + commit**

```bash
caddy validate --config /root/sites/infra/Caddyfile
cp /root/sites/infra/Caddyfile /etc/caddy/Caddyfile
systemctl reload caddy
curl -s -o /dev/null -w '<host>: %{http_code}\n' https://<host>.bratuxa.zomb.top/
git add infra/Caddyfile
git commit -m "infra: <host> нативно с Caddy 🏆"
```

Порядок: hub → sasha → mtt → miqqil → evaelph → остальные (API-хосты раньше — там WS проверить).


