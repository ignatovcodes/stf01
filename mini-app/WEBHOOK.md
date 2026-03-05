# Вебхук бота MAX для ресторана Стефания

При нажатии пользователем **Старт** в боте MAX бот отправляет приветственное сообщение от имени ресторана Стефания (Краснодар) и кнопку для перехода в мини‑приложение (меню и заказ).

## Переменные окружения

| Переменная | Описание |
|------------|----------|
| `MAX_BOT_TOKEN` | Токен бота (business.max.ru → Чат-боты → Интеграция → Получить токен) |
| `WEBHOOK_SECRET` | Секрет подписки (рекомендуется). Задаётся при создании подписки и проверяется в заголовке `X-Max-Bot-Api-Secret` |
| `MINI_APP_URL` | Публичный URL мини‑приложения (например, `https://stefania-mini-app.onrender.com`) |

Скопируйте `.env.example` в `.env` и заполните значения.

## Настройка подписки (Webhook) в MAX

1. Разверните приложение на сервере с **HTTPS на порту 443** (Render, VPS и т.п.).
2. Вызовите API MAX и создайте подписку на обновления:

```bash
curl -X POST "https://platform-api.max.ru/subscriptions" \
  -H "Authorization: YOUR_BOT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.com/webhook",
    "update_types": ["bot_started", "message_created"],
    "secret": "your_webhook_secret"
  }'
```

- `url` — полный адрес вашего сервера + путь `/webhook`.
- `update_types` — `bot_started` (нажатие Старт) и `message_created` (команда /start в чате).
- `secret` — тот же пароль, что и в `WEBHOOK_SECRET` в `.env`.

3. Убедитесь, что в `.env` указаны те же `MAX_BOT_TOKEN`, `WEBHOOK_SECRET` и корректный `MINI_APP_URL`.

## Поведение

- **Событие `bot_started`** — пользователь нажал «Старт» в боте → бот отправляет приветствие и кнопку.
- **Сообщение `/start`** (или «старт» / «start») — то же приветствие и кнопка.

Кнопка ведёт на `MINI_APP_URL` (мини‑приложение с меню и заказом).

## Локальная разработка

Для теста вебхука нужен публичный HTTPS. Можно использовать [ngrok](https://ngrok.com/) или аналог и указать в подписке URL вида `https://xxxx.ngrok.io/webhook`.

---

## Готовая команда для PowerShell (stfmenu.ru)

Скопируй строку ниже **целиком** в PowerShell и нажми Enter. Подставь свой токен и секрет вместо `ТВОЙ_ТОКЕН` и `ТВОЙ_СЕКРЕТ`.

```powershell
Invoke-RestMethod -Uri "https://platform-api.max.ru/subscriptions" -Method POST -Headers @{ "Authorization" = "ТВОЙ_ТОКЕН"; "Content-Type" = "application/json" } -Body '{"url": "https://stfmenu.ru/webhook", "update_types": ["bot_started", "message_created"], "secret": "ТВОЙ_СЕКРЕТ"}'
```

Важно: в `url` должно быть ровно `https://stfmenu.ru/webhook` — без пробелов и без двойного `https://`.
