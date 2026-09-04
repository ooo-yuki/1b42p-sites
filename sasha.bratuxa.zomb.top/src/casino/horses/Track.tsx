import { ItemIcon } from '../../casino-icons';
import { cn } from '@/lib/utils';
import { FINISH, type Horse } from './data';
import './track.css';

/* Газон: четыре дорожки, топот с пылью, бейдж лидера, фотофиниш. */

type Props = {
  horses: Horse[];
  pos: number[];
  leader: number;
  racing: boolean;
  winner: number;
};

export default function Track({ horses, pos, leader, racing, winner }: Props): JSX.Element {
  return (
    <div className={cn('turf', racing && 'racing')} aria-label="Скаковой круг">
      <div className="stand">Трибуна 42</div>
      {horses.map((h, i) => {
        const m = Math.min(FINISH, Math.floor(pos[i] ?? 0));
        const lead = racing && leader === i;
        return (
          <div className="lane" key={h.id}>
            <span className="lane-no">{i + 1}</span>
            <div className="lane-track">
              {[25, 50, 75].map(mark => <i key={mark} className="mark" style={{ left: `${mark}%` }} />)}
              <span className={cn('runner', lead && 'lead')} style={{ left: `calc(${Math.min(94, pos[i] ?? 0)}%)` }}>
                <span className="dust" aria-hidden="true"><i /><i /><i /></span>
                <ItemIcon name={h.icon} />
              </span>
              <span className="post" aria-hidden="true" />
            </div>
            <span className="lane-name">{h.name}<small className="tnum">{m} м</small></span>
          </div>
        );
      })}
      {winner >= 0 && horses[winner] && (
        <div className="photo" role="status">
          <span className="photo-flash" aria-hidden="true" />
          <b>{horses[winner].name} — первый!</b>
          <small>фотофиниш подтверждает</small>
        </div>
      )}
    </div>
  );
}
