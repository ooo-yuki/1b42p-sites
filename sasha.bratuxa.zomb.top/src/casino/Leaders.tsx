import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { leaders, type Leader } from './bank';
import { Num } from './shared';
import { cn } from '@/lib/utils';

/* Таблица лидеров: топ батальона по балансу. Свой ник подсвечен. */

const MEDAL = ['42', 'II', 'III'];

export default function Leaders({ me }: { me: string | null }): JSX.Element {
  const [rows, setRows] = useState<Leader[]>([]);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    let live = true;
    leaders()
      .then(r => {
        if (!live) return;
        if (r.ok) setRows(r.leaders.slice(0, 10));
        else setEmpty(true);
      })
      .catch(() => { if (live) setEmpty(true); });
    return () => { live = false; };
  }, []);

  return (
    <Card className="bank-leaders">
      <CardHeader>
        <CardTitle className="lead-title"><Trophy data-icon="inline-start" /> Таблица лидеров</CardTitle>
      </CardHeader>
      <CardContent>
        {empty && <p className="hist-empty">Касса молчит — таблица позже.</p>}
        {!empty && rows.length === 0 && <p className="hist-empty">Пока тихо — стань первым.</p>}
        {rows.length > 0 && (
          <ol className="lead-list">
            {rows.map((r, i) => (
              <li key={r.nick} className={cn(i === 0 && 'champ', r.nick === me && 'mine')}>
                <span className="lead-pos">{MEDAL[i] ?? `${i + 1}`}</span>
                <span className="lead-nick">{r.nick}</span>
                <span className="lead-bal"><Num>{r.balance}</Num></span>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
