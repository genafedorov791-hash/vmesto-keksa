import type { Metadata } from "next";
import { MenuBook } from "../../../components/public/menu-book";

export const metadata: Metadata = {
  title: "Меню — Вместо Кекса",
  description: "Интерактивная демонстрационная карта блюд гастробистро «Вместо Кекса».",
};

export default function MenuPage() {
  return <MenuBook kind="main" />;
}
