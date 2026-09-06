# Task 8 brief (single source of truth)

### Task 8: Снос роутера + финальная приёмка

**Files:**
- Delete: `router.py` (`git rm`), юнит `chaev-site` — disable/stop, порт 8080 закрыть.

- [ ] **Step 1: Снос**

```bash
systemctl stop chaev-site; systemctl disable chaev-site
git rm router.py
git commit -m "infra: router.py под снос, один хозяин Caddy 🏆"
ss -tlnp | grep -E ':8080|:8443' || echo 'тыл закрыт'
```

- [ ] **Step 2: Приёмка по спеку раздел 9**

```bash
docker ps --format '{{.Names}} {{.Status}}'
curl -s http://127.0.0.1:9090/-/healthy; echo
```

Браузер: штурм + 3 соседа, 0 ошибок. Grafana — трафик виден. `ss -tlnp`: 80/443 только caddy.

