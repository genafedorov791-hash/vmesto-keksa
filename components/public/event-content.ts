import { photos } from "./photo-assets";

export type RestaurantEvent = {
  slug: string;
  title: string;
  date: string;
  dayLabel: string;
  timeLabel: string;
  summary: string;
  description: string;
  photo: keyof typeof photos;
};

export const restaurantEvents: readonly RestaurantEvent[] = [];

export const previewEvent: RestaurantEvent = {
  slug: "uzhin-za-obschim-stolom",
  title: "Ужин за общим столом",
  date: "2026-12-12T19:00:00+03:00",
  dayLabel: "12 декабря",
  timeLabel: "19:00",
  summary: "Вечер в ресторане с подачами на общий стол и разговором о сезонном меню.",
  description: "За одним столом познакомимся с сезонными блюдами и обсудим, как команда ресторана работает с местными продуктами. Вечер рассчитан на небольшую компанию.",
  photo: "eventPreview",
};
