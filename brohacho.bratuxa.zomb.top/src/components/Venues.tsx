import type { JSX } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import type { Save } from '../game/formulas';
import { fmt, unlocked } from '../game/formulas';
import { VENUES, type Venue } from '../game/content';

/* Площадки 1:1 с legacy renderVenues: те же строки, те же замки. */
export function Venues(props: { save: Save; onShow: (v: Venue) => void }): JSX.Element {
  return (
    <Card className="venue-card">
      <h3>🎤 Площадки</h3>
      <div id="venues">
        {VENUES.map((v) => {
          const u = unlocked(props.save, v);
          return (
            <Card key={v.id} size="sm" className="venue-row">
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
                <Button className="buy" onClick={() => props.onShow(v)} data-icon="inline-start">
                  {u.buy ? 'Открыть и выступить' : 'Выступить'}
                </Button>
              ) : (
                <span className="lock">🔒 {u.why}</span>
              )}
            </Card>
          );
        })}
      </div>
    </Card>
  );
}
