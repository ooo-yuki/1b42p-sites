import type { JSX } from 'react';
import { fmt, lvlCost, unlocked, type Save } from './formulas';
import { VENUES, type ShopItem, type Venue } from './content';

/* Липкая мачта-афиша + пилюли ресурсов. id те же, что в legacy. */
export function Masthead(props: { h: number; f: number; fans: number }): JSX.Element {
  return (
    <div id="top">
      <h1>
        <span className="k">42 БРАТУХА</span>ФАБРИКА ХАЙПА 🏆
      </h1>
      <div className="sub">
        продюсер Пятёрки · дорога на SLAY 2026 ·{' '}
        <a href="minigames.html">← Мини-игры</a> · <a href="https://hub.bratuxa.zomb.top">Хаб 1Б42П</a>
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

/* Магазин 1:1 с legacy shopList: уровни, цены ×3, MAX. */
export function Shop(props: {
  id: string;
  items: Record<string, ShopItem>;
  lvls: Record<string, number>;
  isF: boolean;
  onBuy: (key: string) => void;
}): JSX.Element {
  return (
    <div className="shop" id={props.id}>
      {Object.entries(props.items).map(([key, o]) => {
        const lv = props.lvls[key] ?? 0;
        const max = 3;
        const cost = lvlCost(o.base, lv);
        return (
          <div key={key} data-slot="card" data-size="sm">
            <b>
              {o.em} {o.n}
            </b>{' '}
            <span data-slot="badge" className="lvl">
              {lv}/{max}
            </span>
            <br />
            <span className="hint">{o.d}</span>
            <br />
            {lv >= max ? (
              <b style={{ color: 'gold' }}>MAX 🏆</b>
            ) : (
              <button className="buy" onClick={() => props.onBuy(key)}>
                Улучшить: {fmt(cost)}
                {props.isF ? ' 🎟️' : ' 🔥'}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* Площадки 1:1 с legacy renderVenues: те же строки, те же замки. */
export function Venues(props: { save: Save; onShow: (v: Venue) => void }): JSX.Element {
  return (
    <div data-slot="card" className="venue-card">
      <h3>🎤 Площадки</h3>
      <div id="venues">
        {VENUES.map((v) => {
          const u = unlocked(props.save, v);
          return (
            <div key={v.id} data-slot="card" data-size="sm" className="venue-row">
              <b>
                {v.em} {v.n}
              </b>
              <br />
              <span className="hint">
                Темп {v.speed} · зона {v.zone}% · нота каждые ~{v.gap}с · база {v.base} 🔥
                {v.cost ? ` · вход ${fmt(v.cost)} 🔥` : ''}
              </span>
              <br />
              {u.ok ? (
                <button className="buy" onClick={() => props.onShow(v)}>
                  {u.buy ? 'Открыть и выступить' : 'Выступить'}
                </button>
              ) : (
                <span className="lock">🔒 {u.why}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
