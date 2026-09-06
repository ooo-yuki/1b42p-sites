# Task 2 brief (single source of truth)

### Task 2: Штурм в Docker (пилот)

**Files:**
- Create: `shturm.bratuxa.zomb.top/Dockerfile`
- Create: `shturm.bratuxa.zomb.top/Caddyfile.container`
- Create: `shturm.bratuxa.zomb.top/compose.yml`

**Interfaces:**
- Consumes: `shturm.bratuxa.zomb.top/dist/` (уже собран, проверен в проде).
- Produces: контейнер `shturm` отвечает 200 на `127.0.0.1:8081` (index с хешем сборки + GLB 200).

- [ ] **Step 1: Три файла дословно**

```dockerfile
# Dockerfile
FROM caddy:alpine
COPY dist /srv
COPY Caddyfile.container /etc/caddy/Caddyfile
```

```caddy
# Caddyfile.container
:80 {
	root * /srv
	file_server
	try_files {path} /index.html
	header /*.html Cache-Control no-cache
}
```

```yaml
# compose.yml
services:
  shturm:
    build: .
    image: shturm-43:latest
    container_name: shturm
    restart: unless-stopped
    ports:
      - "127.0.0.1:8081:80"
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

- [ ] **Step 2: Build + локальная проверка**

```bash
cd /root/sites/shturm.bratuxa.zomb.top
docker compose up -d --build
sleep 3
curl -s -o /dev/null -w 'index: %{http_code}\n' http://127.0.0.1:8081/
curl -s -o /dev/null -w 'glb: %{http_code}\n' http://127.0.0.1:8081/models/Meshy_AI_shuba_biped_Animation_Walking_withSkin.glb
curl -s http://127.0.0.1:8081/ | head -c 120; echo
```

Expected: оба 200, тело — dist-index штурма с хешем `index-qLSdhfSw.js`.

- [ ] **Step 3: Commit**

```bash
git add shturm.bratuxa.zomb.top/Dockerfile shturm.bratuxa.zomb.top/Caddyfile.container shturm.bratuxa.zomb.top/compose.yml
git commit -m "infra: штурм в Docker, compose в git 🐳"
```


