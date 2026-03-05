const menuData = {
  restaurant: {
    name: "СТЕФАНИЯ",
    address: "г. Краснодар, Кубанская наб., 186/1",
    phone: "+7 (988) 353-57-35",
  },
  categories: [
    {
      id: "rolls",
      name: "Роллы",
      emoji: "🍣",
      items: [
        { id: "r1", name: "Филадельфия классик", weight: "250 г", price: 590, emoji: "🍣" },
        { id: "r2", name: "Калифорния с крабом", weight: "240 г", price: 520, emoji: "🦀" },
        { id: "r3", name: "Дракон ролл", weight: "280 г", price: 650, emoji: "🐉" },
        { id: "r4", name: "Спайси лосось", weight: "220 г", price: 480, emoji: "🌶️" },
        { id: "r5", name: "Унаги маки", weight: "200 г", price: 540, emoji: "🍣" },
        { id: "r6", name: "Темпура ролл", weight: "260 г", price: 570, emoji: "🍤" },
      ],
    },
    {
      id: "sushi",
      name: "Суши",
      emoji: "🍱",
      items: [
        { id: "s1", name: "Нигири с лососем", weight: "40 г", price: 190, emoji: "🐟" },
        { id: "s2", name: "Нигири с тунцом", weight: "40 г", price: 220, emoji: "🐟" },
        { id: "s3", name: "Нигири с угрём", weight: "40 г", price: 250, emoji: "🐟" },
        { id: "s4", name: "Нигири с креветкой", weight: "40 г", price: 210, emoji: "🍤" },
        { id: "s5", name: "Гункан спайси", weight: "45 г", price: 230, emoji: "🔥" },
      ],
    },
    {
      id: "hot",
      name: "Горячее",
      emoji: "🥘",
      items: [
        { id: "h1", name: "Том Ям с креветками", weight: "350 мл", price: 490, emoji: "🍜" },
        { id: "h2", name: "Пад Тай с курицей", weight: "320 г", price: 420, emoji: "🍝" },
        { id: "h3", name: "Вок с говядиной", weight: "340 г", price: 460, emoji: "🥡" },
        { id: "h4", name: "Рамен с морепродуктами", weight: "400 мл", price: 520, emoji: "🍜" },
        { id: "h5", name: "Карри с тигровыми креветками", weight: "350 г", price: 580, emoji: "🍛" },
        { id: "h6", name: "Якисоба с овощами", weight: "300 г", price: 380, emoji: "🍝" },
      ],
    },
    {
      id: "salads",
      name: "Салаты",
      emoji: "🥗",
      items: [
        { id: "sa1", name: "Цезарь с курицей", weight: "250 г", price: 390, emoji: "🥗" },
        { id: "sa2", name: "Чука салат", weight: "180 г", price: 320, emoji: "🥬" },
        { id: "sa3", name: "Тёплый салат с лососем", weight: "220 г", price: 450, emoji: "🐟" },
        { id: "sa4", name: "Овощной микс", weight: "200 г", price: 280, emoji: "🥒" },
      ],
    },
    {
      id: "pizza",
      name: "Пицца",
      emoji: "🍕",
      items: [
        { id: "p1", name: "Маргарита", weight: "450 г", price: 490, emoji: "🍕" },
        { id: "p2", name: "Пепперони", weight: "480 г", price: 550, emoji: "🍕" },
        { id: "p3", name: "Четыре сыра", weight: "440 г", price: 590, emoji: "🧀" },
        { id: "p4", name: "С морепродуктами", weight: "500 г", price: 650, emoji: "🦐" },
        { id: "p5", name: "Мясная", weight: "520 г", price: 620, emoji: "🥩" },
      ],
    },
    {
      id: "desserts",
      name: "Десерты",
      emoji: "🍰",
      items: [
        { id: "d1", name: "Тирамису", weight: "150 г", price: 350, emoji: "🍰" },
        { id: "d2", name: "Чизкейк Нью-Йорк", weight: "160 г", price: 380, emoji: "🍰" },
        { id: "d3", name: "Моти манго", weight: "120 г", price: 290, emoji: "🍡" },
        { id: "d4", name: "Шоколадный фондан", weight: "180 г", price: 420, emoji: "🍫" },
      ],
    },
    {
      id: "drinks",
      name: "Напитки",
      emoji: "🥤",
      items: [
        { id: "dr1", name: "Лимонад манго-маракуйя", weight: "400 мл", price: 280, emoji: "🥭" },
        { id: "dr2", name: "Матча латте", weight: "300 мл", price: 320, emoji: "🍵" },
        { id: "dr3", name: "Свежевыжатый апельсин", weight: "300 мл", price: 250, emoji: "🍊" },
        { id: "dr4", name: "Смузи ягодный", weight: "350 мл", price: 340, emoji: "🫐" },
        { id: "dr5", name: "Кокосовая вода", weight: "330 мл", price: 220, emoji: "🥥" },
      ],
    },
  ],
};

export function getMenuData() {
  console.log("[API] Загрузка данных меню...");
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("[API] Данные меню загружены:", menuData.categories.length, "категорий");
      resolve(menuData);
    }, 300);
  });
}

export function getCategories() {
  return menuData.categories.map(({ id, name, emoji }) => ({ id, name, emoji }));
}

export function getItemsByCategory(categoryId) {
  const cat = menuData.categories.find((c) => c.id === categoryId);
  return cat ? cat.items : [];
}
