#!/usr/bin/env python3
"""Amigo infra watcher — тихий скрипт для no_agent крона (каждые 5 мин).

Печатает текст ТОЛЬКО при изменениях (новые проблемы / recoveries),
иначе пусто — и тогда крон ничего в чат не шлёт.
Состояние: /root/.hermes/profiles/keshiu/infra-watch.state
"""
import json
import os
import urllib.request

PROM = "http://127.0.0.1:9090"
STATE = "/root/.hermes/profiles/keshiu/infra-watch.state"


def get(url, timeout=10):
    with urllib.request.urlopen(url, timeout=timeout) as r:
        return r.read().decode()


problems = set()
try:
    rules = json.loads(get(PROM + "/api/v1/rules"))
    for g in rules["data"]["groups"]:
        for r in g["rules"]:
            for a in r.get("alerts", []):
                if a.get("state") == "firing":
                    lbl = a.get("labels", {})
                    inst = lbl.get("instance", "")
                    problems.add(
                        "ALERT %s %s sev=%s"
                        % (lbl.get("alertname"), inst, lbl.get("severity"))
                    )
    tg = json.loads(get(PROM + "/api/v1/targets?state=active"))
    for t in tg["data"]["activeTargets"]:
        if t.get("health") != "up":
            problems.add("DOWN %s %s" % (t.get("scrapePool"), t.get("scrapeUrl")))
except Exception as e:  # сам фарш недоступен — тоже событие
    problems.add("WATCHER-ERROR %s: %s" % (type(e).__name__, e))

prev = set()
if os.path.exists(STATE):
    with open(STATE) as f:
        prev = set(line for line in f.read().splitlines() if line)

out = []
for p in sorted((problems - prev)):
    if p.startswith("WATCHER-ERROR"):
        out.append(
            "\U0001f6a8 Вахта 42: не вижу фарш (%s). Проверьте мониторинг, compas." % p
        )
    else:
        out.append("\U0001f6a8 Вахта 42: %s" % p)
for p in sorted((prev - problems)):
    if not p.startswith("WATCHER-ERROR"):
        out.append("\u2705 Вахта 42: отпустило — %s" % p)

os.makedirs(os.path.dirname(STATE), exist_ok=True)
with open(STATE, "w") as f:
    f.write("\n".join(sorted(problems)))

print("\n".join(out))
