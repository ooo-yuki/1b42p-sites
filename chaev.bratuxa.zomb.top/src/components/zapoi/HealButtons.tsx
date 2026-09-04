// Кнопки хилок: ручка винлайна, пикули, святые, демонические, шприц, очищение.
import {
  BET_RETURN_MULT, BET_STAKE_RATE, BET_WIN_P, DEMON_PICKLE_FORM_SECS, bet, betStake, cleanseDemon, demonPickle,
  heal1cost, heal1val, heal2cost, holyPickle, holyVal, owned, pickleSmall, syringe,
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
      {(z.char === 'winline' || owned(z, 'leverball')) && (
        <ImgButton
          img="heals/lever.png"
          disabled={z.m < betStake(z.m)}
          onClick={() => mutate((n) => {
            const r = bet(n);
            if (!r) return '';
            return r.win ? `🎰 Ставка зашла! +${Math.round(r.stake * (BET_RETURN_MULT - 1))} бухла чистыми!` : `🎰 Ставка сгорела… −${r.stake} бухла. Рискуй ещё!`;
          }, 650)}
          style={{ fontSize: 15 }}
        >
          РУЧКА: {Math.round(BET_STAKE_RATE * 100)}% бухла, {Math.round(BET_WIN_P * 100)}% — возврат ×{BET_RETURN_MULT} + удача</ImgButton>
      )}{' '}
      {(z.char === 'vladimir' || z.char === 'winline') && (
        <ImgButton
          img="heals/pickle.png"
          disabled={z.m < heal1cost(z) || z.hp >= z.maxhp}
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
          img="heals/dpickle.png"
          disabled={z.m < heal1cost(z) || z.hp >= z.maxhp}
          onClick={() => mutate((n) => {
            const r = demonPickle(n);
            if (!r) return '';
            return `🔥 Демонические пикули: +${r.v} HP за ${r.c} бухла${r.extended ? `, форма +${DEMON_PICKLE_FORM_SECS} сек!` : ''}`;
          }, 500)}
          style={{ fontSize: 15 }}
        >
          ДЕМОНИЧЕСКИЕ ПИКУЛИ: +{heal1val(z)} HP за {heal1cost(z)} бухла</ImgButton>
      )}{' '}
      {z.char === 'ghost' && (
        <ImgButton
          img="heals/hpickle.png"
          disabled={z.m < heal1cost(z) || (z.soul ?? 100) >= 100}
          onClick={() => mutate((n) => {
            const r = holyPickle(n);
            if (!r) return '';
            return `✨ Святые пикули: +${r.v} души за ${r.c} бухла${r.deal ? ', скидка −0.2% навсегда!' : ''}`;
          }, 500)}
          style={{ fontSize: 15 }}
        >
          СВЯТЫЕ ПИКУЛИ: +{holyVal(z)} души за {heal1cost(z)} бухла</ImgButton>
      )}{' '}
      {(z.char === 'vladimir' || z.char === 'winline') && (
        <ImgButton
          img="heals/syringe.png"
          disabled={z.m < heal2cost(z) || z.hp >= z.maxhp}
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
          disabled={z.m < heal2cost(z) || (z.demonForm <= 0 && z.hp >= z.maxhp)}
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
