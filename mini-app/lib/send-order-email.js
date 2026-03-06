/**
 * Отправка заказа на почту ресторана через SMTP (nodemailer).
 * HTML-письмо в стилистике приложения Стефания.
 */

export async function sendOrderEmail(order, smtpConfig) {
  const { createTransport } = await import("nodemailer");

  const transporter = createTransport({
    host: smtpConfig.host,
    port: Number(smtpConfig.port) || 587,
    secure: smtpConfig.secure === "true" || smtpConfig.port === "465",
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.pass,
    },
  });

  const html = buildOrderHtml(order);
  const subject = `Заказ со стола №${order.table} — ${new Date(order.timestamp).toLocaleString("ru-RU")}`;

  await transporter.sendMail({
    from: `"Стефания" <${smtpConfig.user}>`,
    to: smtpConfig.to,
    subject,
    html,
  });
}

function buildOrderHtml(order) {
  const rows = order.items
    .map(
      (i) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #f0ebe4;font-family:'Georgia',serif;font-size:15px;color:#2c2c2c;">${i.name}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0ebe4;text-align:center;font-family:'Helvetica',sans-serif;font-size:14px;color:#6b6b6b;">${i.qty}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0ebe4;text-align:right;font-family:'Helvetica',sans-serif;font-size:14px;font-weight:600;color:#2c2c2c;">${(i.price * i.qty).toLocaleString("ru-RU")} ₽</td>
      </tr>`
    )
    .join("");

  const wishesBlock = order.wishes
    ? `<tr><td colspan="3" style="padding:14px 12px;font-family:'Georgia',serif;font-size:14px;color:#6b6b6b;font-style:italic;">💬 ${order.wishes}</td></tr>`
    : "";

  const time = new Date(order.timestamp).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:'Georgia',serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f5;padding:24px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
  <!-- Header -->
  <tr><td style="background:#9e8e6c;padding:28px 24px;text-align:center;">
    <div style="font-family:'Georgia',serif;font-size:28px;font-weight:600;color:#ffffff;letter-spacing:8px;">СТЕФАНИЯ</div>
    <div style="font-family:'Helvetica',sans-serif;font-size:11px;color:rgba(255,255,255,0.7);letter-spacing:2px;margin-top:6px;text-transform:uppercase;">новый заказ</div>
  </td></tr>

  <!-- Table & Time -->
  <tr><td style="padding:24px 24px 12px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="font-family:'Helvetica',sans-serif;font-size:13px;color:#9e8e6c;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Стол №${order.table}</td>
        <td style="text-align:right;font-family:'Helvetica',sans-serif;font-size:12px;color:#a0a0a0;">${time}</td>
      </tr>
    </table>
  </td></tr>

  <!-- Divider -->
  <tr><td style="padding:0 24px;"><div style="height:1px;background:#f0ebe4;"></div></td></tr>

  <!-- Items -->
  <tr><td style="padding:8px 12px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <th style="padding:10px 12px;text-align:left;font-family:'Helvetica',sans-serif;font-size:10px;color:#a0a0a0;letter-spacing:1px;text-transform:uppercase;border-bottom:2px solid #f0ebe4;">Блюдо</th>
        <th style="padding:10px 12px;text-align:center;font-family:'Helvetica',sans-serif;font-size:10px;color:#a0a0a0;letter-spacing:1px;text-transform:uppercase;border-bottom:2px solid #f0ebe4;">Кол-во</th>
        <th style="padding:10px 12px;text-align:right;font-family:'Helvetica',sans-serif;font-size:10px;color:#a0a0a0;letter-spacing:1px;text-transform:uppercase;border-bottom:2px solid #f0ebe4;">Сумма</th>
      </tr>
      ${rows}
      ${wishesBlock}
    </table>
  </td></tr>

  <!-- Total -->
  <tr><td style="padding:16px 24px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f5;border-radius:12px;padding:16px 20px;">
      <tr>
        <td style="font-family:'Georgia',serif;font-size:18px;color:#6b6b6b;">Итого</td>
        <td style="text-align:right;font-family:'Helvetica',sans-serif;font-size:22px;font-weight:700;color:#2c2c2c;">${order.total.toLocaleString("ru-RU")} ₽</td>
      </tr>
    </table>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:16px 24px 24px;text-align:center;">
    <div style="font-family:'Helvetica',sans-serif;font-size:11px;color:#a0a0a0;">Ресторан Стефания · Кубанская наб., 186/1 · Краснодар</div>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}
