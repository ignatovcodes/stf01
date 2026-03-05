const menuData = {
  restaurant: {
    name: "СТЕФАНИЯ",
    tagline: "вкус, объединяющий поколения",
    address: "г. Краснодар, Кубанская наб., 186/1",
    phone: "+7 (988) 353-57-35",
    phone2: "+7 (918) 935-35-35",
    hours: "ежедневно 11:30 – 01:00",
  },
  categories: [
    {
      id: "salads",
      name: "Салаты",
      emoji: "🥗",
      items: [
        { id: "sa1", name: "Цезарь с курицей", weight: "250 г", price: 490, emoji: "🥗", image: "images/sa1.png" },
        { id: "sa2", name: "Цезарь с креветками", weight: "260 г", price: 620, emoji: "🦐", image: "images/sa2.png" },
        { id: "sa3", name: "Тёплый салат с телятиной", weight: "240 г", price: 580, emoji: "🥩", image: "images/sa3.png" },
        { id: "sa4", name: "Салат с тунцом и авокадо", weight: "220 г", price: 560, emoji: "🐟", image: "images/sa4.png" },
        { id: "sa5", name: "Капрезе с буратой", weight: "230 г", price: 520, emoji: "🍅", image: "images/sa5.png" },
        { id: "sa6", name: "Овощной с бальзамиком", weight: "200 г", price: 380, emoji: "🥒", image: "images/sa6.png" },
        { id: "sa7", name: "Руккола с пармезаном и вялеными томатами", weight: "210 г", price: 450, emoji: "🧀", image: "images/sa7.png" },
      ],
    },
    {
      id: "cold",
      name: "Холодные закуски",
      emoji: "🍽️",
      items: [
        { id: "cl1", name: "Брускетта с лососем", weight: "180 г", price: 490, emoji: "🐟", image: "images/cl1.png" },
        { id: "cl2", name: "Карпаччо из говядины", weight: "150 г", price: 620, emoji: "🥩", image: "images/cl2.png" },
        { id: "cl3", name: "Тартар из тунца", weight: "160 г", price: 680, emoji: "🐟", image: "images/cl3.png" },
        { id: "cl4", name: "Ассорти сыров", weight: "250 г", price: 720, emoji: "🧀", image: "images/cl4.png" },
        { id: "cl5", name: "Мясное ассорти", weight: "280 г", price: 790, emoji: "🥓", image: "images/cl5.png" },
      ],
    },
    {
      id: "soups",
      name: "Супы",
      emoji: "🍜",
      items: [
        { id: "sp1", name: "Том Ям с креветками", weight: "350 мл", price: 520, emoji: "🍜", image: "images/sp1.png" },
        { id: "sp2", name: "Крем-суп из тыквы", weight: "300 мл", price: 380, emoji: "🎃", image: "images/sp2.png" },
        { id: "sp3", name: "Харчо с говядиной", weight: "350 мл", price: 420, emoji: "🥘", image: "images/sp3.png" },
        { id: "sp4", name: "Крем-суп грибной с трюфелем", weight: "300 мл", price: 460, emoji: "🍄", image: "images/sp4.png" },
      ],
    },
    {
      id: "hot",
      name: "Горячее",
      emoji: "🥘",
      items: [
        { id: "h1", name: "Стейк Рибай", weight: "300 г", price: 1890, emoji: "🥩", image: "images/h1.png" },
        { id: "h2", name: "Стейк Миньон", weight: "250 г", price: 1690, emoji: "🥩", image: "images/h2.png" },
        { id: "h3", name: "Каре ягнёнка", weight: "350 г", price: 1590, emoji: "🍖", image: "images/h3.png" },
        { id: "h4", name: "Лосось на гриле", weight: "220 г", price: 890, emoji: "🐟", image: "images/h4.png" },
        { id: "h5", name: "Дорадо целиком", weight: "400 г", price: 980, emoji: "🐠", image: "images/h5.png" },
        { id: "h6", name: "Цыплёнок табака", weight: "450 г", price: 720, emoji: "🍗", image: "images/h6.png" },
        { id: "h7", name: "Медальоны из телятины", weight: "280 г", price: 1190, emoji: "🥩", image: "images/h7.png" },
      ],
    },
    {
      id: "khachapuri",
      name: "Хачапури",
      emoji: "🫓",
      items: [
        { id: "kh1", name: "Хачапури по-аджарски", weight: "350 г", price: 490, emoji: "🫓", image: "images/kh1.png" },
        { id: "kh2", name: "Хачапури по-мегрельски", weight: "320 г", price: 450, emoji: "🫓", image: "images/kh2.png" },
        { id: "kh3", name: "Хачапури по-имеретински", weight: "300 г", price: 420, emoji: "🫓", image: "images/kh3.png" },
      ],
    },
    {
      id: "shashlik",
      name: "Мангал",
      emoji: "🔥",
      items: [
        { id: "sh1", name: "Люля-кебаб из баранины", weight: "250 г", price: 520, emoji: "🔥", image: "images/sh1.png" },
        { id: "sh2", name: "Шашлык из свинины", weight: "280 г", price: 590, emoji: "🥩", image: "images/sh2.png" },
        { id: "sh3", name: "Шашлык из курицы", weight: "250 г", price: 420, emoji: "🍗", image: "images/sh3.png" },
        { id: "sh4", name: "Шашлык из баранины", weight: "300 г", price: 790, emoji: "🍖", image: "images/sh4.png" },
        { id: "sh5", name: "Кебаб из телятины", weight: "260 г", price: 650, emoji: "🥩", image: "images/sh5.png" },
        { id: "sh6", name: "Овощи на мангале", weight: "220 г", price: 380, emoji: "🫑", image: "images/sh6.png" },
      ],
    },
    {
      id: "pasta",
      name: "Паста",
      emoji: "🍝",
      items: [
        { id: "pa1", name: "Карбонара", weight: "300 г", price: 490, emoji: "🍝", image: "images/pa1.png" },
        { id: "pa2", name: "Болоньезе", weight: "320 г", price: 480, emoji: "🍝", image: "images/pa2.png" },
        { id: "pa3", name: "Паста с морепродуктами", weight: "340 г", price: 650, emoji: "🦐", image: "images/pa3.png" },
        { id: "pa4", name: "Паста с трюфелем и грибами", weight: "300 г", price: 720, emoji: "🍄", image: "images/pa4.png" },
        { id: "pa5", name: "Тальятелле с лососем", weight: "310 г", price: 590, emoji: "🐟", image: "images/pa5.png" },
      ],
    },
    {
      id: "pizza",
      name: "Пицца",
      emoji: "🍕",
      items: [
        { id: "pz1", name: "Маргарита", weight: "450 г", price: 490, emoji: "🍕", image: "images/pz1.png" },
        { id: "pz2", name: "Пепперони", weight: "480 г", price: 550, emoji: "🍕", image: "images/pz2.png" },
        { id: "pz3", name: "Четыре сыра", weight: "440 г", price: 590, emoji: "🧀", image: "images/pz3.png" },
        { id: "pz4", name: "С прошутто и рукколой", weight: "460 г", price: 650, emoji: "🥓", image: "images/pz4.png" },
        { id: "pz5", name: "Дьябола", weight: "470 г", price: 580, emoji: "🌶️", image: "images/pz5.png" },
      ],
    },
    {
      id: "garnish",
      name: "Гарниры",
      emoji: "🥔",
      items: [
        { id: "g1", name: "Картофель фри с трюфелем", weight: "200 г", price: 320, emoji: "🍟", image: "images/g1.png" },
        { id: "g2", name: "Пюре с пармезаном", weight: "200 г", price: 280, emoji: "🥔", image: "images/g2.png" },
        { id: "g3", name: "Рис с шафраном", weight: "180 г", price: 250, emoji: "🍚", image: "images/g3.png" },
        { id: "g4", name: "Овощи на пару", weight: "200 г", price: 320, emoji: "🥦", image: "images/g4.png" },
      ],
    },
    {
      id: "desserts",
      name: "Десерты",
      emoji: "🍰",
      items: [
        { id: "d1", name: "Тирамису", weight: "160 г", price: 420, emoji: "🍰", image: "images/d1.png" },
        { id: "d2", name: "Чизкейк Нью-Йорк", weight: "170 г", price: 450, emoji: "🍰", image: "images/d2.png" },
        { id: "d3", name: "Панна-котта", weight: "150 г", price: 380, emoji: "🍮", image: "images/d3.png" },
        { id: "d4", name: "Шоколадный фондан", weight: "180 г", price: 490, emoji: "🍫", image: "images/d4.png" },
        { id: "d5", name: "Сорбет ягодный", weight: "130 г", price: 320, emoji: "🍧", image: "images/d5.png" },
        { id: "d6", name: "Штрудель яблочный", weight: "190 г", price: 420, emoji: "🥧", image: "images/d6.png" },
      ],
    },
    {
      id: "drinks",
      name: "Напитки",
      emoji: "🥤",
      items: [
        { id: "dr1", name: "Лимонад Цитрус-мята", weight: "400 мл", price: 320, emoji: "🍋", image: "images/dr1.png" },
        { id: "dr2", name: "Лимонад Манго-маракуйя", weight: "400 мл", price: 340, emoji: "🥭", image: "images/dr2.png" },
        { id: "dr3", name: "Свежевыжатый апельсин", weight: "300 мл", price: 290, emoji: "🍊", image: "images/dr3.png" },
        { id: "dr4", name: "Морс ягодный", weight: "400 мл", price: 250, emoji: "🫐", image: "images/dr4.png" },
        { id: "dr5", name: "Капучино", weight: "250 мл", price: 220, emoji: "☕", image: "images/dr5.png" },
        { id: "dr6", name: "Латте", weight: "300 мл", price: 250, emoji: "☕", image: "images/dr6.png" },
        { id: "dr7", name: "Матча латте", weight: "300 мл", price: 350, emoji: "🍵", image: "images/dr7.png" },
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
    }, 400);
  });
}

export function getCategories() {
  return menuData.categories.map(({ id, name, emoji }) => ({ id, name, emoji }));
}

export function getItemsByCategory(categoryId) {
  const cat = menuData.categories.find((c) => c.id === categoryId);
  return cat ? cat.items : [];
}
