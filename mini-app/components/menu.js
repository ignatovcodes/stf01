export function renderMenu(categories, cart, onAddToCart) {
  const menuList = document.getElementById("menu-list");
  if (!menuList) return;

  menuList.innerHTML = "";

  categories.forEach((category) => {
    const section = document.createElement("div");
    section.className = "menu-section";
    section.id = `section-${category.id}`;

    const title = document.createElement("h2");
    title.className = "menu-section-title";
    title.textContent = `${category.emoji} ${category.name}`;
    section.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "menu-grid";

    category.items.forEach((item) => {
      grid.appendChild(createMenuCard(item, cart, onAddToCart));
    });

    section.appendChild(grid);
    menuList.appendChild(section);
  });
}

function createMenuCard(item, cart, onAddToCart) {
  const card = document.createElement("div");
  card.className = "menu-card";
  card.dataset.itemId = item.id;

  const imgPlaceholder = document.createElement("div");
  imgPlaceholder.className = "menu-card-img-placeholder";
  imgPlaceholder.textContent = item.emoji;
  card.appendChild(imgPlaceholder);

  const body = document.createElement("div");
  body.className = "menu-card-body";

  const name = document.createElement("div");
  name.className = "menu-card-name";
  name.textContent = item.name;
  body.appendChild(name);

  const weight = document.createElement("div");
  weight.className = "menu-card-weight";
  weight.textContent = item.weight;
  body.appendChild(weight);

  const footer = document.createElement("div");
  footer.className = "menu-card-footer";

  const price = document.createElement("div");
  price.className = "menu-card-price";
  price.textContent = formatPrice(item.price);
  footer.appendChild(price);

  const controlsContainer = document.createElement("div");
  controlsContainer.id = `controls-${item.id}`;

  const qty = cart.getQty(item.id);
  controlsContainer.innerHTML = qty > 0
    ? buildQtyControls(item.id, qty)
    : buildAddButton();

  footer.appendChild(controlsContainer);
  body.appendChild(footer);
  card.appendChild(body);

  controlsContainer.addEventListener("click", (e) => {
    const addBtn = e.target.closest(".btn-add");
    const qtyBtn = e.target.closest(".qty-btn");

    if (addBtn) {
      onAddToCart(item.id, 1);
      updateCardControls(item.id, cart);
    } else if (qtyBtn) {
      const action = qtyBtn.dataset.action;
      onAddToCart(item.id, action === "plus" ? 1 : -1);
      updateCardControls(item.id, cart);
    }
  });

  return card;
}

function updateCardControls(itemId, cart) {
  const container = document.getElementById(`controls-${itemId}`);
  if (!container) return;

  const qty = cart.getQty(itemId);
  container.innerHTML = qty > 0
    ? buildQtyControls(itemId, qty)
    : buildAddButton();
}

function buildAddButton() {
  return `<button class="btn-add" aria-label="Добавить">+</button>`;
}

function buildQtyControls(itemId, qty) {
  return `
    <div class="qty-control">
      <button class="qty-btn" data-action="minus" data-id="${itemId}">−</button>
      <span class="qty-value">${qty}</span>
      <button class="qty-btn" data-action="plus" data-id="${itemId}">+</button>
    </div>
  `;
}

function formatPrice(price) {
  return price.toLocaleString("ru-RU") + " ₽";
}

export { updateCardControls };
