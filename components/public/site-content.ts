export const directory = {
  name: "edagda",
  href: "https://edagda.ru/stavropol/restaurant/vmesto-keksa",
  address: "Дзержинского, 133",
  phone: "+7 (906) 464-05-08",
  phoneHref: "tel:+79064640508",
  directionsHref: "https://yandex.ru/maps/?text=" + encodeURIComponent("Ставрополь, улица Дзержинского, 133"),
  hours: [
    { days: "Пн–чт, вс", time: "09:00–22:00" },
    { days: "Пт–сб", time: "09:00–23:00" },
  ],
  breakfastHours: "09:00–12:00",
} as const;

export const sections = [
  { href: "#menu", label: "Меню" },
  { href: "#breakfast", label: "Завтраки" },
  { href: "#about", label: "О ресторане" },
  { href: "#contacts", label: "Контакты" },
] as const;

type FeaturedDish = {
  id: "filet" | "tartare" | "napoleon" | "lemonade";
  category: string;
  title: string;
  description: string;
  detail: string;
  priceKopecks: number | null;
  availability: string;
};

export const featuredPreview: readonly FeaturedDish[] = [
  {
    id: "filet",
    category: "Горячее",
    title: "Филе миньон",
    description: "Говядина с белыми грибами, брокколи и картофельным пюре.",
    detail: "В описании edagda филе подают с нежным пюре из картофеля, белыми грибами и брокколи.",
    priceKopecks: null,
    availability: "Наличие уточняется",
  },
  {
    id: "tartare",
    category: "Закуска",
    title: "Тартар из говядины",
    description: "Говядина, каперсы и трюфельная заправка.",
    detail: "Справочник описывает подачу на мозговой кости с каперсами и заправкой с трюфелем.",
    priceKopecks: null,
    availability: "Наличие уточняется",
  },
  {
    id: "napoleon",
    category: "Десерт",
    title: "Наполеон со свежими фруктами",
    description: "Слоёный десерт, который дополняют свежими фруктами.",
    detail: "Сочетание слоёного десерта и свежих фруктов указано в подборке edagda. Виды фруктов и состав крема уточняются.",
    priceKopecks: null,
    availability: "Наличие уточняется",
  },
  {
    id: "lemonade",
    category: "Напиток",
    title: "Огуречный лимонад",
    description: "Освежающий напиток с огурцом.",
    detail: "Огуречный лимонад упоминается в описании напитков edagda. Объём и полный состав уточняются.",
    priceKopecks: null,
    availability: "Наличие уточняется",
  },
];

const rubles = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 });

export function dishPrice(value: number | null) {
  return value === null ? "Цена уточняется" : `${rubles.format(value / 100)} ₽`;
}

export const galleryFrames = [
  { title: "Интерьер", asset: "galleryRoom" },
  { title: "Деталь интерьера", asset: "galleryDetail" },
  { title: "Сервировка", asset: "galleryTable" },
] as const;
