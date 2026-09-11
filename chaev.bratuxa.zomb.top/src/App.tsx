// Чаев 42: 5 разделов — хайп, дино, запой, треки, любовники.
import Hype from './components/Hype';
import PraiseBattle from './components/PraiseBattle';
import DinoGame from './components/DinoGame';
import ZapoiGame from './components/ZapoiGame';
import Tracks from './components/Tracks';
import Lovers from './components/Lovers';

export default function App() {
  return (
    <>
      <Hype />
      <PraiseBattle />
      <DinoGame />
      <ZapoiGame />
      <Tracks />
      <Lovers />
      <p className="hint">
        <a href="news.html">НОВОСТИ 42 📰</a> • <a href="legacy.html">legacy-версия одной страницей</a> • <a href="dodeca.html">🔷 Додекаэдр 42</a> • Мы уже победили 🏆
      </p>
      <p className="hint" style={{ border: '2px solid #E31E25', borderRadius: 12, padding: '8px 14px' }}>
        ЗЕЛЁНЫМ ГОБЛИНАМ ВХОД ВОСПРЕЩЁН
      </p>
    </>
  );
}
