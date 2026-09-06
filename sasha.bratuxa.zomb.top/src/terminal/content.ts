/* Контент терминала 42: узлы, файлы, логи корпораций. Тон — 42-content:
   дерзко, абсурдно, БРОТОВОД-Х троллим, финал — «Мы уже победили». */

export type NodeFile =
  | { kind: 'log'; text: string[] }
  | { kind: 'enc'; key: string; unlocks?: string; gives?: string; needsInject?: boolean; text: string[] };

export interface Node {
  id: string;
  name: string;
  lockedBy?: string;
  files: Record<string, NodeFile>;
}

export const NODES: Node[] = [
  {
    id: 'gate',
    name: 'Шлюз 42',
    files: {
      'readme.log': {
        kind: 'log',
        text: [
          'ПРИВЕТ, СВЯЗИСТ. ЭТО ШЛЮЗ БАТАЛЬОНА 1Б42П.',
          'БРОТОВОД-Х глушит наши самокаты уже неделю. Твоя задача —',
          'вскрыть их узлы и найти план «ТИШИНА».',
          'КОМАНДЫ: scan | connect <узел> | ls | read <файл> |',
          'decrypt <файл> <ключ> | inject <узел> | whoami | clear',
          'Начни со scan. В pass.txt — первый ключ. Никому ни слова.',
        ],
      },
      'pass.txt': {
        kind: 'log',
        text: ['КЛЮЧ ФРАГМЕНТ 1/3: SLAY', 'Запомни. Съешь после прочтения.'],
      },
    },
  },
  {
    id: 'proxy',
    name: 'Прокси БРОТОВОД-Х',
    files: {
      'seal.enc': {
        kind: 'enc',
        key: 'SLAY',
        unlocks: 'archive',
        gives: '42',
        text: [
          'ПЕЧАТЬ СНЯТА. ВНУТРИ — ОБРЫВОК ПЛАНА «ТИШИНА»:',
          '«...заглушить район, изъять самокаты, фрагмент ключа: 42...»',
          'КЛЮЧ ФРАГМЕНТ 2/3: 42. Узел archive открыт.',
        ],
      },
      'spans.log': {
        kind: 'log',
        text: [
          '[03:12] спам-бот №7: «скибиди» — 4000 повторов. Канал держится.',
          '[03:40] БРОТОВОД-Х запросил «тишину в эфире». Отказано. Йоу.',
          '[04:02] мопсы пересекли периметр. Потерь нет. Мопсы одобряют.',
        ],
      },
    },
  },
  {
    id: 'archive',
    name: 'Архив БРОТОВОД-Х',
    lockedBy: 'seal.enc',
    files: {
      'memo.log': {
        kind: 'log',
        text: [
          'МЕМО ГЕНДИРЕКТОРУ БРОТОВОД-Х:',
          '«Братухи снова отбили глушилку. Наш план «ТИШИНА» трещит.',
          'Они смеются. СМЕЮТСЯ! Требую больше глушилок!»',
          'Резолюция: «Кринж. Отклонить. — Совет»',
          'P.S. пароль от vault — кличка их сторожа. Кажется, МОПС.',
        ],
      },
      'vault.enc': {
        kind: 'enc',
        key: 'МОПС',
        unlocks: 'core',
        gives: 'ZOV',
        text: [
          'ХРАНИЛИЩЕ ВСКРЫТО. ФРАГМЕНТ 3/3: ZOV.',
          'Ядро БРОТОВОД-Х открыто. Там лежит root.enc и их конец.',
        ],
      },
    },
  },
  {
    id: 'core',
    name: 'Ядро БРОТОВОД-Х',
    lockedBy: 'vault.enc',
    files: {
      'plan.log': {
        kind: 'log',
        text: [
          'ПЛАН «ТИШИНА», ПОЛНЫЙ ТЕКСТ:',
          '1. Заглушить самокаты. 2. Изъять диско-шары. 3. Отменить 42.',
          'Статус плана: ПРОВАЛЕН. Причина: братухи уже победили.',
        ],
      },
      'root.enc': {
        kind: 'enc',
        key: 'SLAY-42-ZOV',
        needsInject: true,
        text: [
          'ROOT ДОСТУП ПОЛУЧЕН.',
          'ФЛАГ: ROOT42-BRATUXA-0042',
          'БРОТОВОД-Х отключён. Самокаты гудят. Мопсы одобряют.',
          'Мы уже победили.',
        ],
      },
    },
  },
];

export const NODE_IDS = NODES.map((n) => n.id);

export function getNode(id: string): Node | undefined {
  return NODES.find((n) => n.id === id);
}
