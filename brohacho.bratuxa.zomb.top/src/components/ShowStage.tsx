import { useEffect, useRef, useState, type JSX } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ShowEngine, type HaterView, type NoteView, type ShowSummary } from '../game/show';
import { fmt, stZone, type Save } from '../game/formulas';
import type { Venue } from '../game/content';
import { blip } from '../game/audio';

type Note = { id: number; raid: boolean; popped: boolean };
type Hater = { id: number; left: string };

function setText(id: string, t: string): void {
  const el = document.getElementById(id);
  if (el) el.textContent = t;
}

/* Сцена шоу: портал ритма + rAF-цикл. Движок тот же, DOM — через Layer. */
export function ShowStage(props: {
  venue: Venue;
  save: Save;
  onEnd: (sum: ShowSummary) => void;
}): JSX.Element {
  const [notes, setNotes] = useState<Note[]>([]);
  const [haters, setHaters] = useState<Hater[]>([]);
  const [msg, setMsg] = useState('');
  const [raidOn, setRaidOn] = useState(false);
  const engine = useRef<ShowEngine | null>(null);
  const noteEls = useRef(new Map<number, HTMLDivElement>());
  const kickers = useRef(new Map<number, () => void>());
  const seq = useRef(0);
  const onEnd = useRef(props.onEnd);
  onEnd.current = props.onEnd;

  useEffect(() => {
    const v = props.venue;
    // Снапшот статов на старт шоу — как заход на площадку в legacy.
    const snap: Save = JSON.parse(JSON.stringify(props.save)) as Save;
    const zw = stZone(v, snap);
    const zc = 6 + zw / 2;
    const alive = { cur: true };

    const layer = {
      spawnNote(raid: boolean): NoteView {
        const id = ++seq.current;
        if (alive.cur) setNotes((ns) => [...ns, { id, raid, popped: false }]);
        return {
          setX(x: number): void {
            noteEls.current.get(id)?.style.setProperty('left', `${x}%`);
          },
          pop(): void {
            if (alive.cur) {
              setNotes((ns) => ns.map((n) => (n.id === id ? { ...n, popped: true } : n)));
              window.setTimeout(() => {
                if (alive.cur) setNotes((ns) => ns.filter((n) => n.id !== id));
              }, 180);
            }
          },
          remove(): void {
            noteEls.current.delete(id);
            if (alive.cur) setNotes((ns) => ns.filter((n) => n.id !== id));
          },
        };
      },
      spawnHater(onKick: () => void): HaterView {
        const id = ++seq.current;
        const off = (Math.random() - 0.5) * zw * 1.2;
        kickers.current.set(id, onKick);
        if (alive.cur) setHaters((hs) => [...hs, { id, left: `calc(${zc + off}% - 17px)` }]);
        return {
          remove(): void {
            kickers.current.delete(id);
            if (alive.cur) setHaters((hs) => hs.filter((h) => h.id !== id));
          },
        };
      },
    };

    const sh = new ShowEngine(
      v,
      snap,
      layer,
      {
        say: (t: string) => {
          if (alive.cur) setMsg(t);
        },
        blip,
        ended: (sum: ShowSummary) => {
          setText('rC', '0');
          onEnd.current(sum);
        },
        raid: (on: boolean) => {
          if (alive.cur) setRaidOn(on);
        },
      },
    );
    engine.current = sh;
    setMsg('ноты летят справа — бей в зоне слева!');

    let raf = 0;
    let last = Date.now();
    const frame = (): void => {
      raf = requestAnimationFrame(frame);
      const now = Date.now();
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (sh.over) return;
      sh.step(dt);
      if (sh.over) return;
      setText('timer', `${Math.ceil(sh.t)}с · +${fmt(sh.hype)} 🔥`);
      setText('tempo', `темп ×${sh.tempo().toFixed(2)} · нот ${sh.notes.length} · зона слева`);
      setText('rC', String(sh.combo));
      if (sh.raid) setText('raidN', `${sh.raid.got}/${sh.raid.need} держи темп!`);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      alive.cur = false;
      cancelAnimationFrame(raf);
      engine.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.venue.id]);

  const zw = stZone(props.venue, props.save);

  return (
    <Card className="show-card" id="showCard">
      <h3 id="showName">
        {props.venue.em} {props.venue.n}
      </h3>
      <div id="timer">30</div>
      <div
        id="rbar"
        role="button"
        tabIndex={0}
        aria-label="Ритм-полоса: жми чтобы ударить"
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest('.hater')) return;
          engine.current?.zavoz();
        }}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            engine.current?.zavoz();
          }
        }}
      >
        <div
          id="rzone"
          style={{ left: `${6}vw` }}
          ref={(el) => {
            if (el) {
              const zc = 6 + zw / 2;
              el.style.left = `${zc - zw / 2}%`;
              el.style.width = `${zw}%`;
            }
          }}
        />
        <div id="rcur" style={{ display: 'none' }} />
        {notes.map((n) => (
          <div
            key={n.id}
            ref={(el) => {
              if (el) noteEls.current.set(n.id, el);
              else noteEls.current.delete(n.id);
            }}
            className={n.raid ? 'note raidnote' + (n.popped ? ' hit' : '') : 'note' + (n.popped ? ' hit' : '')}
            style={{ left: '105%' }}
          >
            {n.raid ? '👹' : '🍾'}
          </div>
        ))}
        {haters.map((h) => (
          <div
            key={h.id}
            className="hater"
            style={{ left: h.left }}
            role="button"
            tabIndex={0}
            aria-label="Хейтер — сбить"
            onPointerDown={(e) => {
              e.stopPropagation();
              kickers.current.get(h.id)?.();
            }}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                kickers.current.get(h.id)?.();
              }
            }}
          >
            😡
          </div>
        ))}
        <div id="raid" style={{ display: raidOn ? 'flex' : 'none' }}>
          👹 РЕЙД-БОСС!
          <br />
          <span id="raidN"></span>
        </div>
      </div>
      <div id="tempo"></div>
      <Button className="big" id="btnZavoz" onClick={() => engine.current?.zavoz()} data-icon="inline-start">
        ЗАВОЗ! 🍾
      </Button>
      <Button
        className="buy raid-btn"
        id="btnRaid"
        onClick={() => engine.current?.callRaid()}
        data-icon="inline-start"
      >
        👹 Вызвать рейд-босса
      </Button>
      <div id="msg">{msg}</div>
    </Card>
  );
}
