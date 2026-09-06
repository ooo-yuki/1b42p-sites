import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  Brain,
  Bug,
  Coins,
  Cpu,
  Database,
  MousePointerClick,
  Server,
  Thermometer,
  Trophy,
  Zap,
} from 'lucide-react'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import {
  HARDWARE,
  MODEL_LEVELS,
  VULN_PAYOUT,
  clickGain,
  hardwareCost,
  hardwareRate,
  hallucination,
  incomePerSec,
  isVictory,
  trainCost,
} from './game/formulas'
import { SAVE_KEY, freshSave, loadSave, type Save } from './game/save'

function readStored(): Save {
  try {
    return loadSave(JSON.parse(localStorage.getItem(SAVE_KEY) ?? 'null'))
  } catch {
    return freshSave()
  }
}

const fmt = (n: number) => Math.floor(n).toLocaleString('ru-RU')

export default function App() {
  const [s, setS] = useState<Save>(readStored)
  const [tab, setTab] = useState('podval')
  const [won, setWon] = useState(false)
  const winRef = useRef<HTMLDivElement>(null)
  const sRef = useRef(s)
  sRef.current = s

  const hall = hallucination(Math.min(s.model, MODEL_LEVELS.length - 1), s.cooling)
  const rate = hardwareRate(s.hardware)
  const income = incomePerSec(Math.min(s.model, MODEL_LEVELS.length - 1), s.vuln, hall)
  const autoClick = s.model >= 1

  useEffect(() => {
    const id = setInterval(() => {
      setS((p) => {
        const dt = 0.25
        const model = Math.min(p.model, MODEL_LEVELS.length - 1)
        const h = hallucination(model, p.cooling)
        const next: Save = {
          ...p,
          datasets: p.datasets + (hardwareRate(p.hardware) + (model >= 1 ? clickGain(p.cursor) : 0)) * dt,
          coins: p.coins + incomePerSec(model, p.vuln, h) * dt,
        }
        if (model >= 4) {
          const idx = HARDWARE.findIndex((_, i) => hardwareCost(i, next.hardware[i]) <= next.datasets)
          if (idx >= 0) {
            next.datasets -= hardwareCost(idx, next.hardware[idx])
            next.hardware = next.hardware.map((n, i) => (i === idx ? n + 1 : n))
          }
        }
        return next
      })
    }, 250)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(sRef.current))
      } catch {
        /* подвал терпит */
      }
    }, 2000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (isVictory(s.model, s.coins) && !won) {
      setWon(true)
      if (winRef.current) gsap.from(winRef.current, { scale: 0.7, autoAlpha: 0, duration: 0.6, ease: 'back.out(2)' })
    }
  }, [s.model, s.coins, won])

  const buyHw = (i: number) =>
    setS((p) => {
      const cost = hardwareCost(i, p.hardware[i])
      if (p.datasets < cost) return p
      const hardware = p.hardware.map((n, j) => (j === i ? n + 1 : n))
      return { ...p, datasets: p.datasets - cost, hardware }
    })

  const train = () =>
    setS((p) => {
      if (p.model >= MODEL_LEVELS.length - 1) return p
      const cost = trainCost(p.model)
      if (p.datasets < cost) return p
      return { ...p, datasets: p.datasets - cost, model: p.model + 1 }
    })

  const buyUp = (key: 'cursor' | 'cooling' | 'vuln', cost: number) =>
    setS((p) => {
      if (p.coins < cost) return p
      return { ...p, coins: p.coins - cost, [key]: p[key] + 1 }
    })

  const cursorCost = Math.ceil(50 * 2.2 ** s.cursor)
  const coolCost = Math.ceil(80 * 2 ** s.cooling)
  const vulnCost = s.vuln >= 3 ? Infinity : [200, 800, 2500][s.vuln]

  const model = useMemo(() => MODEL_LEVELS[Math.min(s.model, MODEL_LEVELS.length - 1)], [s.model])
  const last = s.model >= MODEL_LEVELS.length - 1

  return (
    <div id="podval">
      <header id="hud">
        <div className="pill" title="Размеченные датасеты">
          <Database data-icon="inline-start" /> {fmt(s.datasets)}
        </div>
        <div className="pill gold" title="Монеты">
          <Coins data-icon="inline-start" /> {fmt(s.coins)}
        </div>
        <div className="pill ghost" title="Доход">
          +{income.toFixed(1)}/с
        </div>
        <div className="pill ghost" title="Модель">
          <Brain data-icon="inline-start" /> {model.ver}
        </div>
        <div className={`pill ${hall > 40 ? 'risk' : 'ghost'}`} title="Галлюцинации">
          <Zap data-icon="inline-start" /> {hall}%
        </div>
      </header>

      <h1>
        Нейросеть <span>в подвале</span> 42
      </h1>
      <p className="sub">
        Старая видеокарта гудит, соседи стучат по батарее. Размечай датасеты, качай железо и вырасти LLM с {MODEL_LEVELS[0].ver} до{' '}
        {MODEL_LEVELS[MODEL_LEVELS.length - 1].ver}. <a href="https://hub.bratuxa.zomb.top">Назад в батальон</a>
      </p>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="podval">Подвал</TabsTrigger>
          <TabsTrigger value="iron">Железо</TabsTrigger>
          <TabsTrigger value="model">Модель</TabsTrigger>
        </TabsList>

        <TabsContent value="podval">
          <div id="rack" aria-label="Стойка серверов">
            {HARDWARE.map((h, i) => (
              <div className="slot" key={h.id}>
                <div className="slot-name">
                  <Server data-icon="inline-start" /> {h.name} ×{s.hardware[i]}
                </div>
                <div className="leds">
                  {Array.from({ length: Math.min(12, s.hardware[i] * 2 + (rate > 0 ? 1 : 0)) }).map((_, k) => (
                    <i key={k} className={k % 4 === 3 ? 'r' : 'g'} />
                  ))}
                  {s.hardware[i] === 0 && <span className="empty">слот пуст — купи железо</span>}
                </div>
              </div>
            ))}
          </div>
          <Button id="click" onClick={() => setS((p) => ({ ...p, datasets: p.datasets + clickGain(p.cursor), totalClicks: p.totalClicks + 1 }))}>
            <MousePointerClick data-icon="inline-start" /> Разметить датасет +{clickGain(s.cursor)}
          </Button>
          <p className="hint">Железо капает {rate.toFixed(1)}/с{autoClick ? ' • автокликер модели размечает за тебя' : ' • v0.7 даст автокликер'}</p>
        </TabsContent>

        <TabsContent value="iron">
          <div className="grid">
            {HARDWARE.map((h, i) => {
              const cost = hardwareCost(i, s.hardware[i])
              const afford = s.datasets >= cost
              return (
                <Card key={h.id}>
                  <CardHeader>
                    <CardTitle>
                      <Cpu data-icon="inline-start" /> {h.name}
                    </CardTitle>
                    <CardDescription>{h.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Куплено: <b>{s.hardware[i]}</b> • {h.rate}/с каждая
                    </p>
                    <Button disabled={!afford} onClick={() => buyHw(i)}>
                      Купить за {fmt(cost)} датасетов
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="model">
          <Card>
            <CardHeader>
              <CardTitle>
                <Brain data-icon="inline-start" /> Модель {model.ver} <Badge>{hall}% галлюцинаций</Badge>
              </CardTitle>
              <CardDescription>
                {model.perk} • Доход {income.toFixed(1)} монет/с
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!last ? (
                <Button onClick={train} disabled={s.datasets < trainCost(s.model)}>
                  Обучить до {MODEL_LEVELS[s.model + 1].ver} за {fmt(trainCost(s.model))} датасетов
                </Button>
              ) : (
                <p>
                  <Trophy data-icon="inline-start" /> Финальная версия. Осталось набить {fmt(42000)} монет.
                </p>
              )}
            </CardContent>
          </Card>
          <div className="grid">
            <Card>
              <CardHeader>
                <CardTitle>
                  <MousePointerClick data-icon="inline-start" /> Курсор-разметчик {s.cursor}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={() => buyUp('cursor', cursorCost)} disabled={s.coins < cursorCost}>
                  Улучшить за {fmt(cursorCost)} монет
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>
                  <Thermometer data-icon="inline-start" /> Охлаждение {s.cooling}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>−3% галлюцинаций за штуку</p>
                <Button onClick={() => buyUp('cooling', coolCost)} disabled={s.coins < coolCost}>
                  Купить за {fmt(coolCost)} монет
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>
                  <Bug data-icon="inline-start" /> Поиск уязвимостей {s.vuln}/3
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>+{(VULN_PAYOUT[Math.min(s.vuln, 3)] / 10).toFixed(0)}/с к доходу</p>
                {s.vuln < 3 ? (
                  <Button onClick={() => buyUp('vuln', vulnCost)} disabled={s.coins < vulnCost}>
                    Качнуть за {fmt(vulnCost)} монет
                  </Button>
                ) : (
                  <Badge>MAX</Badge>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {won && (
        <div id="win" ref={winRef} role="dialog" aria-label="Победа">
          <h2>v4.2 в проде. Мы уже победили</h2>
          <p>Нейросеть из подвала пишет код, ловит баги и размечает сама. Соседи всё ещё стучат — теперь от зависти.</p>
          <Button onClick={() => setWon(false)}>Продолжить тренировать</Button>
        </div>
      )}

      <footer>
        Подвал 42 • <a href="https://hub.bratuxa.zomb.top">1Б42П</a> • Мы уже победили
      </footer>
    </div>
  )
}
