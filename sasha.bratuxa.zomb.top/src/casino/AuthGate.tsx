import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { KeyRound, UserPlus } from 'lucide-react';
import { login, register, type BankUser } from './bank';

/* Ворота кассы: ник + пароль. Вход — в свой счёт, регистрация — новый счёт
   со стартовой тысячей. Гости играют без счёта, в таблицу не попадают. */

export default function AuthGate({ onAuth, onGuest }: {
  onAuth: (u: BankUser, token: string) => void; onGuest: () => void;
}): JSX.Element {
  const [nick, setNick] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const go = async (fn: (n: string, p: string) => Promise<{ ok: boolean; token?: string; nick?: string; balance?: number; error?: string }>): Promise<void> => {
    if (busy) return;
    setBusy(true);
    setErr('');
    try {
      const r = await fn(nick, pass);
      if (r.ok && r.token && r.nick && typeof r.balance === 'number') {
        onAuth({ nick: r.nick, balance: r.balance }, r.token);
      } else {
        setErr('error' in r && typeof r.error === 'string' ? r.error : 'Касса не отвечает');
      }
    } catch {
      setErr('Касса не отвечает — проверь связь');
    }
    setBusy(false);
  };

  return (
    <Card className="bank-gate">
      <CardHeader>
        <CardTitle>Касса батальона</CardTitle>
        <CardDescription>Счёт живёт на сервере и попадает в таблицу лидеров.
          Без счёта — игра гостем, в таблицу не попадёшь.</CardDescription>
      </CardHeader>
      <CardContent className="bank-form">
        <Input value={nick} maxLength={16} autoComplete="username"
          aria-label="Ник бойца" placeholder="Ник бойца"
          onChange={e => setNick(e.target.value)} />
        <Input value={pass} type="password" maxLength={72} autoComplete="current-password"
          aria-label="Пароль" placeholder="Пароль"
          onKeyDown={e => { if (e.key === 'Enter') void go(login); }}
          onChange={e => setPass(e.target.value)} />
        {err && <p className="bank-err" role="alert">{err}</p>}
        <div className="bank-row">
          <Button onClick={() => void go(login)} disabled={busy}>
            <KeyRound data-icon="inline-start" /> Войти
          </Button>
          <Button variant="secondary" onClick={() => void go(register)} disabled={busy}>
            <UserPlus data-icon="inline-start" /> Новый счёт
          </Button>
          <Button variant="outline" onClick={onGuest}>Гостем</Button>
        </div>
      </CardContent>
    </Card>
  );
}
