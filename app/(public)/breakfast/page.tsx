import type { Metadata } from "next";
import { MenuBook } from "../../../components/public/menu-book";

export const metadata: Metadata = {
  title: "Завтраки ресторана «Вместо Кекса»",
  description: "Меню завтраков ресторана «Вместо Кекса».",
};

export default function BreakfastPage() {
  return <MenuBook kind="breakfast" />;
}
