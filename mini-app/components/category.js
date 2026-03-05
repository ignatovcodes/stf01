export function renderCategories(categories, activeId, onSelect) {
  const bar = document.getElementById("categories-bar");
  if (!bar) return;

  const inner = document.createElement("div");
  inner.className = "cat-inner";

  categories.forEach((cat) => {
    const pill = document.createElement("button");
    pill.className = `cat-pill${cat.id === activeId ? " active" : ""}`;
    pill.textContent = `${cat.emoji} ${cat.name}`;
    pill.dataset.id = cat.id;

    pill.addEventListener("click", () => {
      onSelect(cat.id);
      bar.querySelectorAll(".cat-pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");

      pill.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });

    inner.appendChild(pill);
  });

  bar.innerHTML = "";
  bar.appendChild(inner);
}

export function scrollToCategory(categoryId) {
  const section = document.getElementById(`section-${categoryId}`);
  if (section) {
    const headerH = 56;
    const catBarH = 52;
    const offset = section.offsetTop - headerH - catBarH - 8;
    window.scrollTo({ top: offset, behavior: "smooth" });
  }
}
