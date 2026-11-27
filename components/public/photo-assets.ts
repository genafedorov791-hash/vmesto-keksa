export type PhotoAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  focus: string;
  mobileFocus?: string;
};

function restaurantPhoto(name: string, alt: string, width: number, height: number, focus = "50% 50%"): PhotoAsset {
  return { src: `/assets/restaurant/${name}.webp`, alt, width, height, sizes: "(max-width: 48rem) 90vw, 46vw", focus };
}

export const photos = {
  hero: restaurantPhoto("hero", "Омлет со свежими овощами на керамической тарелке", 1670, 1113, "50% 55%"),
  heroMobile: restaurantPhoto("hero-mobile", "Омлет со свежими овощами на керамической тарелке", 920, 1380, "50% 53%"),
  room: restaurantPhoto("room", "Гости за деревянным столом среди зелёных диванов", 1000, 1500, "50% 60%"),
  toast: restaurantPhoto("toast", "Гости поднимают бокалы за столом ресторана", 1000, 1500, "50% 57%"),
  omelette: restaurantPhoto("omelette", "Омлет с овощами и зеленью", 1040, 693),
  syrniki: restaurantPhoto("syrniki", "Сырники с лимонным курдом, меренгой и цветами", 1150, 767),
  porridge: restaurantPhoto("porridge", "Рисовая каша с грушей в белой тарелке", 1060, 707),
  bruschettaBeef: restaurantPhoto("bruschetta-beef", "Брускетта на бриоши с ростбифом и зеленью", 1080, 1080),
  greenSalad: restaurantPhoto("green-salad", "Салат с креветками, брокколи и яйцом пашот", 1080, 1080),
  peaSoup: restaurantPhoto("pea-soup", "Гороховый суп с копчёностями и овощами", 1080, 720),
  duck: restaurantPhoto("duck", "Утиная грудка с картофельным пюре на белой тарелке", 1080, 1080),
  salmon: restaurantPhoto("salmon", "Стейк из сёмги с овощами", 1080, 720),
  filet: restaurantPhoto("filet", "Говяжье филе с брокколи, грибами и пюре", 1080, 720),
  chicken: restaurantPhoto("chicken", "Куриные котлеты с картофельным пюре и брокколи", 1080, 1080),
  eventPreview: restaurantPhoto("event-preview", "Две тарелки с закусками на зелёном диване", 1150, 767),
} as const;
