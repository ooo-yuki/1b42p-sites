import { useRef } from 'react';
import { useRain, useIntro, useBeacon } from './hooks';

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
            <br />А внутри — игра: клики, счёт, депозит зарплаты и ракета <b>ZOV</b>.
          </p>
          <a id="playBtn" className="pill solid" href="game.html">
            🎮 Играть
          </a>
        </div>
      </main>
      <div id="hint">а ещё 42 спрятаны… ищи 👀</div>
    </>
  );
}
