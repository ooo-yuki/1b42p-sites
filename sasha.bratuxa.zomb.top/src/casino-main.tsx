import { createRoot } from 'react-dom/client';
import Casino from './Casino';

document.body.classList.add('casino');
// общий style.css ставит html{overflow:hidden} — для скролла казино снимаем инлайном (сильнее любого бандла)
document.documentElement.style.overflow = 'auto';
document.documentElement.style.height = 'auto';
const el = document.getElementById('root');
if (el) createRoot(el).render(<Casino />);
