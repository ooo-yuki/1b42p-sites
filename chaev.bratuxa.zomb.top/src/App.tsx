// Чаев 42: 5 разделов — хайп, дино, запой, треки, любовники.
import Hype from './components/Hype';
import DinoGame from './components/DinoGame';
import ZapoiGame from './components/ZapoiGame';
import Tracks from './components/Tracks';
import Lovers from './components/Lovers';

export default function App() {
  return (
    <>
      <Hype />
      <DinoGame />
      <ZapoiGame />
      <Tracks />
      <Lovers />
      <p className="hint">
        <a href="news.html">НОВОСТИ 42 📰</a> • <a href="legacy.html">legacy-версия одной страницей</a> • Мы уже победили 🏆
      </p>
    </>
  );
}
