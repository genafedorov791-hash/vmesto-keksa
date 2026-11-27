import type { photos } from "./photo-assets";

export const menuCollections = {
  main: { href: "/menu", title: "Меню", section: "#menu" },
  breakfast: { href: "/breakfast", title: "Завтраки", section: "#breakfast" },
} as const;

export type MenuKind = keyof typeof menuCollections;

export const menuCategories = {
  breakfast: "Завтраки",
  starters: "Закуски",
  salads: "Салаты",
  soups: "Супы",
  hot: "Горячее",
  children: "Детское меню",
  bread: "Хлеб",
} as const;

export type MenuCategory = keyof typeof menuCategories;
export type Availability = "available" | "unverified" | "sold-out";
type Serving = { amount: number; unit: "г" | "мл" | "кусочка" };
type PhotoKey = keyof typeof photos;

export type MenuDish = {
  id: string;
  category: MenuCategory;
  title: string;
  variant?: string;
  description: string;
  serving: Serving | null;
  priceKopecks: number | null;
  availability: Availability;
  photo?: PhotoKey;
  featuredOnHome?: boolean;
};

export type MenuAddition = Pick<MenuDish, "id" | "title" | "priceKopecks" | "availability"> & {
  serving: Serving;
  parentId: string;
};

export type MenuChoice = MenuDish | MenuAddition;

export const allergyNote = "Если у вас имеется аллергия или непереносимость какого-то продукта, сообщите об этом официанту.";

function dish(
  id: string, category: MenuCategory, title: string, grams: number, rubles: number,
  description: string, options: Pick<MenuDish, "variant" | "photo" | "featuredOnHome"> = {},
): MenuDish {
  return {
    id, category, title, description,
    serving: { amount: grams, unit: "г" },
    priceKopecks: rubles * 100,
    availability: "unverified",
    ...options,
  };
}

export const menuDishes: readonly MenuDish[] = [
  dish("scramble", "breakfast", "Скрембл / яичница с креветками", 260, 520,
    "На хрустящей картофельной лепёшке ротти с кремом из авокадо."),
  dish("omelette", "breakfast", "Омлет", 240, 420,
    "С нежной начинкой из творожного сыра, шпинатом и свежими овощами.", { photo: "omelette" }),
  dish("coconut-rice-porridge", "breakfast", "Рисовая каша", 290, 490,
    "На кокосовом молоке с семенами чиа, пряной томлёной грушей в собственном соку и хрустящими орешками.", { photo: "porridge" }),
  dish("pain-perdu", "breakfast", "«Пан пердю»", 250, 550,
    "Французский тост с кремом из фисташки и рикотты, страчателлой и мороженым."),
  dish("syrniki", "breakfast", "Сырники", 230, 420,
    "Из диетического фермерского творога с лимонным курдом и нежной меренгой.", { photo: "syrniki" }),

  dish("dranik", "starters", "Картофельный драник", 270, 590,
    "С нежным сливочным сыром страчателла, прошуто и свежими сочными овощами."),
  dish("vitello-tonnato", "starters", "Вителло Тоннато", 180, 730,
    "С печёными перцами рамиро и ростбифом под соусом из тунца."),
  dish("tartare", "starters", "Тартар из говядины", 180, 870,
    "Вырезка мраморной говядины с хрустящими ржаными гренками."),
  dish("antipasti", "starters", "Антипасти", 420, 1100,
    "С сырами местных сыроваров, ростбифом, оливками каламата и гриссини (на 2 персоны)."),
  dish("bruschetta-salmon", "starters", "Брускетта на бриоши", 160, 590,
    "Со слабосолёной сёмгой, авокадо и спелыми томатами.", { variant: "с сёмгой" }),
  dish("bruschetta-beef", "starters", "Брускетта на бриоши", 170, 550,
    "С ростбифом, печёными перцами и зернистой горчицей.", { variant: "с ростбифом", photo: "bruschettaBeef" }),
  dish("pate", "starters", "Нежный паштет", 140, 450,
    "Из печени птицы с тостами из обжаренной бриоши, орехами и курагой."),
  dish("guacamole", "starters", "Гуаккомоле", 210, 420,
    "Из спелого авокадо с чили и свежей петрушкой."),

  dish("gravlax-salad", "salads", "Салат с сёмгой гравлакс", 190, 610,
    "С творожным сыром и печёной свёклой."),
  dish("green-salad", "salads", "Зеленый салат", 210, 780,
    "С креветками, брокколи, молодым горошком, авокадо и яйцом пашот.", { photo: "greenSalad", featuredOnHome: true }),
  dish("caesar", "salads", "«Цезарь»", 260, 550,
    "С хрустящей курицей в панировке, с фирменным соусом, салатом романо и пармезаном."),

  dish("pea-soup", "soups", "Гороховый суп", 320, 490,
    "Наваристый и ароматный, с копчёными рёбрышками и овощами.", { photo: "peaSoup" }),
  dish("broccoli-soup", "soups", "Крем-суп из брокколи", 320, 590,
    "Пряный, с тыквенными семечками."),
  dish("tomato-bisque", "soups", "Томатный биск", 270, 550,
    "С сёмгой и креветками."),
  dish("noodle-soup", "soups", "Суп лапша", 250, 450,
    "На ароматном бульоне с домашней курочкой и нежной лапшой."),

  dish("filet", "hot", "Филе-миньон", 400, 1750,
    "С воздушным картофельным пюре, брокколи и грибами.", { photo: "filet", featuredOnHome: true }),
  dish("duck", "hot", "Утиная грудка магре", 270, 790,
    "С соусом на квасе и картофельным пюре.", { photo: "duck", featuredOnHome: true }),
  dish("salmon", "hot", "Стейк из сёмги", 340, 1450,
    "С зелёным гарниром и соусом из оливок каламата и каперсов.", { photo: "salmon" }),
  dish("al-limone", "hot", "Паста «ала лимоне»", 160, 540,
    "С приятной кислинкой, цедрой лимона, петрушкой и морепродуктами."),
  dish("cacio-e-pepe", "hot", "Паста «качо э пепе»", 210, 720,
    "С перцем, соусом жу, пармезаном и ростбифом."),
  dish("creamy-pasta", "hot", "Сливочная паста", 230, 640,
    "С морепродуктами, розмарином и пармезаном."),

  dish("chicken-cutlets", "children", "Куриные котлеты", 240, 520,
    "С картофельным пюре и брокколи.", { photo: "chicken" }),
  dish("quattro-formaggi", "children", "Паста «Квадро Формаджи»", 200, 470,
    "С четырьмя видами сыра."),

  {
    id: "bread-basket", category: "bread", title: "Хлебная корзина",
    description: "Чиабатта, льняной хлеб, бриошь.",
    serving: { amount: 4, unit: "кусочка" }, priceKopecks: 15000, availability: "unverified",
  },
];

export const menuAdditions: readonly MenuAddition[] = [
  { id: "omelette-chicken", title: "Курица сувид", priceKopecks: 8000 },
  { id: "omelette-beef", title: "Ростбиф", priceKopecks: 17000 },
  { id: "omelette-salmon", title: "Сёмга с/с", priceKopecks: 19000 },
].map((addition) => ({
  ...addition, parentId: "omelette", serving: { amount: 50, unit: "г" }, availability: "unverified",
}));

export const menuChoices = [...menuDishes, ...menuAdditions];

const rubles = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 });

export function dishPrice(value: number | null) {
  return value === null ? null : `${rubles.format(value / 100)} ₽`;
}

export function dishTitle(item: MenuChoice) {
  return "variant" in item && item.variant ? `${item.title} ${item.variant}` : item.title;
}

export function servingLabel(serving: Serving | null) {
  return serving ? `${serving.amount} ${serving.unit}` : null;
}

export function dishesForMenu(kind: MenuKind) {
  return kind === "breakfast" ? menuDishes.filter(({ category }) => category === "breakfast") : menuDishes;
}

export function normalizeMenuSearch(value: string) {
  return value.normalize("NFC").toLocaleLowerCase("ru-RU").replaceAll("ё", "е").trim();
}

export function filterMenuDishes(dishes: readonly MenuDish[], category: string, query: string) {
  const words = normalizeMenuSearch(query).split(/\s+/).filter(Boolean);
  return dishes.filter((item) => {
    if (category && category !== item.category) return false;
    const additions = menuAdditions.filter(({ parentId }) => parentId === item.id).map(({ title }) => title);
    const content = normalizeMenuSearch([dishTitle(item), item.description, ...additions].join(" "));
    return words.every((word) => content.includes(word));
  });
}
