# Деплой на Timeweb Cloud (вебхук + мини-приложение)

Чтобы вебхук бота MAX и мини-приложение работали, их нужно выложить на сервер с **HTTPS**. Ниже — два варианта на Timeweb Cloud.

---

## Вариант 1: App Platform (проще всего)

App Platform сам поднимает приложение, выдаёт HTTPS-домен и порт.

### 1. Подготовка репозитория

- Либо создайте отдельный Git-репозиторий, в корне которого лежит папка **mini-app** (только её содержимое в корне: `package.json`, `server.js`, `index.html`, `lib/` и т.д.).
- Либо в Timeweb при создании приложения укажите **корневую директорию** (Root directory / Путь к приложению) = `mini-app`, если в репозитории проект лежит в подпапке `mini-app`.

### 2. Создание приложения в Timeweb

1. Зайдите в [Timeweb Cloud](https://timeweb.cloud/) → **Облачные сервисы** → **App Platform**.
2. **Создать приложение** → выберите **Подключить репозиторий** (GitHub / GitLab / свой Git).
3. Укажите репозиторий и, если нужно, **директорию приложения**: `mini-app` (или оставьте корень, если в репо в корне уже лежит `package.json` и `server.js`).
4. Среда: **Node.js** (20 или 22).
5. **Команда сборки** (если спрашивают):  
   `npm install`  
   или оставьте по умолчанию.
6. **Команда запуска**:  
   `node server.js`  
   (App Platform может сам подставить `pm2 start server.js` — тогда ничего не меняйте.)
7. Сохраните и дождитесь деплоя.

### 3. Переменные окружения в App Platform

В настройках приложения найдите раздел **Переменные окружения** (Environment variables) и добавьте:

| Имя               | Значение                          | Секретность |
|-------------------|-----------------------------------|-------------|
| `MAX_BOT_TOKEN`   | токен бота из business.max.ru      | Да          |
| `WEBHOOK_SECRET`  | придуманный пароль для вебхука    | Да          |
| `MINI_APP_URL`    | **полный URL вашего приложения** (см. ниже) | Нет   |

**Важно:** `MINI_APP_URL` — это тот же адрес, по которому открывается ваше приложение в Timeweb, **без** `/webhook` в конце, например:

- `https://ваше-приложение-12345.timeweb.cloud`  
  или  
- `https://stefania.yourdomain.ru` — если привязали свой домен.

Без правильного `MINI_APP_URL` кнопка «Открыть меню» в приветствии бота ведёт в никуда.

### 4. Домен приложения

После деплоя в App Platform будет выдан адрес вида:

- `https://<id-или-имя>.timeweb.cloud`

Либо привяжите свой домен в настройках приложения. Запомните этот URL — он нужен для шага 5 и для `MINI_APP_URL`.

### 5. Регистрация вебхука в MAX

Когда приложение уже открывается по HTTPS, зарегистрируйте подписку на обновления бота:

```bash
curl -X POST "https://platform-api.max.ru/subscriptions" \
  -H "Authorization: ВАШ_ТОКЕН_БОТА" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"https://ваш-домен/webhook\", \"update_types\": [\"bot_started\", \"message_created\"], \"secret\": \"ваш_webhook_secret\"}"
```

Подставьте:

- **ВАШ_ТОКЕН_БОТА** — тот же, что в `MAX_BOT_TOKEN`;
- **url** — полный адрес вашего приложения + путь `/webhook`, например:  
  `https://ваше-приложение-12345.timeweb.cloud/webhook`  
  или свой домен: `https://stefania.yourdomain.ru/webhook`;
- **secret** — то же значение, что в переменной `WEBHOOK_SECRET`.

После этого при нажатии «Старт» в боте MAX будет вызываться ваш сервер и отправляться приветствие с кнопкой в мини-приложение.

---

## Вариант 2: Облачный сервер (VPS)

Если хотите поднять приложение на своей виртуалке в Timeweb Cloud.

### 1. Создайте сервер

Timeweb Cloud → **Облачные серверы** → создать ВМ (Ubuntu 22.04 или 24.04).

### 2. Установка Node.js и запуск приложения

Подключитесь по SSH и выполните:

```bash
sudo apt-get update
sudo apt-get install -y nodejs npm git
node -v   # желательно 18+
```

Склонируйте проект (или залейте файлы из папки `mini-app`):

```bash
cd /home
sudo git clone https://ваш-репо.git stefania-app
cd stefania-app/mini-app   # если в репо корень — проект, то просто cd stefania-app
```

Установите зависимости и запустите:

```bash
npm install
sudo npm install -g pm2
```

Создайте файл с переменными (не коммитьте его в Git):

```bash
nano .env
```

Вставьте (подставьте свои значения):

```
MAX_BOT_TOKEN=ваш_токен_бота
WEBHOOK_SECRET=ваш_секрет
MINI_APP_URL=https://ваш-домен-или-IP
```

Сохраните. Чтобы приложение читало `.env`, можно использовать `dotenv` или задать переменные при запуске:

```bash
export $(cat .env | xargs) && node server.js
```

Запуск через PM2 с переменными из `.env`:

```bash
# Установите dotenv: npm install dotenv и в server.js в самом начале: import 'dotenv/config';
# Либо задайте переменные в ecosystem.config.js
pm2 start server.js --name stefania
pm2 save
sudo pm2 startup
```

### 3. Nginx + HTTPS (обязательно для вебхука MAX)

MAX принимает вебхуки только по **HTTPS на порту 443**. Значит, перед Node.js нужен Nginx с SSL.

Установите Nginx и Certbot:

```bash
sudo apt-get install -y nginx certbot python3-certbot-nginx
```

Настройте виртуальный хост (замените `yourdomain.ru` на ваш домен или поддомен):

```bash
sudo nano /etc/nginx/sites-available/stefania
```

Пример конфига (порт приложения — например 3000):

```nginx
server {
    listen 80;
    server_name yourdomain.ru;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Включите сайт и получите сертификат:

```bash
sudo ln -s /etc/nginx/sites-available/stefania /etc/nginx/sites-enabled/
sudo nginx -t
sudo certbot --nginx -d yourdomain.ru
sudo systemctl reload nginx
```

В `MINI_APP_URL` укажите: `https://yourdomain.ru`.

### 4. Регистрация вебхука в MAX

Так же, как в варианте 1, шаг 5, но в `url` подставьте:

`https://yourdomain.ru/webhook`

---

## Проверка

1. Откройте в браузере `https://ваш-домен` — должна открыться главная мини-приложения (меню, заказ).
2. Откройте `https://ваш-домен/webhook` в браузере — метод GET не обрабатывается, возможна ошибка или пустой ответ — это нормально. MAX шлёт только POST.
3. В боте MAX нажмите **Старт** — должно прийти приветствие и кнопка «Открыть меню и сделать заказ»; по нажатию открывается ваше мини-приложение.

Если приветствие не приходит — проверьте логи приложения в App Platform или `pm2 logs stefania` на VPS и что переменные `MAX_BOT_TOKEN`, `WEBHOOK_SECRET`, `MINI_APP_URL` заданы верно.
