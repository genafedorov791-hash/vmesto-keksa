import type { Metadata } from "next";
import { MenuBook } from "../../../components/public/menu-book";

export const metadata: Metadata = {
  title: "Завтраки — Вместо Кекса",
  description: "Интерактивная демонстрационная карта завтраков гастробистро «Вместо Кекса».",
};

export default function BreakfastPage() {
  return <MenuBook kind="breakfast" />;
}
