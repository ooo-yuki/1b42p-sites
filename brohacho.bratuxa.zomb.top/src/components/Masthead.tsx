import type { JSX } from 'react';
import { fmt } from '../game/formulas';

/* Липкая мачта-афиша + пилюли ресурсов. id те же, что в legacy. */
export function Masthead(props: { h: number; f: number; fans: number }): JSX.Element {
  return (
    <div id="top">
      <h1>
        <span className="k">42 БРАТУХА</span>ФАБРИКА ХАЙПА 🏆
      </h1>
      <div className="sub">
        продюсер Пятёрки · дорога на SLAY 2026 ·{' '}
        <a href="https://hub.bratuxa.zomb.top">← Хаб 1Б42П</a>
      </div>
      <div id="res">
        <span className="pill">
          🔥 Хайп: <b id="rH">{fmt(props.h)}</b>
        </span>
        <span className="pill">
          🎟️ Фантики: <b id="rF">{fmt(props.f)}</b>
        </span>
        <span className="pill">
          🙌 Фанаты: <b id="rFans">{fmt(props.fans)}</b>
        </span>
        <span className="pill">
          ⚡ Комбо: <b id="rC">0</b>
        </span>
      </div>
    </div>
  );
}
