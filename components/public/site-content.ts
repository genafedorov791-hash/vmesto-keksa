export const sections = [
  { href: "#menu", label: "Меню" },
  { href: "#breakfast", label: "Завтраки" },
  { href: "#about", label: "О ресторане" },
  { href: "#contacts", label: "Контакты" },
] as const;

export const dishSlots = [
  { title: "Основное блюдо", caption: "Место для главного кадра", tone: "clay" },
  { title: "Закуска", caption: "Место для фотографии подачи", tone: "sand" },
  { title: "Десерт", caption: "Место для фотографии десерта", tone: "chalk" },
  { title: "Напиток", caption: "Место для фотографии напитка", tone: "olive" },
] as const;

export const galleryFrames = [
  { title: "Интерьер", caption: "Место для общего кадра зала", tone: "pine" },
  { title: "Деталь интерьера", caption: "Место для вертикального кадра", tone: "olive-dark" },
  { title: "Сервировка", caption: "Место для фотографии сервировки", tone: "umber" },
] as const;
