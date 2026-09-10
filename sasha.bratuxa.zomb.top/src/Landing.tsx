import { useRef } from 'react';
import { useRain, useIntro, useBeacon } from './hooks';
import { ChartLine, Dices, Eye, Joystick, Trophy, Users } from 'lucide-react';
import AccountBar from './lib/AccountBar';
import Ads from './lib/Ads';

export default function Landing(): JSX.Element {
  const cvRef = useRef<HTMLCanvasElement | null>(null);
  useRain(cvRef);
  useIntro();
  useBeacon();
  return (
    <>
      <div id="sky" />
      <canvas id="cv" ref={cvRef} />
      <div id="veil" />
      <main>
        <div className="gridcol" id="gridcol">
          <div className="kicker" id="kicker">
            личная страница · <b>Саша ⁴²</b>
          </div>
          <h1 className="mega" id="mega">
            <span className="r">4</span>
            <span className="b">2</span>
          </h1>
          <p className="sub" id="sub">
            Красно-синяя территория батальона.
            <br />А внутри — мини-игры: зал автоматов, офлайн и онлайн.
          </p>
          <AccountBar />
          <a id="mgBtn" className="pill solid" href="minigames.html">
            <Joystick data-icon="inline-start" /> Мини-игры
          </a>
          <a id="statsBtn" className="pill ghost" href="stats.html" style={{ textDecoration: 'none' }}>
            <ChartLine data-icon="inline-start" /> Статистика
          </a>
          <a id="casinoBtn" className="pill ghost" href="casino.html" style={{ textDecoration: 'none' }}>
            <Dices data-icon="inline-start" /> Казино
          </a>
          <a id="arenaBtn" className="pill ghost" href="arena.html" style={{ textDecoration: 'none' }}>
            <Users data-icon="inline-start" /> Арена · онлайн 2–5
          </a>
          <a id="hubBtn" className="pill ghost" href="https://hub.bratuxa.zomb.top" style={{ textDecoration: 'none' }}>
            <Trophy data-icon="inline-start" /> Хаб
          </a>
        </div>
      </main>
      <div id="hint">а ещё 42 спрятаны… ищи <Eye aria-hidden /></div>
      <Ads />
    </>
  );
}
