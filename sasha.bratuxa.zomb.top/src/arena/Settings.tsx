import { Num } from '../casino/shared';
import { setArenaMuted } from './sound';
import { saveMuted } from './proto';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/* Настройки клуба — правая колонка: имя, звук, летопись. */

type Props = {
  name: string;
  wins: number;
  online: number | null;
  muted: boolean;
  onName: (n: string) => void;
  onMute: (m: boolean) => void;
  onClearWins: () => void;
};

export default function Settings({ name, wins, online, muted, onName, onMute, onClearWins }: Props): JSX.Element {
  const flip = (): void => {
    const m = !muted;
    onMute(m);
    setArenaMuted(m);
    saveMuted(m);
  };
  return (
    <aside className="aset" aria-label="Настройки клуба">
      <h2>Настройки</h2>
      <label className="aname">
        <span>Имя бойца</span>
        <Input value={name} maxLength={24} placeholder="Братуха"
          onChange={e => onName(e.target.value)} aria-label="Имя бойца" />
      </label>
      <div className="aset-row">
        <span>Звук клуба</span>
        <button type="button" role="switch" aria-checked={!muted}
          className={`switch${muted ? '' : ' on'}`} onClick={flip}>
          <i />
        </button>
      </div>
      <div className="aset-row">
        <span>Побед в летописи</span>
        <b className="tnum"><Num>{wins}</Num></b>
      </div>
      <div className="aset-row">
        <span>В клубе сейчас</span>
        <b className="tnum">{online === null ? '…' : online}</b>
      </div>
      {wins > 0 && (
        <Button variant="outline" size="sm" onClick={onClearWins}>Стереть летопись</Button>
      )}
      <p className="aset-note">Звук и имя живут в твоём браузере. Никуда не уезжают.</p>
    </aside>
  );
}
