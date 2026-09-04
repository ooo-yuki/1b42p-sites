import type { JSX } from 'react';

/* Общий контракт зала: баланс, ставки, лог. Вся правда о фишках — здесь. */

export type Tone = '' | 'win' | 'lose';

export type Api = {
  balance: number;
  msg: string;
  tone: Tone;
  reduced: boolean;
  spend: (stake: number) => boolean;
  credit: (n: number) => void;
  say: (t: string, tn?: Tone) => void;
};

/** Проверяет и списывает ставку. null — ставка не принята (причина уже в логе). */
export function parseStake(raw: string, min: number, api: Api): number | null {
  const stake = Math.floor(Number(raw));
  if (!isFinite(stake) || stake < min) { api.say(`Ставка от ${min} фишек`); return null; }
  if (!api.spend(stake)) return null;
  return stake;
}

/** Строка состояния зала: единый голос всех игр. */
export function Log({ msg, tone }: { msg: string; tone: Tone }): JSX.Element {
  return <div className={tone ? `clog ${tone}` : 'clog'} role="status">{msg}</div>;
}

/** Табличные цифры одним классом. */
export function Num({ children }: { children: React.ReactNode }): JSX.Element {
  return <span className="tnum">{children}</span>;
}
