import type { photos } from "./photo-assets";

export const menuCollections = {
  main: { href: "/menu", title: "Меню", section: "#menu" },
  breakfast: { href: "/breakfast", title: "Завтраки", section: "#breakfast" },
} as const;

export type MenuKind = keyof typeof menuCollections;

export const menuCategories = {
  hot: "Горячее",
  starters: "Закуски",
  desserts: "Десерты",
  drinks: "Напитки",
  savoury: "Сытные завтраки",
  cereals: "Каши",
} as const;
export type MenuCategory = keyof typeof menuCategories;
export type Availability = "available" | "unverified" | "sold-out";

export type MenuDish = {
  id: string;
  menus: readonly MenuKind[];
  category: MenuCategory;
  title: string;
  description: string;
  detail?: string;
  ingredients: readonly string[] | null;
  allergens: readonly string[] | null;
  serving: { amount: number; unit: "г" | "мл" } | null;
  priceKopecks: number | null;
  availability: Availability;
  photo: keyof typeof photos | null;
  featuredOnHome?: boolean;
};

const unverifiedDetails = {
  ingredients: null,
  allergens: null,
  serving: null,
  priceKopecks: null,
  availability: "unverified",
} as const;

export const menuDishes: readonly MenuDish[] = [
  {
    ...unverifiedDetails,
    id: "filet",
    menus: ["main"],
    category: "hot",
    title: "Филе миньон",
    description: "Говядина с белыми грибами, брокколи и картофельным пюре.",
    detail: "Говяжье филе с картофельным пюре, белыми грибами и брокколи.",
    photo: "filet",
    featuredOnHome: true,
  },
  {
    ...unverifiedDetails,
    id: "tartare",
    menus: ["main"],
    category: "starters",
    title: "Тартар из говядины",
    description: "Говядина, каперсы и трюфельная заправка.",
    detail: "Подача на мозговой кости, с каперсами и трюфельной заправкой.",
    photo: "tartare",
    featuredOnHome: true,
  },
  {
    ...unverifiedDetails,
    id: "napoleon",
    menus: ["main"],
    category: "desserts",
    title: "Наполеон со свежими фруктами",
    description: "Слоёный десерт, который дополняют свежими фруктами.",
    detail: "Слоёный десерт со свежими фруктами.",
    photo: "napoleon",
    featuredOnHome: true,
  },
  {
    ...unverifiedDetails,
    id: "lemonade",
    menus: ["main"],
    category: "drinks",
    title: "Огуречный лимонад",
    description: "Освежающий напиток с огурцом.",
    detail: "Освежающий напиток с огурцом.",
    photo: "lemonade",
  },
  {
    ...unverifiedDetails,
    id: "scramble",
    menus: ["breakfast"],
    category: "savoury",
    title: "Скрэмбл с креветками",
    description: "С картофельной роти и кремом из авокадо.",
    detail: "С картофельной роти и кремом из авокадо.",
    photo: "breakfast",
  },
  {
    ...unverifiedDetails,
    id: "polenta",
    menus: ["breakfast"],
    category: "savoury",
    title: "Полента со шпинатом и страчателлой",
    description: "Полента со шпинатом и страчателлой.",
    photo: "polenta",
  },
  {
    ...unverifiedDetails,
    id: "rice-porridge",
    menus: ["breakfast"],
    category: "cereals",
    title: "Рисовая каша с клубникой",
    description: "Рисовая каша на кокосовом молоке.",
    detail: "На кокосовом молоке.",
    photo: "ricePorridge",
  },
];

const rubles = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 });

export function dishPrice(value: number | null) {
  return value === null ? null : `${rubles.format(value / 100)} ₽`;
}

export const availabilityLabels: Record<Availability, string | null> = {
  available: "В наличии",
  unverified: null,
  "sold-out": "Временно недоступно",
};

export function normalizeMenuSearch(value: string) {
  return value.normalize("NFC").toLocaleLowerCase("ru-RU").replaceAll("ё", "е").trim();
}

export function filterMenuDishes(dishes: readonly MenuDish[], category: string, query: string) {
  const words = normalizeMenuSearch(query).split(/\s+/).filter(Boolean);
  return dishes.filter((dish) => {
    if (category && category !== dish.category) return false;
    const content = normalizeMenuSearch([
      dish.title, dish.description, dish.detail, ...(dish.ingredients ?? []),
    ].join(" "));
    return words.every((word) => content.includes(word));
  });
}
