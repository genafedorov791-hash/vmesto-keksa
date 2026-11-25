import type { Metadata, Viewport } from "next";
import { HomePage } from "../../../../components/public/home-page";

export const metadata: Metadata = {
  title: "Вместо Кекса — редакционная обложка",
  description: "Локальный вариант первого экрана гастробистро «Вместо Кекса».",
};

export const viewport: Viewport = {
  themeColor: "#F0E8D9",
  viewportFit: "cover",
};

export default function EditorialPreview() {
  return <HomePage variant="editorial" />;
}
