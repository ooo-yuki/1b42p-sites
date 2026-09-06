// Task 5: тетрадка с делом часа. Дело по недособранному.
// Держим стираемый синтаксис (без аннотаций), чтобы tests/notes.test.js
// запускал файл без сборки.
/** @param {any} S @returns {string} */
export function hourCase(S) {
  if (!S.hasKey) return 'добудь ключ';
  if (!S.hasFish) return 'добудь рыбу';
  return 'уходи в выход';
}
