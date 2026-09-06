import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useBeacon, useRain } from './hooks';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Brain, Bug, Coins, Cpu, Database, House, MousePointerClick, Server, Thermometer, Trophy, Zap,
} from 'lucide-react';
import {
  HARDWARE, MODEL_LEVELS, VULN_PAYOUT, clickGain, hardwareCost, hardwareRate,
  hallucination, incomePerSec, isVictory, trainCost,
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

  const ml = Math.min(s.model, MODEL_LEVELS.length - 1);
  const hall = hallucination(ml, s.cooling);
  const rate = hardwareRate(s.hardware);
  const income = incomePerSec(ml, s.vuln, hall);

  useEffect(() => {
    const id = setInterval(() => {
      setS((p) => {
        const dt = 0.25;
        const m = Math.min(p.model, MODEL_LEVELS.length - 1);
        const next: Save = {
          ...p,
          datasets: p.datasets + (hardwareRate(p.hardware) + (m >= 1 ? clickGain(p.cursor) : 0)) * dt,
          coins: p.coins + incomePerSec(m, p.vuln, hallucination(m, p.cooling)) * dt,
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

  useEffect(() => {
    if (isVictory(s.model, s.coins) && !won) {
      setWon(true);
      if (winRef.current) gsap.from(winRef.current, { scale: 0.7, autoAlpha: 0, duration: 0.6, ease: 'back.out(2)' });
    }
  }, [s.model, s.coins, won]);

  const buyHw = (i: number) =>
    setS((p) => {
      const cost = hardwareCost(i, p.hardware[i]);
      if (p.datasets < cost) return p;
      return { ...p, datasets: p.datasets - cost, hardware: p.hardware.map((n, j) => (j === i ? n + 1 : n)) };
    });

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
          </div>
          <h1 id="pv-title">Нейросеть в подвале 42</h1>
          <p className="sub" id="pv-sub">
            Старая видеокарта гудит, соседи стучат по батарее. Размечай датасеты, качай железо
            и вырасти LLM с {MODEL_LEVELS[0].ver} до {MODEL_LEVELS[MODEL_LEVELS.length - 1].ver}.
          </p>
          <ToggleGroup type="single" value={tab} onValueChange={(v) => { if (v) setTab(v); }} aria-label="Разделы подвала">
            <ToggleGroupItem value="podval">Подвал</ToggleGroupItem>
            <ToggleGroupItem value="iron">Железо</ToggleGroupItem>
            <ToggleGroupItem value="model">Модель</ToggleGroupItem>
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
                const cost = hardwareCost(i, s.hardware[i]);
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
          {won && (
            <div id="pv-win" ref={winRef} role="dialog" aria-label="Победа">
              <h2>v4.2 в проде. Мы уже победили</h2>
              <p>Нейросеть из подвала пишет код, ловит баги и размечает сама. Соседи всё ещё стучат — теперь от зависти.</p>
              <button type="button" className="pill solid" onClick={() => setWon(false)}>Продолжить тренировать</button>
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
