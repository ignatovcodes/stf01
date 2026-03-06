import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handleWebhookUpdate } from "./lib/max-webhook.js";
import { sendOrderEmail } from "./lib/send-order-email.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const MAX_BOT_TOKEN = process.env.MAX_BOT_TOKEN || "";
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";
const MINI_APP_URL = process.env.MINI_APP_URL || "";

const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || "",
  port: process.env.SMTP_PORT || "587",
  secure: process.env.SMTP_SECURE || "false",
  user: process.env.SMTP_USER || "",
  pass: process.env.SMTP_PASS || "",
  to: process.env.ORDER_EMAIL || "",
};

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};

const server = http.createServer((req, res) => {
  // Вебхук бота MAX: при нажатии «Старт» отправляем приветствие и кнопку в мини-приложение
  if (req.method === "POST" && (req.url === "/webhook" || req.url === "/webhook/")) {
    const secret = req.headers["x-max-bot-api-secret"];
    if (WEBHOOK_SECRET && secret !== WEBHOOK_SECRET) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: "Invalid secret" }));
      return;
    }
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", async () => {
      try {
        const update = body ? JSON.parse(body) : {};
        if (!MAX_BOT_TOKEN) {
          console.warn("[Webhook] MAX_BOT_TOKEN не задан — приветствие не отправляется");
        } else if (update.update_type === "bot_started" || update.update_type === "message_created") {
          await handleWebhookUpdate(update, MAX_BOT_TOKEN, MINI_APP_URL);
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        console.error("[Webhook]", e);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      }
    });
    return;
  }

  if (req.method === "POST" && (req.url === "/api/order" || req.url === "/api/order/")) {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", async () => {
      try {
        const order = JSON.parse(body);
        console.log("[Order] Получен заказ: стол", order.table, "позиций:", order.items?.length, "итого:", order.total);
        console.log("[Order] SMTP конфиг: host=" + SMTP_CONFIG.host, "user=" + SMTP_CONFIG.user, "to=" + SMTP_CONFIG.to, "port=" + SMTP_CONFIG.port);

        if (SMTP_CONFIG.host && SMTP_CONFIG.user && SMTP_CONFIG.to) {
          console.log("[Order] Отправляю email...");
          await sendOrderEmail(order, SMTP_CONFIG);
          console.log("[Order] Email успешно отправлен на", SMTP_CONFIG.to);
        } else {
          console.warn("[Order] SMTP не настроен — email не отправлен. Проверьте переменные: SMTP_HOST, SMTP_USER, ORDER_EMAIL");
          console.log("[Order] Данные заказа:", JSON.stringify(order, null, 2));
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        console.error("[Order] ОШИБКА отправки email:", e.message);
        console.error("[Order] Полная ошибка:", e);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
    return;
  }

  let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        fs.readFile(path.join(__dirname, "index.html"), (err2, fallback) => {
          if (err2) {
            res.writeHead(500);
            res.end("Internal Server Error");
            return;
          }
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(fallback);
        });
      } else {
        res.writeHead(500);
        res.end("Internal Server Error");
      }
      return;
    }

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache",
    });
    res.end(data);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[Server] Запущен на http://0.0.0.0:${PORT}`);
  console.log(`[Server] SMTP: ${SMTP_CONFIG.host ? SMTP_CONFIG.host + ":" + SMTP_CONFIG.port : "НЕ НАСТРОЕН"}`);
  console.log(`[Server] ORDER_EMAIL: ${SMTP_CONFIG.to || "НЕ ЗАДАН"}`);
  console.log(`[Server] MAX_BOT_TOKEN: ${MAX_BOT_TOKEN ? "задан" : "НЕ ЗАДАН"}`);
});
