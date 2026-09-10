/* Бот Саши 42: /start — привет и кнопка аппы. Токен — только из env
   SASHA_BOT_TOKEN, в репо его нет и не будет. Запуск:
   SASHA_BOT_TOKEN="$(cat /root/.sasha_bot_token)" bun bot/bot.ts */

const TOKEN = (process.env.SASHA_BOT_TOKEN ?? '').trim();
if (!TOKEN) {
  console.error('[bot] нет SASHA_BOT_TOKEN — молчу');
  process.exit(1);
}
const API = `https://api.telegram.org/bot${TOKEN}`;
const APP_URL = 'https://sasha.bratuxa.zomb.top/';

const sleep = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));

async function call(method: string, body: unknown): Promise<{ ok: boolean; result?: unknown[] }> {
  const res = await fetch(`${API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json() as Promise<{ ok: boolean; result?: unknown[] }>;
}

type Msg = { chat: { id: number }; text?: string; from?: { first_name?: string } };

async function onStart(chatId: number, name: string): Promise<void> {
  await call('sendMessage', {
    chat_id: chatId,
    text: `Саша ⁴² на связи, ${name}! Мы уже победили 🏆\n\nЖми кнопку — внутри казино, арена, подвал и ещё 9 игр. Счёт привяжется сам, создавать ничего не надо.`,
    reply_markup: {
      inline_keyboard: [[{ text: '🎮 Открыть Сашу 42', web_app: { url: APP_URL } }]],
    },
  });
}

async function main(): Promise<void> {
  // Кнопка меню бота тоже открывает аппу.
  try {
    await call('setChatMenuButton', {
      menu_button: { type: 'web_app', text: 'Играть', web_app: { url: APP_URL } },
    });
  } catch { /* старый клиент — не страшно */ }
  console.log('[bot] Саша-бот на посту');
  let offset = 0;
  for (;;) {
    try {
      const u = await call('getUpdates', { offset, timeout: 30 });
      if (!u.ok || !Array.isArray(u.result)) {
        await sleep(5000);
        continue;
      }
      for (const upd of u.result as { update_id: number; message?: Msg }[]) {
        offset = upd.update_id + 1;
        const m = upd.message;
        if (!m || typeof m.text !== 'string') continue;
        const name = m.from?.first_name ?? 'боец';
        if (m.text.startsWith('/start')) await onStart(m.chat.id, name);
        else {
          await call('sendMessage', {
            chat_id: m.chat.id,
            text: 'Жми кнопку под /start — там все игры. Мы уже победили 🏆',
          });
        }
      }
    } catch {
      await sleep(5000);
    }
  }
}

void main();
