// Task 2: учёба с тёткой. Каждый шаг гаснет своим делом.
// Держим стираемый синтаксис (без аннотаций), чтобы tests/teach.test.js
// запускал файл без сборки.
export const TEACH = [
  'Иди: стрелки влево и вправо',
  'Возьми ключ',
  'Возьми рыбу',
  'Иди к выходу',
  'Толкни стражу: клавиша X',
];

/** @param {any} S @returns {string | null} */
export function teachStep(S) {
  if (!S) return TEACH[0];
  if (!S.moved) return TEACH[0];
  if (!S.key) return TEACH[1];
  if (!S.fish) return TEACH[2];
  if (!S.exit) return TEACH[3];
  if (S.shoved === false) return TEACH[4];
  return null;
}
