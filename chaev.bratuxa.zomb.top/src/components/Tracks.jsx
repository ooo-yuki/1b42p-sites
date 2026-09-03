const TRACKS = [
  '🎧 42 — 5opka, 6055',
  '🎧 ELA DANCA — 5opka, Sayfalse и ещё 1 исполнитель',
  '🎧 ТУСА ПЕЗДУЗА — 5opka, Mellsher',
];

export default function Tracks() {
  return (
    <div className="card">
      <h2>🎵 ЛЮБИМЫЕ ТРЕКИ ЧАЕВА 🎵</h2>
      {TRACKS.map((t) => <p key={t}>{t}</p>)}
    </div>
  );
}
