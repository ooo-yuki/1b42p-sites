import { useRef } from 'react';
import { useBeacon, useRain } from './hooks';
import { Badge } from '@/components/ui/badge';
import {
  Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Gamepad2, House, Wifi, WifiOff } from 'lucide-react';
import { listGames, type MiniGame } from './minigames/registry';

/* Витрина мини-игр: зал автоматов без поиска и матчмейкинга.
   Новая игра = запись в реестре; вьюха не трогается. */

function Badges({ g }: { g: MiniGame }): JSX.Element {
  return (
    <div className="mg-badges">
      <Badge variant={g.mode === 'online' ? 'default' : 'secondary'} data-icon="inline-start">
        {g.mode === 'online' ? <Wifi data-icon="inline-start" /> : <WifiOff data-icon="inline-start" />}
        {g.mode === 'online' ? 'онлайн' : 'офлайн'}
      </Badge>
      {g.test && <Badge variant="outline">тест</Badge>}
    </div>
  );
}

export default function Minigames(): JSX.Element {
  const cvRef = useRef<HTMLCanvasElement | null>(null);
  useRain(cvRef);
  useBeacon();
  const games = listGames();
  return (
    <>
      <div id="sky" />
      <canvas id="cv" ref={cvRef} />
      <div id="veil" />
      <main>
        <div className="gridcol" id="mg-col">
          <h1 className="mg-title" id="mg-title">Мини-игры</h1>
          <p className="sub" id="mg-sub">
            Зал автоматов 42: зарубись прямо сейчас — офлайн без очереди,
            онлайн с братухами. Новые завозы появляются сами.
          </p>
          <div className="mg-grid">
            {games.map(g => (
              <Card key={g.id} className="mg-card">
                <CardHeader>
                  <CardTitle>{g.title}</CardTitle>
                  <CardAction><Badges g={g} /></CardAction>
                  <CardDescription>{g.desc}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <a className="pill solid" href={g.href} style={{ textDecoration: 'none' }}>
                    <Gamepad2 data-icon="inline-start" /> Открыть
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
          <p className="mg-note" id="mg-note">
            Тестовый автомат — старый кликер. Боевые игры уже в пути. Мы уже победили.
          </p>
          <a id="mgHome" className="pill ghost" href="index.html" style={{ textDecoration: 'none' }}>
            <House data-icon="inline-start" /> На главную
          </a>
        </div>
      </main>
    </>
  );
}
