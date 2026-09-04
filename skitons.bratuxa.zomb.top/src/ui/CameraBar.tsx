import type { ViewName } from '../three/CafeScene';

interface Props { value: ViewName; onChange: (c: ViewName) => void }

const CAMS: { id: ViewName; name: string; icon: JSX.Element }[] = [
  { id: 'outside', name: 'Снаружи', icon: <path d="M2 13V7l6-4.5L14 7v6z M6 13v-3.4h4V13" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /> },
  { id: 'hall', name: 'Зал', icon: <g fill="none" strokeWidth="1.6" strokeLinecap="round"><circle cx="5" cy="5.4" r="2.2" /><circle cx="11" cy="5.4" r="2.2" /><path d="M1.8 13c.5-2.2 1.8-3.4 3.2-3.4s2.7 1.2 3.2 3.4M7.8 13c.5-2.2 1.8-3.4 3.2-3.4s2.7 1.2 3.2 3.4" /></g> },
  { id: 'kitchen', name: 'Кухня', icon: <g fill="none" strokeWidth="1.6" strokeLinecap="round"><path d="M5 2.5h6l-.7 5h-4.6z M4 10.2h8v3.3H4z M8 7.5v2.7" /></g> },
];

export default function CameraBar({ value, onChange }: Props) {
  return (
    <nav className="cambar" aria-label="Камеры">
      {CAMS.map((c) => (
        <button
          key={c.id}
          className={`pill-btn${value === c.id ? ' active' : ''}`}
          aria-pressed={value === c.id}
          onClick={() => onChange(c.id)}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" stroke="#8a6a5a">{c.icon}</svg>
          {c.name}
        </button>
      ))}
    </nav>
  );
}
