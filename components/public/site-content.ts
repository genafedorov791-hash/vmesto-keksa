export const directory = {
  name: "edagda",
  href: "https://edagda.ru/stavropol/restaurant/vmesto-keksa",
  address: "Дзержинского, 133",
  phone: "+7 (906) 464-05-08",
  phoneHref: "tel:+79064640508",
  directionsHref: "https://yandex.ru/maps/?text=" + encodeURIComponent("Ставрополь, улица Дзержинского, 133"),
} as const;

export const sections = [
  { href: "/menu", label: "Меню" },
  { href: "/breakfast", label: "Завтраки" },
  { href: "/events", label: "Афиша" },
  { href: "/#about", label: "О ресторане" },
] as const;

export const galleryFrames = [
  { title: "За столом", asset: "room" },
  { title: "Тост", asset: "toast" },
] as const;
