import type { Metadata } from "next";
import { MenuBook } from "../../../components/public/menu-book";

export const metadata: Metadata = {
  title: "Меню ресторана «Вместо Кекса»",
  description: "Блюда ресторана «Вместо Кекса».",
};

export default function MenuPage() {
  return <MenuBook kind="main" />;
}
