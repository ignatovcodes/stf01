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
   DOM references
   ============================================= */

const $splash = document.getElementById("splash-screen");
const $header = document.getElementById("header");
const $home = document.getElementById("home-screen");
const $menu = document.getElementById("menu-screen");
const $cart = document.getElementById("cart-screen");
const $cartBtn = document.getElementById("cart-btn");
const $cartCount = document.getElementById("cart-count");

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
      WebApp.BackButton.onClick(() => {
        handleBack();
      });
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
  if (currentScreen === "cart") {
    showScreen("menu");
  } else if (currentScreen === "menu") {
    showScreen("home");
  }
}

function showBackButton() {
  const WebApp = window.WebApp;
  if (WebApp && WebApp.BackButton) {
    WebApp.BackButton.show();
  }
}

function hideBackButton() {
  const WebApp = window.WebApp;
  if (WebApp && WebApp.BackButton) {
    WebApp.BackButton.hide();
  }
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
   Event handlers
   ============================================= */

function handleAddToCart(itemId, delta) {
  cart.add(itemId, delta);
  haptic("light");
  if (delta > 0 && cart.getQty(itemId) === 1) {
    showToast("Добавлено в корзину");
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
   Utilities
   ============================================= */

function haptic(style) {
  if (window._haptic) {
    try {
      window._haptic.impactOccurred(style);
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
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

function showOrderSuccess() {
  const overlay = document.createElement("div");
  overlay.className = "order-success-overlay";
  overlay.innerHTML = `
    <div class="order-success-content">
      <div class="order-success-icon">✅</div>
      <h3>Заказ оформлен!</h3>
      <p>Ваш заказ принят и будет готов в ближайшее время. Спасибо!</p>
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
      if (menuData) {
        renderMenu(menuData.categories, cart, handleAddToCart);
      }
    }, 300);
  });

  haptic("success");
}

/* =============================================
   Setup intersection observer for category highlight
   ============================================= */

function setupCategoryObserver(categories) {
  const headerH = 56;
  const catBarH = 52;
  const offset = headerH + catBarH + 20;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace("section-", "");
          const pills = document.querySelectorAll(".cat-pill");
          pills.forEach((p) => p.classList.toggle("active", p.dataset.id === id));

          const activePill = document.querySelector(`.cat-pill[data-id="${id}"]`);
          if (activePill) {
            activePill.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
          }
        }
      });
    },
    {
      rootMargin: `-${offset}px 0px -60% 0px`,
      threshold: 0,
    }
  );

  categories.forEach((cat) => {
    const section = document.getElementById(`section-${cat.id}`);
    if (section) observer.observe(section);
  });
}

/* =============================================
   Bootstrap
   ============================================= */

async function init() {
  console.log("[App] Инициализация приложения...");

  initWebApp();

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

    // Bind UI events
    document.getElementById("btn-menu").addEventListener("click", () => {
      haptic("medium");
      showScreen("menu");
    });

    document.getElementById("btn-reserve").addEventListener("click", () => {
      haptic("medium");
      showToast("Бронирование скоро будет доступно");
    });

    document.getElementById("btn-waiter").addEventListener("click", () => {
      haptic("medium");
      showToast("Официант уже идёт к вам!");
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
        showToast("Корзина пуста");
        return;
      }
      showOrderSuccess();
    });

    // Hide splash, show home
    $splash.classList.add("fade-out");
    setTimeout(() => {
      $splash.classList.add("hidden");
      showScreen("home");
      console.log("[App] Приложение готово к работе");
    }, 500);
  } catch (err) {
    console.error("[App] Ошибка инициализации:", err);
    $splash.querySelector(".splash-subtitle").textContent = "Ошибка загрузки. Попробуйте позже.";
  }
}

/* =============================================
   Entry point — wait for DOM
   ============================================= */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("[App] DOMContentLoaded fired");
    init();
  });
} else {
  console.log("[App] DOM already loaded");
  init();
}
