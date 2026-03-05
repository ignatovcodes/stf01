import { getMenuData } from "./api.js";
import { renderCategories, scrollToCategory } from "./components/category.js";
import { renderMenu } from "./components/menu.js";
import { Cart, renderCart } from "./components/cart.js";

/* =============================================
   State
   ============================================= */

let currentScreen = "splash";
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
const $cartBtn = document.getElementById("cart-btn");
const $cartCount = document.getElementById("cart-count");

/* =============================================
   Sketch Background — floating pencil-drawn food
   ============================================= */

function initSketchBackground() {
  const container = document.getElementById("sketch-bg");
  if (!container) return;

  const foodItems = [
    "🍕", "🍔", "🥗", "🍝", "🍰", "🥩", "🍗", "🧀",
    "🍷", "☕", "🫓", "🍜", "🥘", "🍟", "🫑", "🍋",
    "🍅", "🍤", "🥧", "🍮", "🐟", "🔥", "🍖", "🥒",
    "🍊", "🫐", "🍵", "🥔", "🍚", "🥦", "🍫", "🍧",
  ];

  const count = 20;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "sketch-item";
    el.textContent = foodItems[Math.floor(Math.random() * foodItems.length)];

    const size = 24 + Math.random() * 20;
    el.style.fontSize = size + "px";
    el.style.left = Math.random() * 100 + "%";
    el.style.animationDuration = (18 + Math.random() * 22) + "s";
    el.style.animationDelay = (Math.random() * 20) + "s";

    container.appendChild(el);
  }
}

/* =============================================
   MAX WebApp SDK
   ============================================= */

function initWebApp() {
  console.log("[SDK] Инициализация MAX WebApp...");

  const WebApp = window.WebApp;

  if (WebApp) {
    console.log("[SDK] WebApp объект найден");
    console.log("[SDK] Platform:", WebApp.platform);
    console.log("[SDK] Version:", WebApp.version);
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
    console.warn("[SDK] WebApp не найден — работаем в браузере");
  }
}

/* =============================================
   Navigation
   ============================================= */

function showScreen(name) {
  [$home, $menu, $cart].forEach((el) => el.classList.add("hidden"));
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
  }
}

function handleBack() {
  haptic("light");
  if (currentScreen === "cart") showScreen("menu");
  else if (currentScreen === "menu") showScreen("home");
}

function showBackButton() {
  const WebApp = window.WebApp;
  if (WebApp?.BackButton) WebApp.BackButton.show();
}

function hideBackButton() {
  const WebApp = window.WebApp;
  if (WebApp?.BackButton) WebApp.BackButton.hide();
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
   Handlers
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
   Waiter call — bottom sheet confirmation
   ============================================= */

function showWaiterSheet() {
  const overlay = document.createElement("div");
  overlay.className = "waiter-overlay";
  overlay.innerHTML = `
    <div class="waiter-sheet">
      <div class="waiter-sheet-handle"></div>
      <h3>Вызвать официанта?</h3>
      <p>Мы пригласим официанта к вашему столику. Пожалуйста, подождите пару минут.</p>
      <div class="waiter-btns">
        <button class="waiter-btn-cancel">Отмена</button>
        <button class="waiter-btn-confirm">Вызвать</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("show"));

  overlay.querySelector(".waiter-btn-cancel").addEventListener("click", () => {
    overlay.classList.remove("show");
    setTimeout(() => overlay.remove(), 350);
  });

  overlay.querySelector(".waiter-btn-confirm").addEventListener("click", () => {
    haptic("success");
    overlay.classList.remove("show");
    setTimeout(() => {
      overlay.remove();
      showToast("Официант уже идёт к вам!");
    }, 350);
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("show");
      setTimeout(() => overlay.remove(), 350);
    }
  });
}

/* =============================================
   Order success
   ============================================= */

function showOrderSuccess() {
  const overlay = document.createElement("div");
  overlay.className = "order-success-overlay";
  overlay.innerHTML = `
    <div class="order-success-content">
      <div class="order-success-icon">✓</div>
      <h3>Заказ оформлен</h3>
      <p>Ваш заказ принят и будет готов в ближайшее время. Благодарим вас!</p>
      <button class="btn-success-close">Отлично</button>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("show"));

  overlay.querySelector(".btn-success-close").addEventListener("click", () => {
    haptic("success");
    overlay.classList.remove("show");
    setTimeout(() => {
      overlay.remove();
      cart.clear();
      showScreen("home");
      if (menuData) renderMenu(menuData.categories, cart, handleAddToCart);
    }, 350);
  });

  haptic("success");
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
   Intersection observer for category highlight
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
          const activePill = document.querySelector(`.cat-pill[data-id="${id}"]`);
          if (activePill) {
            activePill.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
          }
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
  console.log("[App] Инициализация приложения...");

  initWebApp();
  initSketchBackground();

  try {
    menuData = await getMenuData();
    console.log("[App] Меню получено:", menuData.categories.length, "категорий");

    cart.setMenuItems(menuData.categories);
    activeCategory = menuData.categories[0]?.id;

    renderCategories(
      menuData.categories.map(({ id, name, emoji }) => ({ id, name, emoji })),
      activeCategory,
      handleCategorySelect
    );

    renderMenu(menuData.categories, cart, handleAddToCart);
    setupCategoryObserver(menuData.categories);

    document.getElementById("btn-menu").addEventListener("click", () => {
      haptic("medium");
      showScreen("menu");
    });

    document.getElementById("btn-reserve").addEventListener("click", () => {
      haptic("medium");
      showToast("Бронирование: +7 (988) 353-57-35");
    });

    document.getElementById("btn-waiter").addEventListener("click", () => {
      haptic("medium");
      showWaiterSheet();
    });

    $cartBtn.addEventListener("click", () => {
      haptic("medium");
      showScreen("cart");
    });

    document.getElementById("btn-back-to-menu")?.addEventListener("click", () => {
      haptic("light");
      showScreen("menu");
    });

    document.getElementById("btn-order")?.addEventListener("click", () => {
      if (cart.isEmpty()) {
        showToast("Добавьте блюда в заказ");
        return;
      }
      showOrderSuccess();
    });

    $splash.classList.add("fade-out");
    setTimeout(() => {
      $splash.classList.add("hidden");
      showScreen("home");
      console.log("[App] Приложение готово к работе");
    }, 600);
  } catch (err) {
    console.error("[App] Ошибка инициализации:", err);
    $splash.querySelector(".splash-subtitle").textContent = "Ошибка загрузки";
  }
}

/* =============================================
   Entry
   ============================================= */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("[App] DOMContentLoaded");
    init();
  });
} else {
  console.log("[App] DOM ready");
  init();
}
