import { useEffect, useState } from 'react';
import { KeyRound, LogOut, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loadToken, saveToken } from './auth';
import { isTgLocked, tgAutoLogin, tgReady } from './tg';
import './accountbar.css';

/* Единый счёт Саши: вход, профиль, выход. Один на все игры.
   В тг-аппе счёт закреплён: входит сам, формы и выхода нет. */

type Me = { nick: string } | null;

async function call<T>(path: string, token: string | null, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method: body === undefined ? 'GET' : 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  return res.json() as Promise<T>;
}

export default function AccountBar(): JSX.Element {
  const [me, setMe] = useState<Me>(null);
  const [nick, setNick] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  /* Закреп тг-счёта: скрипт телеграма подгружается позже, поэтому ждём tgReady. */
  const [tg, setTg] = useState(false);
  const [tgBusy, setTgBusy] = useState(false);

  useEffect(() => {
    const enterTg = (): void => {
      if (loadToken()) return; // тихий вход уже идёт
      setTgBusy(true);
      void tgAutoLogin().then(r => {
        setTgBusy(false);
        if (r.ok) {
          saveToken(r.token);
          setMe({ nick: r.nick });
        } else {
          setErr(r.error);
        }
      });
    };
    const t = loadToken();
    if (t) {
      call<{ ok: boolean; nick?: string }>('/api/bank/me', t)
        .then(r => {
          if (r.ok && r.nick) setMe({ nick: r.nick });
          else {
            saveToken(null);
            if (isTgLocked()) { setTg(true); enterTg(); }
          }
        })
        .catch(() => { /* касса спит — молча гостем */ });
    }
    tgReady(() => {
      if (!isTgLocked()) return;
      setTg(true);
      enterTg();
    });
  }, []);

  const go = async (path: '/api/bank/login' | '/api/bank/register'): Promise<void> => {
    if (busy) return;
    setBusy(true);
    setErr('');
    try {
      const r = await call<{ ok: boolean; token?: string; nick?: string; error?: string }>(path, null, { nick, pass });
      if (r.ok && r.token && r.nick) {
        saveToken(r.token);
        setMe({ nick: r.nick });
        setPass('');
      } else {
        setErr(typeof r.error === 'string' ? r.error : 'Касса не отвечает');
      }
    } catch {
      setErr('Касса не отвечает — проверь связь');
    }
    setBusy(false);
  };

  const logout = (): void => {
    saveToken(null);
    setMe(null);
    setNick('');
    setPass('');
    setErr('');
  };

  if (me) {
    if (tg) {
      /* Закреп: только ник, выйти и сменить нельзя. */
      return (
        <div className="accbar" role="status" aria-label={`Счёт телеграма: ${me.nick}`}>
          <span className="acc-nick" title="Счёт привязан к телеграму — он всегда с тобой">{me.nick}</span>
        </div>
      );
    }
    return (
      <div className="accbar" role="status" aria-label={`Вошёл как ${me.nick}`}>
        <span className="acc-nick" title="Твой счёт — один на все игры">{me.nick}</span>
        <Button variant="ghost" size="sm" onClick={logout} aria-label="Выйти из счёта">
          <LogOut data-icon="inline-start" /> Выйти
        </Button>
      </div>
    );
  }

  if (tg) {
    /* Закреп без счёта: ждём кассу, формы нет — менять нечего. */
    return (
      <div className="accbar" role="status" aria-label="Счёт телеграма привязывается">
        <span className="acc-nick">{tgBusy ? 'Счёт телеграма…' : 'Счёт телеграма'}</span>
        {err && <p className="acc-err" role="alert">{err}</p>}
      </div>
    );
  }

  return (
    <div className="accbar" aria-label="Вход в счёт">
      <Input value={nick} maxLength={16} autoComplete="username"
        aria-label="Ник бойца" placeholder="Ник бойца"
        onChange={e => setNick(e.target.value)} className="acc-input" />
      <Input value={pass} type="password" maxLength={72} autoComplete="current-password"
        aria-label="Пароль" placeholder="Пароль"
        onKeyDown={e => { if (e.key === 'Enter') void go('/api/bank/login'); }}
        onChange={e => setPass(e.target.value)} className="acc-input" />
      <Button size="sm" onClick={() => void go('/api/bank/login')} disabled={busy}>
        <KeyRound data-icon="inline-start" /> Войти
      </Button>
      <Button size="sm" variant="secondary" onClick={() => void go('/api/bank/register')} disabled={busy}>
        <UserPlus data-icon="inline-start" /> Новый счёт
      </Button>
      {err && <p className="acc-err" role="alert">{err}</p>}
    </div>
  );
}
