// Кнопки хилок: ручка винлайна, пикули, святые, демонические, шприц, очищение.
import {
  BET_MIN_STAKE, BET_STAKE_RATE, bet, cleanseDemon, demonPickle,
  heal1cost, heal1val, heal2cost, holyPickle, pickleSmall, syringe,
} from '../../game/zapoi/index';
import type { ZapoiState } from '../../game/zapoi/index';
import type { MutateFn } from '../../hooks/useZapoiState';
import ImgButton from '../ui/ImgButton';

interface HealButtonsProps {
  z: ZapoiState;
  mutate: MutateFn;
}

export default function HealButtons({ z, mutate }: HealButtonsProps) {
  return (
    <>
      {z.char === 'winline' && (
        <ImgButton
          img="heals/lever.jpg"
          disabled={z.m < Math.max(BET_MIN_STAKE, Math.floor(z.m * BET_STAKE_RATE))}
          onClick={() => mutate((n) => {
            const r = bet(n);
            if (!r) return '';
            return r.win ? `🎰 Ставка зашла! +${r.stake} бухла чистыми!` : `🎰 Ставка сгорела… −${r.stake} бухла. Рискуй ещё!`;
          }, 650)}
          style={{ fontSize: 15 }}
        >
          РУЧКА: 10% бухла, 45% — возврат ×2</ImgButton>
      )}{' '}
      {(z.char === 'vladimir' || z.char === 'winline') && (
        <ImgButton
          img="heals/pickle.jpg"
          disabled={z.m < heal1cost(z)}
          onClick={() => mutate((n) => {
            const r = pickleSmall(n);
            return r ? `🥒 Пикули: +${r.v} HP за ${r.c} бухла` : '';
          }, 500)}
          style={{ fontSize: 15 }}
        >
          ПИКУЛИ: +{heal1val(z)} HP за {heal1cost(z)} бухла</ImgButton>
      )}{' '}
      {z.char === 'demon' && (
        <ImgButton
          img="heals/dpickle.jpg"
          disabled={z.m < heal1cost(z)}
          onClick={() => mutate((n) => {
            const r = demonPickle(n);
            if (!r) return '';
            return `🔥 Демонические пикули: +${r.v} HP за ${r.c} бухла${r.extended ? ', форма +10 сек!' : ''}`;
          }, 500)}
          style={{ fontSize: 15 }}
        >
          ДЕМОНИЧЕСКИЕ ПИКУЛИ: +{heal1val(z)} HP за {heal1cost(z)} бухла</ImgButton>
      )}{' '}
      {z.char === 'ghost' && (
        <ImgButton
          img="heals/hpickle.jpg"
          disabled={z.m < heal1cost(z)}
          onClick={() => mutate((n) => {
            const r = holyPickle(n);
            if (!r) return '';
            return `✨ Святые пикули: +${r.v} души за ${r.c} бухла${r.deal ? ', скидка −0.2% навсегда!' : ''}`;
          }, 500)}
          style={{ fontSize: 15 }}
        >
          СВЯТЫЕ ПИКУЛИ: +{heal1val(z)} души за {heal1cost(z)} бухла</ImgButton>
      )}{' '}
      {(z.char === 'vladimir' || z.char === 'winline') && (
        <ImgButton
          img="heals/syringe.jpg"
          disabled={z.m < heal2cost(z)}
          onClick={() => mutate((n) => {
            const r = syringe(n);
            return r ? `💉 Шприц: полное HP за ${r.c} бухла` : '';
          }, 700)}
          style={{ fontSize: 15 }}
        >
          ШПРИЦ: полное HP за {heal2cost(z)} бухла</ImgButton>
      )}{' '}
      {z.char === 'demon' && (
        <ImgButton
          img="heals/cleanse.jpg"
          disabled={z.m < heal2cost(z)}
          onClick={() => mutate((n) => {
            const r = cleanseDemon(n);
            if (!r) return '';
            return r.cleansed ? `😇 Очищение! Форма снята за ${r.c} бухла, HP 30%. Живи!` : `💉 Капельница: +${r.v} HP за ${r.c} бухла`;
          }, 700)}
          style={{ fontSize: 15 }}
        >
          ОЧИЩЕНИЕ: снять форму за {heal2cost(z)} бухла</ImgButton>
      )}
    </>
  );
}
