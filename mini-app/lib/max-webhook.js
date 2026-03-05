/**
 * Обработчик вебхука бота MAX для ресторана Стефания.
 * При событии bot_started или команде /start отправляет приветственное сообщение
 * с кнопкой перехода в мини-приложение.
 */

const MAX_API_BASE = "https://platform-api.max.ru";

/**
 * Отправляет сообщение пользователю через MAX Bot API.
 * @param {string} token - Access token бота (Authorization)
 * @param {number} userId - ID пользователя
 * @param {object} body - Тело сообщения (text, attachments, format)
 * @returns {Promise<object>}
 */
export async function sendMessage(token, userId, body) {
  const url = `${MAX_API_BASE}/messages?user_id=${userId}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`MAX API error ${res.status}: ${errText}`);
  }
  return res.json();
}

/**
 * Извлекает user_id из объекта Update (bot_started или message_created).
 * @param {object} update - Объект Update от вебхука
 * @returns {{ userId: number } | null}
 */
export function getUserIdFromUpdate(update) {
  if (!update || typeof update !== "object") return null;

  // bot_started: часто приходит user_id или chat_id в корне или в chat
  if (update.user_id) return { userId: update.user_id };
  if (update.chat_id) return { userId: update.chat_id }; // в личке chat_id может быть как user
  if (update.user?.user_id) return { userId: update.user.user_id };
  if (update.user?.id) return { userId: update.user.id };
  if (update.chat?.user_id) return { userId: update.chat.user_id };
  if (update.chat?.chat_id) return { userId: update.chat.chat_id };
  if (update.chat?.id) return { userId: update.chat.id };

  // message_created: отправитель сообщения
  const msg = update.message;
  if (msg?.sender?.user_id) return { userId: msg.sender.user_id };
  // Получатель в личке — бот; отвечаем отправителю. В группе recipient — чат.
  if (msg?.recipient?.user_id) return { userId: msg.recipient.user_id };
  if (msg?.recipient?.chat_id) return { userId: msg.recipient.chat_id };

  return null;
}

/**
 * Проверяет, нужно ли отправить приветствие (Start).
 * @param {object} update
 * @returns {boolean}
 */
export function isStartTrigger(update) {
  const type = update?.update_type;
  if (type === "bot_started") return true;
  if (type === "message_created") {
    const text = update.message?.body?.text?.trim().toLowerCase() || "";
    if (text === "/start" || text === "старт" || text === "start") return true;
  }
  return false;
}

/**
 * Формирует приветственное сообщение с кнопкой «Открыть мини-приложение».
 * @param {string} miniAppUrl - URL мини-приложения (или ссылка на него)
 */
export function getWelcomeMessage(miniAppUrl) {
  const url = miniAppUrl && !/^https?:\/\//i.test(miniAppUrl) ? `https://${miniAppUrl}` : miniAppUrl;
  const welcomeText = `🍽 *Ресторан Стефания* приветствует вас!

Мы рады видеть вас в Краснодаре — здесь вас ждёт итальянская и кавказская кухня, уютная веранда и тёплая атмосфера.

👇 *Что можно сделать прямо сейчас:*
• Открыть *меню* и выбрать блюда
• Оформить *заказ* в пару нажатий
• Забронировать стол или вызвать официанта

Нажмите кнопку ниже — откроется наше мини‑приложение, где всё это доступно.`;

  const buttons = [];

  if (url) {
    // Кнопка «Открыть мини-приложение» — в MAX используется open_app или link
    // Документация: open_app открывает мини-приложение. Если у вас есть app_id — подставьте его.
    // Здесь используем link на URL мини-приложения для надёжности.
    buttons.push([
      {
        type: "link",
        text: "📱 Открыть меню и сделать заказ",
        url: url,
      },
    ]);
  }

  const body = {
    text: welcomeText,
    format: "markdown",
  };

  if (buttons.length > 0) {
    body.attachments = [
      {
        type: "inline_keyboard",
        payload: { buttons },
      },
    ];
  }

  return body;
}

/**
 * Обрабатывает входящий Update от вебхука MAX.
 * @param {object} update - Тело POST-запроса вебхука
 * @param {string} botToken - Токен бота
 * @param {string} miniAppUrl - URL мини-приложения
 * @returns {Promise<{ handled: boolean, error?: string }>}
 */
export async function handleWebhookUpdate(update, botToken, miniAppUrl) {
  if (!isStartTrigger(update)) {
    return { handled: true }; // не Start — просто подтверждаем получение
  }

  const target = getUserIdFromUpdate(update);
  if (!target) {
    console.warn("[MaxBot] Не удалось определить user_id из update:", JSON.stringify(update).slice(0, 500));
    return { handled: true };
  }

  try {
    const message = getWelcomeMessage(miniAppUrl);
    await sendMessage(botToken, target.userId, message);
    return { handled: true };
  } catch (err) {
    console.error("[MaxBot] Ошибка отправки приветствия:", err);
    return { handled: true, error: err.message };
  }
}
