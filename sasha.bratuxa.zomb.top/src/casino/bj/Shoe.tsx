import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import './shoe.css';

/* Шуза без дна: каждая карта равновероятна, верхняя съезжает при сдаче. */

export default function Shoe({ dealToken, idle }: { dealToken: number; idle: boolean }): JSX.Element {
  const [slide, setSlide] = useState(0);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (dealToken <= 0) return;
    setSlide(s => s + 1);
  }, [dealToken]);

  return (
    <div className="shoe" aria-label="Шуза">
      <div className="shoe-stack" aria-hidden="true">
        <i /><i /><i /><i />
        <span key={slide} className={cn('shoe-top', !idle && 'deal')} />
      </div>
      <small>шуза без дна — каждая карта равновероятна</small>
    </div>
  );
}
