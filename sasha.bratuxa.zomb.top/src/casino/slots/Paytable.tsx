import { ItemIcon } from '../../casino-icons';
import { Num } from '../shared';
import { PAY_JACKPOT, PAY_PAIR, PAY_TRIPS, honestOdds } from './data';
import './pay.css';

/* Таблица автомата: выплаты с иконками и честными шансами из 216. */

export default function Paytable(): JSX.Element {
  const odds = honestOdds();
  return (
    <div className="pay-zone">
      <dl className="paytable">
        <div>
          <dt><span className="pt-syms"><ItemIcon name="seven" /><ItemIcon name="seven" /><ItemIcon name="seven" /></span></dt>
          <dd>+<Num>{PAY_JACKPOT}</Num></dd>
        </div>
        <div><dt>Три одинаковых</dt><dd>+<Num>{PAY_TRIPS}</Num></dd></div>
        <div><dt>Любая пара</dt><dd>+<Num>{PAY_PAIR}</Num></dd></div>
      </dl>
      <ul className="odds" aria-label="Честные шансы">
        {odds.map(o => (
          <li key={o.label}><span>{o.label}</span><b className="tnum">{o.chance}</b></li>
        ))}
      </ul>
      <p className="fine">Три барабана по 6 граней — 216 исходов, каждый равновероятен.</p>
    </div>
  );
}
