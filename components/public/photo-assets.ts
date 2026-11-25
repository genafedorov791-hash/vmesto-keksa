export type PhotoAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  focus: string;
  mobileFocus?: string;
};

export const photos = {
  hero: {
    src: "/assets/photos/hero-seating.webp",
    alt: "Зелёные кресла и сервированный стол под деревом в ресторанном зале",
    width: 1480,
    height: 986,
    sizes: "(max-width: 48rem) calc(100vw - 40px), (max-width: 100rem) 61vw, 960px",
    focus: "61% 50%",
    mobileFocus: "58% 53%",
  },
  aboutRoom: {
    src: "/assets/photos/about-room.webp",
    alt: "Столики у окна под подвесными светильниками",
    width: 1152,
    height: 1536,
    sizes: "(max-width: 48rem) 84vw, 42vw",
    focus: "53% 60%",
  },
  aboutDetail: {
    src: "/assets/photos/about-detail.webp",
    alt: "Солнечный свет на столике у окна с жалюзи",
    width: 900,
    height: 1350,
    sizes: "(max-width: 48rem) 43vw, 23vw",
    focus: "48% 71%",
    mobileFocus: "48% 69%",
  },
  filet: {
    src: "/assets/photos/dish-filet-mignon.webp",
    alt: "Говяжье филе с зеленью и соусом на белой тарелке",
    width: 1600,
    height: 1077,
    sizes: "(max-width: 48rem) calc(100vw - 40px), 44vw",
    focus: "51% 52%",
  },
  tartare: {
    src: "/assets/photos/dish-tartare.webp",
    alt: "Говяжий тартар с желтком на светлой тарелке",
    width: 1600,
    height: 1090,
    sizes: "(max-width: 22rem) 100vw, (max-width: 48rem) 39vw, 17vw",
    focus: "48% 55%",
  },
  napoleon: {
    src: "/assets/photos/dish-napoleon.webp",
    alt: "Кусочек слоёного торта со свежей клубникой",
    width: 1200,
    height: 1600,
    sizes: "(max-width: 48rem) 47vw, 22vw",
    focus: "63% 68%",
    mobileFocus: "63% 66%",
  },
  lemonade: {
    src: "/assets/photos/dish-lemonade.webp",
    alt: "Стаканы с огурцом, лимоном и мятой",
    width: 1600,
    height: 1264,
    sizes: "(max-width: 48rem) 47vw, 16vw",
    focus: "47% 48%",
    mobileFocus: "49% 52%",
  },
  breakfast: {
    src: "/assets/photos/breakfast.webp",
    alt: "Скрэмбл, тост с авокадо и чашка кофе на столе",
    width: 1600,
    height: 1067,
    sizes: "(max-width: 48rem) calc(100vw - 40px), 54vw",
    focus: "60% 55%",
    mobileFocus: "61% 55%",
  },
  galleryRoom: {
    src: "/assets/photos/gallery-daylight.webp",
    alt: "Деревянные столы и кресла вдоль панорамных окон",
    width: 1800,
    height: 1200,
    sizes: "(max-width: 48rem) calc(100vw - 40px), 48vw",
    focus: "62% 53%",
    mobileFocus: "68% 54%",
  },
  galleryDetail: {
    src: "/assets/photos/gallery-detail.webp",
    alt: "Столики и растения в солнечном свете у окон",
    width: 1060,
    height: 1590,
    sizes: "(max-width: 48rem) 47vw, 22vw",
    focus: "59% 57%",
  },
  galleryTable: {
    src: "/assets/photos/gallery-table.webp",
    alt: "Бокалы и подсвечники на сервированных столах",
    width: 900,
    height: 1350,
    sizes: "(max-width: 48rem) 47vw, 22vw",
    focus: "50% 61%",
  },
} as const satisfies Record<string, PhotoAsset>;
