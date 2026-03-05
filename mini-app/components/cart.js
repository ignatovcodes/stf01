export class Cart {
  constructor(onChange) {
    this.items = new Map();
    this.onChange = onChange;
    this.menuItems = new Map();
  }

  setMenuItems(categories) {
    categories.forEach((cat) => {
      cat.items.forEach((item) => {
        this.menuItems.set(item.id, item);
      });
    });
  }

  add(itemId, delta = 1) {
    const current = this.items.get(itemId) || 0;
    const next = Math.max(0, current + delta);

    if (next === 0) this.items.delete(itemId);
    else this.items.set(itemId, next);

    console.log(`[Cart] ${itemId}: ${current} → ${next}`);
    this.onChange();
  }

  getQty(itemId) {
    return this.items.get(itemId) || 0;
  }

  getTotal() {
    let total = 0;
    this.items.forEach((qty, id) => {
      const item = this.menuItems.get(id);
      if (item) total += item.price * qty;
    });
    return total;
  }

  getTotalCount() {
    let count = 0;
    this.items.forEach((qty) => (count += qty));
    return count;
  }

  getCartList() {
    const list = [];
    this.items.forEach((qty, id) => {
      const item = this.menuItems.get(id);
      if (item) list.push({ ...item, qty });
    });
    return list;
  }

  clear() {
    this.items.clear();
    this.onChange();
  }

  isEmpty() {
    return this.items.size === 0;
  }
}

export function renderCart(cart, onQuantityChange) {
  const cartItems = document.getElementById("cart-items");
  const cartEmpty = document.getElementById("cart-empty");
  const cartFooter = document.getElementById("cart-footer");
  const cartTotalPrice = document.getElementById("cart-total-price");

  if (!cartItems) return;

  const items = cart.getCartList();

  if (items.length === 0) {
    cartItems.classList.add("hidden");
    cartEmpty.classList.remove("hidden");
    cartFooter.classList.add("hidden");
    return;
  }

  cartEmpty.classList.add("hidden");
  cartItems.classList.remove("hidden");
  cartFooter.classList.remove("hidden");

  cartItems.innerHTML = "";

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${(item.price * item.qty).toLocaleString("ru-RU")} ₽</div>
      </div>
      <div class="cart-item-controls">
        <button class="cart-item-qty-btn" data-action="minus" data-id="${item.id}">−</button>
        <span class="cart-item-qty">${item.qty}</span>
        <button class="cart-item-qty-btn" data-action="plus" data-id="${item.id}">+</button>
      </div>
    `;

    row.querySelectorAll(".cart-item-qty-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        onQuantityChange(btn.dataset.id, btn.dataset.action === "plus" ? 1 : -1);
      });
    });

    cartItems.appendChild(row);
  });

  cartTotalPrice.textContent = cart.getTotal().toLocaleString("ru-RU") + " ₽";
}
