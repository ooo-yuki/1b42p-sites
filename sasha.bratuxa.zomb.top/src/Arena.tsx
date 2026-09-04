import { useCallback, useEffect, useRef, useState } from 'react';
import Lobby from './arena/Lobby';
import Room, { type ChatLine, type FeedLine } from './arena/Room';
import {
  addWin, arenaWsUrl, loadName, loadWins, saveName,
  type CMsg, type RoomView, type SMsg,
} from './arena/proto';
import { arenaClick, arenaWin, chatPop, diceLand, diceRattle, elimGong } from './arena/sound';

/* АРЕНА — оркестрация клуба: сокет, лобби, комната, летопись побед. */

type Conn = 'idle' | 'connecting' | 'live' | 'dead';

let feedSeq = 1;

export default function Arena(): JSX.Element {
  const [conn, setConn] = useState<Conn>('idle');
  const [online, setOnline] = useState<number | null>(null);
  const [me, setMe] = useState('');
  const [myId, setMyId] = useState('');
  const [name, setName] = useState(() => loadName());
  const [wins, setWins] = useState(() => loadWins());
  const [queued, setQueued] = useState<{ size: number; waiting: number } | null>(null);
  const [room, setRoom] = useState<RoomView | null>(null);
  const [feed, setFeed] = useState<FeedLine[]>([]);
  const [chat, setChat] = useState<ChatLine[]>([]);
  const [myRolled, setMyRolled] = useState(false);
  const [secsLeft, setSecsLeft] = useState<number | null>(null);
  const [err, setErr] = useState('');
  const wsRef = useRef<WebSocket | null>(null);
  const roomRef = useRef<RoomView | null>(null);
  roomRef.current = room;
  const roundTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const pushFeed = useCallback((text: string, hot = false): void => {
    setFeed(f => [...f.slice(-29), { k: feedSeq++, text, hot }]);
  }, []);

  const send = useCallback((m: CMsg): void => {
    try { wsRef.current?.send(JSON.stringify(m)); } catch { /* сокет чихнул */ }
  }, []);

  const stopClock = (): void => {
    if (roundTimer.current) { clearInterval(roundTimer.current); roundTimer.current = null; }
    setSecsLeft(null);
  };

  const startClock = useCallback((secs: number): void => {
    stopClock();
    setSecsLeft(secs);
    roundTimer.current = setInterval(() => {
      setSecsLeft(s => {
        if (s === null || s <= 1) {
          if (roundTimer.current) { clearInterval(roundTimer.current); roundTimer.current = null; }
          return null;
        }
        return s - 1;
      });
    }, 1000);
  }, []);

  const myIdRef = useRef('');
  myIdRef.current = myId;

  const onMsg = useCallback((m: SMsg): void => {
    switch (m.t) {
      case 'welcome':
        setMyId(m.id);
        setOnline(m.online);
        break;
      case 'online':
        setOnline(m.n);
        break;
      case 'queued':
        setQueued({ size: m.size, waiting: m.waiting });
        setErr('');
        break;
      case 'room':
        setQueued(null);
        setRoom({
          code: m.code, phase: m.phase, players: m.players, host: m.host,
          size: m.size, private: m.private, round: m.round, alive: m.alive,
          contenders: m.contenders, rolls: m.rolls, winner: m.winner,
        });
        setErr('');
        break;
      case 'join':
        pushFeed(`${m.name} в комнате.`);
        chatPop();
        break;
      case 'left':
        pushFeed(`${m.name} покинул комнату.`);
        break;
      case 'leftRoom':
        stopClock();
        setRoom(null);
        setChat([]);
        setFeed([]);
        setMyRolled(false);
        break;
      case 'round':
        setMyRolled(false);
        diceRattle();
        startClock(m.secs);
        pushFeed(`Раунд ${m.round}: кости в стаканах!`);
        break;
      case 'roll': {
        const mine = m.id === myIdRef.current;
        if (mine) { setMyRolled(true); diceLand(m.v); }
        else diceLand(m.v);
        if (m.auto) pushFeed(`${m.name} молчал — клуб кинул за него: ${m.v}.`);
        break;
      }
      case 'elim':
        elimGong();
        pushFeed(`Раунд ${m.round}: ${m.name} выбит с ${m.v}.`, true);
        break;
      case 'over': {
        stopClock();
        const iWon = m.winner !== null && m.winner === myIdRef.current;
        if (iWon) {
          arenaWin();
          setWins(addWin());
          pushFeed(`${m.name} — чемпион клуба! Победа в летописи.`, true);
        } else {
          pushFeed(`${m.name} забрал бой. Реванш?`, true);
        }
        break;
      }
      case 'log':
        pushFeed(m.text);
        break;
      case 'chat':
        setChat(c => [...c.slice(-49), { id: m.id, name: m.name, text: m.text }]);
        break;
      case 'err':
        setErr(m.msg);
        arenaClick();
        break;
      case 'pong':
        break;
    }
  }, [pushFeed, startClock]);

  useEffect(() => {
    setConn('connecting');
    let ws: WebSocket | null = null;
    let ping: ReturnType<typeof setInterval> | null = null;
    let dead = false;
    try {
      ws = new WebSocket(arenaWsUrl());
    } catch {
      setConn('dead');
      return;
    }
    wsRef.current = ws;
    ws.onopen = () => {
      if (dead) return;
      setConn('live');
      send({ t: 'hello', name: (loadName() || 'Братуха').slice(0, 24) });
      ping = setInterval(() => send({ t: 'ping' }), 25000);
    };
    ws.onmessage = ev => {
      try { onMsg(JSON.parse(String(ev.data)) as SMsg); } catch { /* битый фрейм */ }
    };
    ws.onclose = () => { if (!dead) setConn('dead'); };
    ws.onerror = () => { if (!dead) setConn('dead'); };
    return () => {
      dead = true;
      if (ping) clearInterval(ping);
      stopClock();
      try { ws?.close(); } catch { /* уже закрыт */ }
      wsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // имя уходит на сервер при смене (следующий hello) и в сейв сразу
  const changeName = (n: string): void => {
    setName(n);
    saveName(n);
    setMe(n);
  };

  useEffect(() => {
    if (conn === 'live' && myId) {
      const n = (name || 'Братуха').slice(0, 24);
      setMe(n);
      send({ t: 'hello', name: n });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conn, myId]);

  return (
    <div className="arena-page">
      <div id="sky" />
      <div id="veil" />
      <main className="arena-main">
        <div className="arena-col">
          <a className="ahome" href="index.html">← Саша ⁴²</a>
          {conn === 'dead' && (
            <p className="aerr" role="alert">
              Клуб недоступен — сервер арены спит. Обнови страницу чуть позже.
              {err ? ` (${err})` : ''}
            </p>
          )}
          {conn === 'connecting' && <p className="aconn">Стучимся в клуб…</p>}
          {!room && conn !== 'dead' && (
            <Lobby online={online} name={name} wins={wins}
              busy={conn !== 'live'}
              queued={queued}
              onName={changeName}
              onQuick={size => send({ t: 'queue', size })}
              onCreate={() => send({ t: 'create' })}
              onJoin={code => send({ t: 'join', code })} />
          )}
          {room && (
            <Room me={myId} room={room} feed={feed} chat={chat}
              myRolled={myRolled} secsLeft={secsLeft}
              onRoll={() => send({ t: 'roll' })}
              onLeave={() => send({ t: 'leave' })}
              onStart={() => send({ t: 'start' })}
              onRematch={() => send({ t: 'rematch' })}
              onChat={t => send({ t: 'chat', text: t })} />
          )}
          {err && room && <p className="aerr" role="alert">{err}</p>}
        </div>
      </main>
    </div>
  );
}
