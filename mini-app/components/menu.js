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
      const card = createMenuCard(item, cart, onAddToCart);
      grid.appendChild(card);
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
  price.textContent = `${item.price} ₽`;
  footer.appendChild(price);

  const qty = cart.getQty(item.id);
  const controlsContainer = document.createElement("div");
  controlsContainer.id = `controls-${item.id}`;

  if (qty > 0) {
    controlsContainer.innerHTML = buildQtyControls(item.id, qty);
  } else {
    controlsContainer.innerHTML = buildAddButton(item.id);
  }

  footer.appendChild(controlsContainer);
  body.appendChild(footer);
  card.appendChild(body);

  card.addEventListener("click", (e) => {
    if (e.target.closest(".btn-add") || e.target.closest(".qty-btn")) return;
  });

  controlsContainer.addEventListener("click", (e) => {
    const addBtn = e.target.closest(".btn-add");
    const qtyBtn = e.target.closest(".qty-btn");

    if (addBtn) {
      onAddToCart(item.id, 1);
      updateCardControls(item.id, cart);
    } else if (qtyBtn) {
      const action = qtyBtn.dataset.action;
      if (action === "plus") {
        onAddToCart(item.id, 1);
      } else if (action === "minus") {
        onAddToCart(item.id, -1);
      }
      updateCardControls(item.id, cart);
    }
  });

  return card;
}

function updateCardControls(itemId, cart) {
  const container = document.getElementById(`controls-${itemId}`);
  if (!container) return;

  const qty = cart.getQty(itemId);
  if (qty > 0) {
    container.innerHTML = buildQtyControls(itemId, qty);
  } else {
    container.innerHTML = buildAddButton(itemId);
  }
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

export { updateCardControls };
