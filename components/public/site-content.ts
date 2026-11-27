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
} as const;

export const sections = [
  { href: "#menu", label: "Меню" },
  { href: "#breakfast", label: "Завтраки" },
  { href: "#about", label: "О ресторане" },
  { href: "#contacts", label: "Контакты" },
] as const;

export const galleryFrames = [
  { title: "Интерьер", asset: "galleryRoom" },
  { title: "Деталь интерьера", asset: "galleryDetail" },
  { title: "Сервировка", asset: "galleryTable" },
] as const;
