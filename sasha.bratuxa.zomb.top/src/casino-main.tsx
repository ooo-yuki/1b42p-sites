import { createRoot } from 'react-dom/client';
import Casino from './Casino';

document.body.classList.add('casino');
const el = document.getElementById('root');
if (el) createRoot(el).render(<Casino />);
