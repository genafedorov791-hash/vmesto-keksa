import type { Metadata, Viewport } from "next";
import { HomePage } from "../../../../components/public/home-page";

export const metadata: Metadata = {
  title: "Ресторан «Вместо Кекса»",
  description: "Ресторан «Вместо Кекса» в Ставрополе.",
};

export const viewport: Viewport = {
  themeColor: "#F0E8D9",
  viewportFit: "cover",
};

export default function EditorialPreview() {
  return <HomePage variant="editorial" />;
}
