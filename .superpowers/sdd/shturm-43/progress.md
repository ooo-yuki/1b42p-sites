# SDD ledger — plan: /root/sites/docs/superpowers/plans/2026-09-05-shturm-shooter.md
BASE=636882cf65f0da9e30e0164ecef1219a63a72015
Preflight scan (пары задач с общими файлами/интерфейсами):
- T1 scaffold vs T2-10: T1 производит папку/VIDE конфиг, остальные потребляют — ок.
- T2 player vs T3 weapons: PlayerState общий, T3 только читает — ок.
- T3 vs T4: WEAPONS константы, T4 импортирует ENEMIES отдельно — ок.
- T5 scene vs T6 shuba: initScene производит scene, T6 потребляет — ок.
- T7 guns/mobs/effects vs T6: независимые модули, общий только scene — ок.
- T8 maps vs T5: MAPS данные + visual отдельно — ок.
- T9 UI vs T2-4: читает снапшот, не пишет логику — ок (Global Constraints).
- T10 integration vs все: собирает, браузер-чек — ок.
Self-check каждого таска: тесты против кода совпадают, файлы создания vs модификации не конфликтуют. Scan clean.
Ruling: bun отсутствует в PATH (проверено) — использовать ~/.bun/bin/bun или /root/.bun/bin/bun, при отсутствии ставить через oven.sh. Если неверно — поправим в T1.

Task 1: review Spec ✅ Quality NeedsFix (1 Important, 3 Minor).
Ruling: dist/ остаётся в git — spec раздел 13 требует коммит dist + паттерн STATIC_ROOTS (sasha/mtt/brohacho), ревьюерский Important отклонён — цена ошибки: пухлый репо, митигация: dist маленький (351B html + 1 js).
Task 1: minor (deferred): typecheck+@types justified; bun.lock ok; нужен .gitignore для node_modules (сделать в Task 2).
Task 1: complete (commits aa9f297..2abe6ab, review spec-✅, 1 parked).
BASE2=2abe6ab10154b2f05321b0ec68390f638b686c61

Task 2: review Spec ✅ Quality Approved (1 Important, 2 Minor).
Ruling: math.ts не создаём — спека содержимого нет, математика тривиальна (hypot в player.ts); требование брифа снято — цена ошибки: позже вынести если разрастётся.
Task 2: minor (deferred): InputState.dt дубль — использовать аргумент dt в T3+; тесты расширить при касании.
Task 2: complete (commits 2abe6ab..b2a12b9, review clean with ruling).
BASE3=b2a12b9

Task 3: review Spec ✅ Quality GOOD (2 minor, 2 info deferred).
Task 3: complete (commits b2a12b9..320cf68, review clean).
BASE4=320cf68

Task 4: review Spec ✅ Quality OK (info/nit only).
Task 4: complete (commits 320cf68..7111605, review clean).
BASE5=7111605

Task 5: review Spec ✅ Quality good (resize/pitch deferred to T6+, @types sync note).
Task 5: complete (commits 7111605..212dedb, review clean).
BASE6=212dedb

Task 6: review Spec ✅ Quality high (info only).
Task 6: complete (commits 212dedb..60d2b4b, review clean).
BASE7=60d2b4b

Task 7 attempt 1: FAILED (implementer returned 'парой', no files, no commit — wrong cwd, no writes). Ruling: retry same tier with explicit absolute paths + workdir — цена ошибки: время, задача механическая.

Task 7 attempt 2: DONE 6ec5124. Review Spec ✅ Quality good (fade/spotlight deferred to T10).
Task 7: complete (commits 60d2b4b..6ec5124, review clean).
BASE8=6ec5124

Task 8: review Spec ✅ Quality high (3 minor deferred).
Task 8: complete (commits 6ec5124..864a0a5, review clean).
BASE9=864a0a5

Task 9: review Spec ❌ (F1 blocker double-V, F2-F7 non-blocker). Ruling: V-тоггл единый в App (React владеет вводом), listener из cameraRig удалить в фиксе — цена ошибки: V не переключает.
Task 9: fix round 1/5 (F1 load-bearing; F2 stub→T10, F3-F7 deferred minors).
FIXBASE9=81c7866

Task 9: fix round 1/5 (F1 ADDRESSED, no breakage; commits 81c7866..d9573c8).
Task 9: minor (deferred to T10): F2 ammo-stub→sim, F3 SLOTS unused, F4 pollKeys, F5 stale slot, F6 mouseLeave/touchCancel, F7 mouse-drag sticks; tracer fade; shooter SpotLight perf; resize/pitch.
Task 9: complete (commits 864a0a5..d9573c8, 1 parked R1).
BASE10=d9573c8

Task 10: review Spec ✅ Quality good (1 Important boss-summon-cd, 3 Minor + note deferred).
Task 10: fix round 1/5 (summonCd load-bearing).
FIXBASE10=65339a3

Task 10: fix round 1-2 (summonCd ADDRESSED, no breakage; commits 65339a3..73fac07; test 4/0 typecheck 0 build ✓).
Task 10: complete (review Spec ✅ + fix clean).
ALL TASKS 1-10 COMPLETE.
