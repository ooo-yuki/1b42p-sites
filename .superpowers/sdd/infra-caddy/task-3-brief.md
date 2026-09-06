# Task 3 brief (single source of truth)

### Task 3: Caddyfile хоста + роутер в тыл

**Files:**
- Modify: `infra/Caddyfile` (полный пилот-конфиг, ниже)
- Modify: `router.py` (bind на 127.0.0.1:8080 — 2 строки в serve_http/serve_https)
- Test: `caddy validate --config /root/sites/infra/Caddyfile`

**Interfaces:**
- Consumes: контейнер :8081 (Task 2), бэкенды 8091–8095 живые.
- Produces: валидный Caddyfile: shturm→:8081, 19 хостов→:8080, /api→809X; роутер готов к тылу.

- [ ] **Step 1: Пилот-Caddyfile дословно**

```caddy
{
	email admin@bratuxa.zomb.top
	log {
		output file /var/log/caddy/access.log {
			roll_size 50MiB
			roll_keep 10
		}
		format json
	}
}

(common) {
	header /*.html Cache-Control no-cache
	header -Server
	encode gzip
}

shturm.bratuxa.zomb.top {
	import common
	reverse_proxy 127.0.0.1:8081
}

1b42p.bratuxa.zomb.top, 42laiv.bratuxa.zomb.top, 42vs.bratuxa.zomb.top, ai-714ef0.bratuxa.zomb.top, brohacho.bratuxa.zomb.top, chaev.bratuxa.zomb.top, denis.bratuxa.zomb.top, doom.bratuxa.zomb.top, evaelph.bratuxa.zomb.top, gtaevv.bratuxa.zomb.top, hub.bratuxa.zomb.top, miqqil.bratuxa.zomb.top, mtt.bratuxa.zomb.top, pampers.bratuxa.zomb.top, sasha.bratuxa.zomb.top, setden.bratuxa.zomb.top, skitons.bratuxa.zomb.top, smolgrad.bratuxa.zomb.top, svyatoslav.bratuxa.zomb.top {
	import common
	reverse_proxy 127.0.0.1:8080
}
# /api/* каждого хоста — до миграции держит роутер в тылу; при миграции хоста
# добавляется блок: reverse_proxy /api/* 127.0.0.1:809X
```

- [ ] **Step 2: Роутер в тыл (только bind, логика не трогается)**

```bash
# в router.py: serve_http ThreadingHTTPServer(("127.0.0.1", 8080)...),
# serve_https ThreadingHTTPServer(("127.0.0.1", 8443)...). Больше ничего.
python3 -c "import ast; ast.parse(open('/root/sites/router.py').read()); print('syntax OK')"
```

- [ ] **Step 3: Validate + commit (без рестарта! прод не трогаем)**

```bash
caddy validate --config /root/sites/infra/Caddyfile
git add infra/Caddyfile router.py
git commit -m "infra: пилот-Caddyfile + роутер в тыл 8080 🏆"
```

Expected: `Valid configuration`.


