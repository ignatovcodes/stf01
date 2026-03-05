import { getMenuData } from "./api.js";
import { renderCategories, scrollToCategory } from "./components/category.js";
import { renderMenu } from "./components/menu.js";
import { Cart, renderCart } from "./components/cart.js";

/* =============================================
   State
   ============================================= */

let currentScreen = "splash";
let screenHistory = [];
let menuData = null;
let activeCategory = null;

const cart = new Cart(() => updateCartBadge());

/* =============================================
   DOM
   ============================================= */

const $splash = document.getElementById("splash-screen");
const $header = document.getElementById("header");
const $home = document.getElementById("home-screen");
const $menu = document.getElementById("menu-screen");
const $cart = document.getElementById("cart-screen");
const $waiter = document.getElementById("waiter-screen");
const $reserve = document.getElementById("reserve-screen");
const $cartBtn = document.getElementById("cart-btn");
const $cartCount = document.getElementById("cart-count");
const $backBtn = document.getElementById("back-btn");

const ALL_SCREENS = [$home, $menu, $cart, $waiter, $reserve];

/* =============================================
   Sketch Background — SVG pencil-drawn food
   ============================================= */

const SKETCH_SVGS = [
  // Pizza slice
  `<svg viewBox="0 0 60 60"><path d="M30 8 L52 50 H8 Z"/><circle cx="25" cy="30" r="3"/><circle cx="35" cy="35" r="2.5"/><circle cx="30" cy="42" r="2"/></svg>`,
  // Steak on plate
  `<svg viewBox="0 0 70 50"><ellipse cx="35" cy="38" rx="32" ry="10"/><path d="M15 28 C15 18 28 12 38 14 C48 16 55 24 52 32 C49 38 20 38 15 28Z"/><path d="M25 22 C28 20 32 21 30 25"/><path d="M38 20 C40 22 37 26 34 25"/></svg>`,
  // Khinkali
  `<svg viewBox="0 0 60 55"><path d="M30 5 C30 5 22 12 18 22 C14 32 16 40 30 42 C44 40 46 32 42 22 C38 12 30 5 30 5Z"/><path d="M30 5 L30 2"/><path d="M22 18 C24 22 28 24 30 22"/><path d="M38 18 C36 22 32 24 30 22"/><path d="M20 28 C24 32 36 32 40 28"/></svg>`,
  // Wine glass
  `<svg viewBox="0 0 40 65"><path d="M20 35 C8 32 6 18 10 8 H30 C34 18 32 32 20 35Z"/><line x1="20" y1="35" x2="20" y2="52"/><path d="M12 52 H28"/><path d="M12 18 C16 22 24 22 28 18"/></svg>`,
  // Coffee cup
  `<svg viewBox="0 0 55 50"><path d="M10 12 H38 L35 42 H13 Z"/><path d="M38 18 C44 18 48 24 44 30 C42 34 38 32 38 30"/><path d="M18 6 C18 2 22 2 22 6"/><path d="M24 4 C24 0 28 0 28 4"/></svg>`,
  // Plate with dome / cloche
  `<svg viewBox="0 0 70 50"><ellipse cx="35" cy="40" rx="30" ry="8"/><path d="M8 38 C8 16 62 16 62 38"/><line x1="35" y1="10" x2="35" y2="16"/><circle cx="35" cy="8" r="2"/></svg>`,
  // Fork
  `<svg viewBox="0 0 25 70"><line x1="12" y1="30" x2="12" y2="65"/><path d="M5 5 V25 C5 30 12 30 12 30 C12 30 19 30 19 25 V5"/><line x1="8" y1="5" x2="8" y2="22"/><line x1="12" y1="5" x2="12" y2="22"/><line x1="16" y1="5" x2="16" y2="22"/></svg>`,
  // Bread / baguette
  `<svg viewBox="0 0 70 35"><path d="M8 22 C4 16 8 8 18 6 C28 4 42 4 52 6 C62 8 66 16 62 22 C58 28 12 28 8 22Z"/><path d="M20 10 C22 16 20 22 18 24"/><path d="M34 8 C36 14 34 22 32 24"/><path d="M48 10 C50 16 48 22 46 24"/></svg>`,
  // Pasta / spaghetti
  `<svg viewBox="0 0 60 55"><ellipse cx="30" cy="42" rx="26" ry="10"/><path d="M12 36 C14 20 22 14 30 16 C38 18 34 28 26 30 C18 32 20 22 28 20 C36 18 42 24 38 34"/><circle cx="22" cy="34" r="2.5"/><circle cx="36" cy="32" r="2"/></svg>`,
  // Salad bowl
  `<svg viewBox="0 0 65 45"><path d="M6 22 C6 38 58 38 58 22"/><path d="M6 22 C6 14 58 14 58 22"/><path d="M18 18 C20 12 26 14 24 18"/><path d="M34 16 C36 10 42 12 40 16"/><circle cx="28" cy="20" r="3"/><path d="M44 18 L48 10"/></svg>`,
  // Cheese wedge
  `<svg viewBox="0 0 55 45"><path d="M5 38 L50 38 L50 12 Z"/><line x1="5" y1="38" x2="50" y2="38"/><circle cx="22" cy="30" r="3"/><circle cx="35" cy="28" r="2"/><circle cx="40" cy="20" r="2.5"/></svg>`,
  // Shashlik / kebab
  `<svg viewBox="0 0 20 70"><line x1="10" y1="2" x2="10" y2="68"/><rect x="5" y="10" width="10" height="9" rx="3"/><rect x="5" y="23" width="10" height="9" rx="3"/><rect x="5" y="36" width="10" height="9" rx="3"/><rect x="5" y="49" width="10" height="9" rx="3"/></svg>`,
];

function initSketchBackground() {
  const container = document.getElementById("sketch-bg");
  if (!container) return;

  const cols = 6;
  const rows = 10;
  const count = cols * rows;
  const items = [];
  const size = 38;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "sketch-item";

    const svgIndex = Math.floor(Math.random() * SKETCH_SVGS.length);
    el.innerHTML = SKETCH_SVGS[svgIndex];

    el.style.width = size + "px";
    el.style.height = size + "px";

    const col = i % cols;
    const row = Math.floor(i / cols);
    const cellW = 100 / cols;
    const cellH = 100 / rows;
    const baseX = col * cellW + cellW * 0.3;
    const baseY = row * cellH + cellH * 0.25;
    el.style.left = baseX + "%";
    el.style.top = baseY + "%";

    const opacity = 0.06 + Math.random() * 0.04;
    el.style.opacity = opacity;

    const scale = 0.9 + Math.random() * 0.15;

    items.push({
      el,
      scale,
      phase: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      phaseRot: Math.random() * Math.PI * 2,
      speedX: 0.00015 + Math.random() * 0.0002,
      speedY: 0.00012 + Math.random() * 0.00018,
      speedRot: 0.0001 + Math.random() * 0.00015,
      ampX: 5 + Math.random() * 7,
      ampY: 4 + Math.random() * 6,
      ampRot: 6 + Math.random() * 10,
      rot0: -20 + Math.random() * 40,
    });

    container.appendChild(el);
  }

  let last = performance.now();
  function tick(now) {
    const dt = now - last;
    last = now;
    for (const it of items) {
      it.phase += it.speedX * dt;
      it.phaseY += it.speedY * dt;
      it.phaseRot += it.speedRot * dt;

      const dx = Math.sin(it.phase) * it.ampX;
      const dy = Math.cos(it.phaseY) * it.ampY;
      const rot = it.rot0 + Math.sin(it.phaseRot) * it.ampRot;

      it.el.style.transform = `translate(${dx}px,${dy}px) rotate(${rot}deg) scale(${it.scale})`;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* =============================================
   MAX WebApp SDK
   ============================================= */

function initSplashOrbit() {
  const orbit = document.getElementById("splash-orbit");
  if (!orbit) return;

  const icons = [
    SKETCH_SVGS[0],  // pizza
    SKETCH_SVGS[1],  // steak
    SKETCH_SVGS[2],  // khinkali
    SKETCH_SVGS[3],  // wine
    SKETCH_SVGS[4],  // coffee
    SKETCH_SVGS[5],  // cloche
    SKETCH_SVGS[8],  // pasta
    SKETCH_SVGS[11], // shashlik
  ];

  const radius = 62;
  const cx = 80;
  const cy = 80;

  icons.forEach((svg, i) => {
    const el = document.createElement("div");
    el.className = "splash-orbit-item";
    el.innerHTML = svg;
    const angle = (i / icons.length) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius - 18;
    const y = cy + Math.sin(angle) * radius - 18;
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.animationDelay = (i * 0.25) + "s";
    orbit.appendChild(el);
  });
}

function initWebApp() {
  console.log("[SDK] Инициализация MAX WebApp...");

  const WebApp = window.WebApp;
  if (WebApp) {
    console.log("[SDK] WebApp найден, platform:", WebApp.platform, "version:", WebApp.version);
    console.log("[SDK] initData:", WebApp.initData);
    console.log("[SDK] initDataUnsafe:", JSON.stringify(WebApp.initDataUnsafe));

    WebApp.ready();
    console.log("[SDK] WebApp.ready() вызван");

    WebApp.enableClosingConfirmation();

    if (WebApp.BackButton) {
      WebApp.BackButton.onClick(() => handleBack());
    }

    if (WebApp.HapticFeedback) {
      window._haptic = WebApp.HapticFeedback;
    }
  } else {
    console.warn("[SDK] WebApp не найден — браузерный режим");
  }
}

/* =============================================
   Navigation with History API (swipe-back fix)
   ============================================= */

function navigateTo(name, replace = false) {
  if (name === currentScreen) return;

  if (!replace && currentScreen !== "splash") {
    screenHistory.push(currentScreen);
  }

  applyScreen(name);

  if (replace) {
    history.replaceState({ screen: name }, "", `#${name}`);
  } else {
    history.pushState({ screen: name }, "", `#${name}`);
  }
}

function applyScreen(name) {
  ALL_SCREENS.forEach((el) => el.classList.add("hidden"));
  currentScreen = name;
  window.scrollTo(0, 0);

  switch (name) {
    case "home":
      $home.classList.remove("hidden");
      $header.classList.remove("hidden");
      hideBackButton();
      break;
    case "menu":
      $menu.classList.remove("hidden");
      $header.classList.remove("hidden");
      showBackButton();
      break;
    case "cart":
      $cart.classList.remove("hidden");
      $header.classList.remove("hidden");
      showBackButton();
      renderCart(cart, handleCartQuantity);
      break;
    case "waiter":
      $waiter.classList.remove("hidden");
      $header.classList.remove("hidden");
      showBackButton();
      break;
    case "reserve":
      $reserve.classList.remove("hidden");
      $header.classList.remove("hidden");
      showBackButton();
      prefillReserveDate();
      break;
  }
}

function handleBack() {
  haptic("light");
  if (screenHistory.length > 0) {
    history.back();
  } else {
    navigateTo("home", true);
  }
}

window.addEventListener("popstate", (e) => {
  const target = e.state?.screen || "home";
  screenHistory.pop();
  applyScreen(target);
});

function showBackButton() {
  const WebApp = window.WebApp;
  if (WebApp?.BackButton) WebApp.BackButton.show();
  if ($backBtn) $backBtn.classList.remove("hidden");
}

function hideBackButton() {
  const WebApp = window.WebApp;
  if (WebApp?.BackButton) WebApp.BackButton.hide();
  if ($backBtn) $backBtn.classList.add("hidden");
}

/* =============================================
   Cart badge
   ============================================= */

function updateCartBadge() {
  const count = cart.getTotalCount();
  if (count > 0) {
    $cartCount.textContent = count;
    $cartCount.classList.remove("hidden");
  } else {
    $cartCount.classList.add("hidden");
  }
}

/* =============================================
   Menu handlers
   ============================================= */

function handleAddToCart(itemId, delta) {
  cart.add(itemId, delta);
  haptic("light");
  if (delta > 0 && cart.getQty(itemId) === 1) {
    showToast("Добавлено в заказ");
  }
}

function handleCartQuantity(itemId, delta) {
  cart.add(itemId, delta);
  haptic("light");
  renderCart(cart, handleCartQuantity);
}

function handleCategorySelect(catId) {
  activeCategory = catId;
  haptic("light");
  scrollToCategory(catId);
}

/* =============================================
   Send data to MAX bot
   ============================================= */

function sendToBot(data) {
  const json = JSON.stringify(data);
  console.log("[SendData] Отправка в бот:", json);

  const WebApp = window.WebApp;

  if (WebApp && typeof WebApp.sendData === "function") {
    WebApp.sendData(json);
    console.log("[SendData] Данные отправлены через WebApp.sendData()");
    return true;
  }

  console.warn("[SendData] WebApp.sendData() недоступен");
  return false;
}

/* =============================================
   Waiter Form
   ============================================= */

function setupWaiterForm() {
  const actionsContainer = document.getElementById("w-actions");
  let selectedActions = new Set();

  actionsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".quick-btn");
    if (!btn) return;

    haptic("light");
    const val = btn.dataset.value;

    if (selectedActions.has(val)) {
      selectedActions.delete(val);
      btn.classList.remove("active");
    } else {
      selectedActions.add(val);
      btn.classList.add("active");
    }
  });

  document.getElementById("btn-waiter-send").addEventListener("click", () => {
    const table = document.getElementById("w-table").value.trim();
    const comment = document.getElementById("w-comment").value.trim();
    const actions = [...selectedActions];

    if (!table) {
      showToast("Укажите номер стола");
      haptic("warning");
      document.getElementById("w-table").focus();
      return;
    }

    if (actions.length === 0 && !comment) {
      showToast("Выберите причину или напишите комментарий");
      haptic("warning");
      return;
    }

    const data = {
      type: "waiter_call",
      table: Number(table),
      actions,
      comment,
      timestamp: new Date().toISOString(),
    };

    const sent = sendToBot(data);
    haptic("success");

    showSuccessOverlay(
      "🔔",
      "Официант вызван",
      `Стол №${table}. ${actions.join(", ") || comment}\nОфициант уже идёт к вам!`,
      () => {
        document.getElementById("w-table").value = "";
        document.getElementById("w-comment").value = "";
        selectedActions.clear();
        actionsContainer.querySelectorAll(".quick-btn").forEach((b) => b.classList.remove("active"));
        navigateTo("home");
      }
    );

    if (!sent) {
      console.log("[Waiter] Данные для чата:", formatWaiterMessage(data));
    }
  });
}

function formatWaiterMessage(data) {
  let msg = `🔔 ВЫЗОВ ОФИЦИАНТА\n`;
  msg += `📍 Стол: №${data.table}\n`;
  if (data.actions.length) msg += `📋 Причина: ${data.actions.join(", ")}\n`;
  if (data.comment) msg += `💬 Комментарий: ${data.comment}\n`;
  msg += `🕐 ${new Date(data.timestamp).toLocaleString("ru-RU")}`;
  return msg;
}

/* =============================================
   Reserve Form
   ============================================= */

function prefillReserveDate() {
  const dateInput = document.getElementById("r-date");
  if (dateInput && !dateInput.value) {
    const today = new Date();
    dateInput.value = today.toISOString().split("T")[0];
    dateInput.min = dateInput.value;
  }
}

function setupReserveForm() {
  document.getElementById("btn-reserve-send").addEventListener("click", () => {
    const name = document.getElementById("r-name").value.trim();
    const phone = document.getElementById("r-phone").value.trim();
    const date = document.getElementById("r-date").value;
    const time = document.getElementById("r-time").value;
    const guests = document.getElementById("r-guests").value.trim();
    const zone = document.getElementById("r-zone").value;
    const comment = document.getElementById("r-comment").value.trim();

    if (!name) {
      showToast("Укажите имя");
      haptic("warning");
      document.getElementById("r-name").focus();
      return;
    }
    if (!phone) {
      showToast("Укажите телефон");
      haptic("warning");
      document.getElementById("r-phone").focus();
      return;
    }
    if (!date) {
      showToast("Выберите дату");
      haptic("warning");
      return;
    }
    if (!guests) {
      showToast("Укажите количество гостей");
      haptic("warning");
      document.getElementById("r-guests").focus();
      return;
    }

    const data = {
      type: "reservation",
      name,
      phone,
      date,
      time,
      guests: Number(guests),
      zone: zone || "Любой",
      comment,
      timestamp: new Date().toISOString(),
    };

    const sent = sendToBot(data);
    haptic("success");

    const dateFormatted = new Date(date).toLocaleDateString("ru-RU", {
      day: "numeric", month: "long",
    });

    showSuccessOverlay(
      "📅",
      "Бронь отправлена",
      `${name}, ${dateFormatted} в ${time}\nГостей: ${guests}${zone ? ", " + zone : ""}\nМы свяжемся для подтверждения`,
      () => {
        document.getElementById("r-name").value = "";
        document.getElementById("r-phone").value = "";
        document.getElementById("r-date").value = "";
        document.getElementById("r-time").value = "19:00";
        document.getElementById("r-guests").value = "";
        document.getElementById("r-zone").value = "";
        document.getElementById("r-comment").value = "";
        navigateTo("home");
      }
    );

    if (!sent) {
      console.log("[Reserve] Данные для чата:", formatReserveMessage(data));
    }
  });
}

function formatReserveMessage(data) {
  let msg = `📅 БРОНИРОВАНИЕ СТОЛА\n`;
  msg += `👤 ${data.name}\n`;
  msg += `📞 ${data.phone}\n`;
  msg += `📆 ${data.date} в ${data.time}\n`;
  msg += `👥 Гостей: ${data.guests}\n`;
  msg += `🏛️ Зал: ${data.zone}\n`;
  if (data.comment) msg += `💬 ${data.comment}\n`;
  msg += `🕐 ${new Date(data.timestamp).toLocaleString("ru-RU")}`;
  return msg;
}

/* =============================================
   Order submit
   ============================================= */

function handleOrder() {
  if (cart.isEmpty()) {
    showToast("Добавьте блюда в заказ");
    haptic("warning");
    return;
  }

  const items = cart.getCartList();
  const data = {
    type: "order",
    items: items.map((i) => ({
      name: i.name,
      qty: i.qty,
      price: i.price,
    })),
    total: cart.getTotal(),
    timestamp: new Date().toISOString(),
  };

  const sent = sendToBot(data);
  haptic("success");

  showSuccessOverlay(
    "✓",
    "Заказ оформлен",
    `${items.length} позиций на ${cart.getTotal().toLocaleString("ru-RU")} ₽\nВаш заказ принят!`,
    () => {
      cart.clear();
      if (menuData) renderMenu(menuData.categories, cart, handleAddToCart);
      navigateTo("home");
    }
  );

  if (!sent) {
    console.log("[Order] Данные:", JSON.stringify(data, null, 2));
  }
}

/* =============================================
   Success Overlay (shared)
   ============================================= */

function showSuccessOverlay(icon, title, message, onClose) {
  const overlay = document.createElement("div");
  overlay.className = "order-success-overlay";
  overlay.innerHTML = `
    <div class="order-success-content">
      <div class="order-success-icon">${icon}</div>
      <h3>${title}</h3>
      <p>${message.replace(/\n/g, "<br>")}</p>
      <button class="btn-success-close">Отлично</button>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("show"));

  overlay.querySelector(".btn-success-close").addEventListener("click", () => {
    haptic("light");
    overlay.classList.remove("show");
    setTimeout(() => {
      overlay.remove();
      if (onClose) onClose();
    }, 350);
  });
}

/* =============================================
   Utilities
   ============================================= */

function haptic(style) {
  if (window._haptic) {
    try {
      if (style === "success" || style === "error" || style === "warning") {
        window._haptic.notificationOccurred(style);
      } else {
        window._haptic.impactOccurred(style);
      }
    } catch (_) {}
  }
}

let toastTimer = null;
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* =============================================
   Category observer
   ============================================= */

function setupCategoryObserver(categories) {
  const offset = 56 + 52 + 20;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace("section-", "");
          document.querySelectorAll(".cat-pill").forEach((p) =>
            p.classList.toggle("active", p.dataset.id === id)
          );
          const pill = document.querySelector(`.cat-pill[data-id="${id}"]`);
          if (pill) pill.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
      });
    },
    { rootMargin: `-${offset}px 0px -60% 0px`, threshold: 0 }
  );

  categories.forEach((cat) => {
    const section = document.getElementById(`section-${cat.id}`);
    if (section) observer.observe(section);
  });
}

/* =============================================
   Init
   ============================================= */

async function init() {
  console.log("[App] Инициализация...");

  initSplashOrbit();
  initWebApp();
  initSketchBackground();

  try {
    menuData = await getMenuData();
    console.log("[App] Меню:", menuData.categories.length, "категорий");

    cart.setMenuItems(menuData.categories);
    activeCategory = menuData.categories[0]?.id;

    renderCategories(
      menuData.categories.map(({ id, name, emoji }) => ({ id, name, emoji })),
      activeCategory,
      handleCategorySelect
    );
    renderMenu(menuData.categories, cart, handleAddToCart);
    setupCategoryObserver(menuData.categories);

    setupWaiterForm();
    setupReserveForm();

    document.getElementById("btn-menu").addEventListener("click", () => {
      haptic("medium");
      navigateTo("menu");
    });

    document.getElementById("btn-reserve").addEventListener("click", () => {
      haptic("medium");
      navigateTo("reserve");
    });

    document.getElementById("btn-waiter").addEventListener("click", () => {
      haptic("medium");
      navigateTo("waiter");
    });

    $cartBtn.addEventListener("click", () => {
      haptic("medium");
      navigateTo("cart");
    });

    $backBtn.addEventListener("click", () => handleBack());

    document.getElementById("btn-back-to-menu")?.addEventListener("click", () => {
      haptic("light");
      navigateTo("menu");
    });

    document.getElementById("btn-order")?.addEventListener("click", () => handleOrder());

    // Initial history state
    history.replaceState({ screen: "home" }, "", "#home");

    $splash.classList.add("fade-out");
    setTimeout(() => {
      $splash.classList.add("hidden");
      navigateTo("home", true);
      console.log("[App] Готово");
    }, 600);
  } catch (err) {
    console.error("[App] Ошибка:", err);
    $splash.querySelector(".splash-subtitle").textContent = "Ошибка загрузки";
  }
}

/* =============================================
   Entry
   ============================================= */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => init());
} else {
  init();
}
