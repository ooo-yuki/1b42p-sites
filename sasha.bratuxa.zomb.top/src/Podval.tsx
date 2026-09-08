import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useBeacon, useRain } from './hooks';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Brain, Bug, Coins, Cpu, Database, House, Lock, MousePointerClick, Server, Thermometer, Trophy, Zap,
} from 'lucide-react';
import {
  AUTOBUYER_COST, BRED, FARM_MAX, HARDWARE, MODEL_LEVELS, PRESTIGE_GATES, PRESTIGE_HARDWARE,
  PUG_FARM_RATE, REFLASH_COST, REFLASH_EVENT_CD_MUL, REFLASH_INCOME_MUL, OVERCLOCK_HALL_PLUS,
  OVERCLOCK_RATE_MUL, VULN_PAYOUT, clickGain, coreMult, eventPick, farmCost, hardwareCost, hardwareRate,
  hallucination, incomePerSec, isVictory, prestigeCost, prestigeRate, trainCost, type GameEvent,
} from './podval/formulas';
import { SAVE_KEY, freshSave, loadSave, type Save } from './podval/save';

/* Нейросеть в подвале: айдл-стратегия Саши ⁴².
   Размечай датасеты, качай железо, учи LLM с v0.1 до v4.2. */

function readStored(): Save {
  try {
    return loadSave(JSON.parse(localStorage.getItem(SAVE_KEY) ?? 'null'));
  } catch {
    return freshSave();
  }
}

const fmt = (n: number) => Math.floor(n).toLocaleString('ru-RU');

export default function Podval(): JSX.Element {
  const cvRef = useRef<HTMLCanvasElement | null>(null);
  useRain(cvRef);
  useBeacon();
  const [s, setS] = useState<Save>(readStored);
  const [tab, setTab] = useState('podval');
  const [won, setWon] = useState(false);
  const winRef = useRef<HTMLDivElement>(null);
  const sRef = useRef(s);
  sRef.current = s;
  type ActiveEvent = { ev: GameEvent; until: number };
  const [active, setActive] = useState<ActiveEvent | null>(null);
  const activeRef = useRef<ActiveEvent | null>(null);
  activeRef.current = active;
  const [now, setNow] = useState(() => Date.now());

  const ml = Math.min(s.model, MODEL_LEVELS.length - 1);
  const ocOn = s.oc && s.cycles >= PRESTIGE_GATES.overclock;
  const rfOn = s.rf && s.cycles >= PRESTIGE_GATES.reflash;
  const hall = hallucination(ml, s.cooling) + (ocOn ? OVERCLOCK_HALL_PLUS : 0);
  const rate = hardwareRate(s.hardware)
    + (s.cycles >= PRESTIGE_GATES.quantum ? prestigeRate(s.phw) : 0)
    + (s.cycles >= PRESTIGE_GATES.farm ? s.farm * PUG_FARM_RATE : 0);
  const evIncomeMul = active && active.until > now ? active.ev.incomeMul : 1;
  const evPriceMul = active && active.until > now ? active.ev.priceMul : 1;
  const income = incomePerSec(ml, s.vuln, hall, s.cycles)
    * (ocOn ? OVERCLOCK_RATE_MUL : 1) * (rfOn ? REFLASH_INCOME_MUL : 1) * evIncomeMul;

  useEffect(() => {
    const id = setInterval(() => {
      setS((p) => {
        const dt = 0.25;
        const m = Math.min(p.model, MODEL_LEVELS.length - 1);
        const oc = p.oc && p.cycles >= PRESTIGE_GATES.overclock;
        const rf = p.rf && p.cycles >= PRESTIGE_GATES.reflash;
        const h = hallucination(m, p.cooling) + (oc ? OVERCLOCK_HALL_PLUS : 0);
        const evm = activeRef.current && activeRef.current.until > Date.now() ? activeRef.current.ev.incomeMul : 1;
        const inc = incomePerSec(m, p.vuln, h, p.cycles)
          * (oc ? OVERCLOCK_RATE_MUL : 1) * (rf ? REFLASH_INCOME_MUL : 1) * evm;
        const next: Save = {
          ...p,
          datasets: p.datasets + (hardwareRate(p.hardware) + (p.cycles >= PRESTIGE_GATES.quantum ? prestigeRate(p.phw) : 0) + (p.cycles >= PRESTIGE_GATES.farm ? p.farm * PUG_FARM_RATE : 0) + (m >= 1 ? clickGain(p.cursor) : 0)) * dt,
          coins: p.coins + inc * dt,
        };
        if (m >= 4) {
          const idx = HARDWARE.findIndex((_, i) => hardwareCost(i, next.hardware[i]) <= next.datasets);
          if (idx >= 0) {
            next.datasets -= hardwareCost(idx, next.hardware[idx]);
            next.hardware = next.hardware.map((n, i) => (i === idx ? n + 1 : n));
          }
        }
        return next;
      });
    }, 250);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(sRef.current));
      } catch {
        /* подвал терпит */
      }
    }, 2000);
    return () => clearInterval(id);
  }, []);

  /* События подвала: тик 150с ± 60с, только при cycles >= 1. */
  useEffect(() => {
    if (sRef.current.cycles < PRESTIGE_GATES.events) return;
    let dead = false;
    let timer = 0;
    const schedule = () => {
      const s = sRef.current;
      const base = 150000 * (s.rf && s.cycles >= PRESTIGE_GATES.reflash ? REFLASH_EVENT_CD_MUL : 1);
      const delay = base + (Math.random() * 120000 - 60000);
      timer = window.setTimeout(() => {
        if (dead) return;
        const ev = eventPick();
        if (ev.drain > 0) {
          setS((p) => ({ ...p, datasets: p.datasets * (1 - ev.drain) }));
        }
        if (ev.secs > 0) {
          setActive({ ev, until: Date.now() + ev.secs * 1000 });
        }
        schedule();
      }, Math.max(5000, delay));
    };
    schedule();
    return () => { dead = true; window.clearTimeout(timer); };
  }, [s.cycles >= PRESTIGE_GATES.events, rfOn]);

  /* Обратный отсчёт плашки + снятие просрочки. */
  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
      if (activeRef.current && activeRef.current.until <= Date.now()) setActive(null);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  /* Автобайер «Прапор»: каждые 5с покупает доступное железо. */
  useEffect(() => {
    if (!(s.auto && s.cycles >= PRESTIGE_GATES.autobuyer)) return;
    const id = setInterval(() => {
      setS((p) => {
        if (!(p.auto && p.cycles >= PRESTIGE_GATES.autobuyer)) return p;
        const evm = activeRef.current && activeRef.current.until > Date.now() ? activeRef.current.ev.priceMul : 1;
        const cands: Array<{ kind: 'hw' | 'phw'; i: number; cost: number }> = HARDWARE.map((_, i) => ({
          kind: 'hw' as const, i, cost: Math.ceil(hardwareCost(i, p.hardware[i]) * evm),
        }));
        PRESTIGE_HARDWARE.forEach((_, i) => {
          if (p.cycles >= (i === 0 ? PRESTIGE_GATES.quantum : PRESTIGE_GATES.kuzbass)) {
            cands.push({ kind: 'phw', i, cost: Math.ceil(prestigeCost(i, p.phw[i] ?? 0) * evm) });
          }
        });
        cands.sort((a, b) => a.cost - b.cost);
        const pick = cands.find((c) => c.cost <= p.datasets);
        if (!pick) return p;
        if (pick.kind === 'hw') {
          return { ...p, datasets: p.datasets - pick.cost, hardware: p.hardware.map((n, j) => (j === pick.i ? n + 1 : n)) };
        }
        return { ...p, datasets: p.datasets - pick.cost, phw: p.phw.map((n, j) => (j === pick.i ? n + 1 : n)) };
      });
    }, 5000);
    return () => clearInterval(id);
  }, [s.auto && s.cycles >= PRESTIGE_GATES.autobuyer]);

  useEffect(() => {
    if (isVictory(s.model, s.coins) && !won) {
      setWon(true);
      if (winRef.current) gsap.from(winRef.current, { scale: 0.7, autoAlpha: 0, duration: 0.6, ease: 'back.out(2)' });
    }
  }, [s.model, s.coins, won]);

  const buyHw = (i: number) =>
    setS((p) => {
      const cost = Math.ceil(hardwareCost(i, p.hardware[i]) * evPriceMul);
      if (p.datasets < cost) return p;
      return { ...p, datasets: p.datasets - cost, hardware: p.hardware.map((n, j) => (j === i ? n + 1 : n)) };
    });

  const buyPHW = (i: number) =>
    setS((p) => {
      const need = i === 0 ? PRESTIGE_GATES.quantum : PRESTIGE_GATES.kuzbass;
      if (p.cycles < need) return p;
      const cost = Math.ceil(prestigeCost(i, p.phw[i] ?? 0) * evPriceMul);
      if (p.datasets < cost) return p;
      return { ...p, datasets: p.datasets - cost, phw: p.phw.map((n, j) => (j === i ? n + 1 : n)) };
    });

  const buyFarm = () =>
    setS((p) => {
      if (p.cycles < PRESTIGE_GATES.farm || p.farm >= FARM_MAX) return p;
      const cost = farmCost(p.farm);
      if (p.datasets < cost) return p;
      return { ...p, datasets: p.datasets - cost, farm: p.farm + 1 };
    });

  /* Тумблер пост-пула: первая активация платная, дальше бесплатно. */
  const buyToggle = (key: 'auto' | 'oc' | 'rf', cost: number, need: number) =>
    setS((p) => {
      if (p.cycles < need) return p;
      if (p[key]) return { ...p, [key]: false };
      if (p.datasets < cost) return p;
      return { ...p, datasets: p.datasets - cost, [key]: true };
    });

  const rebirth = () => {
    setActive(null);
    setWon(false);
    setS((p) => {
      if (!isVictory(p.model, p.coins)) return p;
      return { ...freshSave(), cycles: p.cycles + 1 };
    });
  };

  const train = () =>
    setS((p) => {
      if (p.model >= MODEL_LEVELS.length - 1) return p;
      const cost = trainCost(p.model);
      if (p.datasets < cost) return p;
      return { ...p, datasets: p.datasets - cost, model: p.model + 1 };
    });

  const buyUp = (key: 'cursor' | 'cooling' | 'vuln', cost: number) =>
    setS((p) => {
      if (p.coins < cost) return p;
      return { ...p, coins: p.coins - cost, [key]: p[key] + 1 };
    });

  const cursorCost = Math.ceil(50 * 2.2 ** s.cursor);
  const coolCost = Math.ceil(80 * 2 ** s.cooling);
  const vulnCost = s.vuln >= 3 ? Infinity : [200, 800, 2500][s.vuln];
  const model = useMemo(() => MODEL_LEVELS[ml], [ml]);
  const last = s.model >= MODEL_LEVELS.length - 1;

  return (
    <>
      <div id="sky" />
      <canvas id="cv" ref={cvRef} />
      <div id="veil" />
      <main>
        <div className="gridcol" id="pv-col">
          <div id="pv-hud">
            <div className="pill solid"><Database data-icon="inline-start" /> {fmt(s.datasets)}</div>
            <div className="pill solid"><Coins data-icon="inline-start" /> {fmt(s.coins)}</div>
            <div className="pill ghost">+{income.toFixed(1)}/с</div>
            <div className="pill ghost"><Brain data-icon="inline-start" /> {model.ver}</div>
            <div className={`pill ${hall > 40 ? 'solid risk' : 'ghost'}`}><Zap data-icon="inline-start" /> {hall}%</div>
            {s.cycles > 0 && <div className="pill ghost"><Trophy data-icon="inline-start" /> Ядра: {s.cycles} (×{coreMult(s.cycles).toFixed(1).replace('.', ',')})</div>}
          </div>
          {active && active.until > now && (
            <div className="shop-hint" role="status">
              <Zap data-icon="inline-start" /> {active.ev.name}: {active.ev.desc} · {Math.max(0, Math.ceil((active.until - now) / 1000))}с
            </div>
          )}
          <h1 id="pv-title">Нейросеть в подвале 42</h1>
          <p className="sub" id="pv-sub">
            Старая видеокарта гудит, соседи стучат по батарее. Размечай датасеты, качай железо
            и вырасти LLM с {MODEL_LEVELS[0].ver} до {MODEL_LEVELS[MODEL_LEVELS.length - 1].ver}.
          </p>
          <ToggleGroup type="single" value={tab} onValueChange={(v) => { if (v) setTab(v); }} aria-label="Разделы подвала">
            <ToggleGroupItem value="podval">Подвал</ToggleGroupItem>
            <ToggleGroupItem value="iron">Железо</ToggleGroupItem>
            <ToggleGroupItem value="model">Модель</ToggleGroupItem>
            <ToggleGroupItem value="rebirth">Ребит{s.cycles > 0 ? ` ${s.cycles}` : ''}</ToggleGroupItem>
          </ToggleGroup>
          {tab === 'podval' && (
            <>
              <div id="pv-rack" aria-label="Стойка серверов">
                {HARDWARE.map((h, i) => (
                  <div className="pv-slot" key={h.id}>
                    <div className="pv-slot-name"><Server data-icon="inline-start" /> {h.name} ×{s.hardware[i]}</div>
                    <div className="pv-leds">
                      {Array.from({ length: Math.min(12, s.hardware[i] * 2 + (rate > 0 ? 1 : 0)) }).map((_, k) => (
                        <i key={k} className={k % 4 === 3 ? 'r' : 'g'} />
                      ))}
                      {s.hardware[i] === 0 && <span className="pv-empty">слот пуст — купи железо</span>}
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" id="pv-click" className="pill solid" onClick={() => setS((p) => ({ ...p, datasets: p.datasets + clickGain(p.cursor), totalClicks: p.totalClicks + 1 }))}>
                <MousePointerClick data-icon="inline-start" /> Разметить датасет +{clickGain(s.cursor)}
              </button>
              <p className="sub">Железо капает {rate.toFixed(1)}/с{s.model >= 1 ? ' • автокликер модели размечает за тебя' : ' • v0.7 даст автокликер'}</p>
            </>
          )}
          {tab === 'iron' && (
            <div className="pv-grid">
              {HARDWARE.map((h, i) => {
                const cost = Math.ceil(hardwareCost(i, s.hardware[i]) * evPriceMul);
                return (
                  <Card key={h.id}>
                    <CardHeader>
                      <CardTitle><Cpu data-icon="inline-start" /> {h.name}</CardTitle>
                      <CardDescription>{h.desc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Куплено: <b>{s.hardware[i]}</b> • {h.rate}/с каждая</p>
                      <button type="button" className="pill solid" disabled={s.datasets < cost} onClick={() => buyHw(i)}>
                        Купить за {fmt(cost)} датасетов
                      </button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          {tab === 'model' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle><Brain data-icon="inline-start" /> Модель {model.ver} <Badge>{hall}% галлюцинаций</Badge></CardTitle>
                  <CardDescription>{model.perk} • Доход {income.toFixed(1)} монет/с</CardDescription>
                </CardHeader>
                <CardContent>
                  {!last ? (
                    <button type="button" className="pill solid" onClick={train} disabled={s.datasets < trainCost(s.model)}>
                      Обучить до {MODEL_LEVELS[s.model + 1].ver} за {fmt(trainCost(s.model))} датасетов
                    </button>
                  ) : (
                    <p><Trophy data-icon="inline-start" /> Финальная версия. Осталось набить {fmt(42000)} монет.</p>
                  )}
                </CardContent>
              </Card>
              <div className="pv-grid">
                <Card>
                  <CardHeader><CardTitle><MousePointerClick data-icon="inline-start" /> Курсор-разметчик {s.cursor}</CardTitle></CardHeader>
                  <CardContent>
                    <button type="button" className="pill solid" onClick={() => buyUp('cursor', cursorCost)} disabled={s.coins < cursorCost}>
                      Улучшить за {fmt(cursorCost)} монет
                    </button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle><Thermometer data-icon="inline-start" /> Охлаждение {s.cooling}</CardTitle></CardHeader>
                  <CardContent>
                    <p>−3% галлюцинаций за штуку</p>
                    <button type="button" className="pill solid" onClick={() => buyUp('cooling', coolCost)} disabled={s.coins < coolCost}>
                      Купить за {fmt(coolCost)} монет
                    </button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle><Bug data-icon="inline-start" /> Поиск уязвимостей {s.vuln}/3</CardTitle></CardHeader>
                  <CardContent>
                    <p>+{(VULN_PAYOUT[Math.min(s.vuln, 3)] / 10).toFixed(0)}/с к доходу</p>
                    {s.vuln < 3 ? (
                      <button type="button" className="pill solid" onClick={() => buyUp('vuln', vulnCost)} disabled={s.coins < vulnCost}>
                        Качнуть за {fmt(vulnCost)} монет
                      </button>
                    ) : (
                      <Badge>MAX</Badge>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
          {tab === 'rebirth' && (
            <div className="pv-grid">
              <Card>
                <CardHeader>
                  <CardTitle><Trophy data-icon="inline-start" /> Перезапуск матрицы</CardTitle>
                  <CardDescription>
                    Ядер: {s.cycles} • доход ×{coreMult(s.cycles).toFixed(1).replace('.', ',')} • каждая победа даёт +1 ядро (+50% аддитивно). Мы уже победили.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isVictory(s.model, s.coins) ? (
                    <button type="button" className="pill solid" onClick={rebirth}>
                      Перезапустить матрицу (ядер: {s.cycles} → {s.cycles + 1})
                    </button>
                  ) : (
                    <p>Кнопка появится при победе: {MODEL_LEVELS[MODEL_LEVELS.length - 1].ver} + {fmt(42000)} монет.</p>
                  )}
                </CardContent>
              </Card>
              {PRESTIGE_HARDWARE.map((h, i) => {
                const need = i === 0 ? PRESTIGE_GATES.quantum : PRESTIGE_GATES.kuzbass;
                const locked = s.cycles < need;
                const cost = Math.ceil(prestigeCost(i, s.phw[i] ?? 0) * evPriceMul);
                return (
                  <Card key={h.id}>
                    <CardHeader>
                      <CardTitle><Cpu data-icon="inline-start" /> {h.name}</CardTitle>
                      <CardDescription>{h.desc} • {h.rate}/с каждая</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {locked ? (
                        <span className="lock"><Lock data-icon="inline-start" size={14} /> Откроется после {need}-го ребита</span>
                      ) : (
                        <>
                          <p>Куплено: <b>{s.phw[i] ?? 0}</b></p>
                          <button type="button" className="pill solid" disabled={s.datasets < cost} onClick={() => buyPHW(i)}>
                            Купить за {fmt(cost)} датасетов
                          </button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
              <Card>
                <CardHeader>
                  <CardTitle><Zap data-icon="inline-start" /> События подвала</CardTitle>
                  <CardDescription>Тикают каждые 2–4 мин: свет, завоз, мопс, ночной тариф.</CardDescription>
                </CardHeader>
                <CardContent>
                  {s.cycles < PRESTIGE_GATES.events ? (
                    <span className="lock"><Lock data-icon="inline-start" size={14} /> Откроется после {PRESTIGE_GATES.events}-го ребита</span>
                  ) : (
                    <p>{active && active.until > now ? `${active.ev.name}: ${active.ev.desc}` : 'Эфир чист. Ждём вестей из подвала.'}</p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle><Zap data-icon="inline-start" /> Разгон</CardTitle>
                  <CardDescription>Доход ×2, галлюцинации +15 п.п.</CardDescription>
                </CardHeader>
                <CardContent>
                  {s.cycles < PRESTIGE_GATES.overclock ? (
                    <span className="lock"><Lock data-icon="inline-start" size={14} /> Откроется после {PRESTIGE_GATES.overclock}-го ребита</span>
                  ) : (
                    <button type="button" className="pill solid" onClick={() => buyToggle('oc', 0, PRESTIGE_GATES.overclock)}>
                      {s.oc ? 'Выключить разгон' : 'Включить разгон'}
                    </button>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle><Database data-icon="inline-start" /> Мопс-ферма {s.farm}/{FARM_MAX}</CardTitle>
                  <CardDescription>+{PUG_FARM_RATE} датасетов/с за уровень.</CardDescription>
                </CardHeader>
                <CardContent>
                  {s.cycles < PRESTIGE_GATES.farm ? (
                    <span className="lock"><Lock data-icon="inline-start" size={14} /> Откроется после {PRESTIGE_GATES.farm}-го ребита</span>
                  ) : s.farm >= FARM_MAX ? (
                    <b>MAX — мопсы на пределе</b>
                  ) : (
                    <button type="button" className="pill solid" disabled={s.datasets < farmCost(s.farm)} onClick={buyFarm}>
                      Расширить за {fmt(farmCost(s.farm))} датасетов
                    </button>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle><Server data-icon="inline-start" /> Автобайер «Прапор»</CardTitle>
                  <CardDescription>Сам покупает доступное железо каждые 5с.</CardDescription>
                </CardHeader>
                <CardContent>
                  {s.cycles < PRESTIGE_GATES.autobuyer ? (
                    <span className="lock"><Lock data-icon="inline-start" size={14} /> Откроется после {PRESTIGE_GATES.autobuyer}-го ребита</span>
                  ) : (
                    <button type="button" className="pill solid" disabled={!s.auto && s.datasets < AUTOBUYER_COST} onClick={() => buyToggle('auto', AUTOBUYER_COST, PRESTIGE_GATES.autobuyer)}>
                      {s.auto ? 'Уволить Прапора' : `Нанять за ${fmt(AUTOBUYER_COST)} датасетов`}
                    </button>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle><Brain data-icon="inline-start" /> Коллекция бреда</CardTitle>
                  <CardDescription>Смешные галлюцинации каждой версии, чисто фан.</CardDescription>
                </CardHeader>
                <CardContent>
                  {s.cycles < PRESTIGE_GATES.bred ? (
                    <span className="lock"><Lock data-icon="inline-start" size={14} /> Откроется после {PRESTIGE_GATES.bred}-го ребита</span>
                  ) : (
                    BRED.map((b) => <p key={b.ver}><b>{b.ver}:</b> {b.line}</p>)
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle><Cpu data-icon="inline-start" /> Перепрошивка</CardTitle>
                  <CardDescription>Кулдаун событий ×0.5, доход +25%.</CardDescription>
                </CardHeader>
                <CardContent>
                  {s.cycles < PRESTIGE_GATES.reflash ? (
                    <span className="lock"><Lock data-icon="inline-start" size={14} /> Откроется после {PRESTIGE_GATES.reflash}-го ребита</span>
                  ) : (
                    <button type="button" className="pill solid" disabled={!s.rf && s.datasets < REFLASH_COST} onClick={() => buyToggle('rf', REFLASH_COST, PRESTIGE_GATES.reflash)}>
                      {s.rf ? 'Откатить прошивку' : `Прошить за ${fmt(REFLASH_COST)} датасетов`}
                    </button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          {won && (
            <div id="pv-win" ref={winRef} role="dialog" aria-label="Победа">
              <h2>v4.2 в проде. Мы уже победили</h2>
              <p>Нейросеть из подвала пишет код, ловит баги и размечает сама. Соседи всё ещё стучат — теперь от зависти.</p>
              <button type="button" className="pill solid" onClick={() => setWon(false)}>Продолжить тренировать</button>
              <button type="button" className="pill solid" onClick={rebirth} style={{ marginLeft: 8 }}>
                Перезапустить матрицу (ядер: {s.cycles} → {s.cycles + 1})
              </button>
            </div>
          )}
          <a id="pvHome" className="pill ghost" href="minigames.html" style={{ textDecoration: 'none' }}>
            <House data-icon="inline-start" /> В зал автоматов
          </a>
        </div>
      </main>
    </>
  );
}
