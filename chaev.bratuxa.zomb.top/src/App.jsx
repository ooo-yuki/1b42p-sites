import Hype from './components/Hype.jsx';
import DinoGame from './components/DinoGame.jsx';
import ZapoiGame from './components/ZapoiGame.jsx';
import Tracks from './components/Tracks.jsx';
import Lovers from './components/Lovers.jsx';

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
