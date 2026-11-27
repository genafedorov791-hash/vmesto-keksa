import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./fonts.css";
import "./globals.css";
import "./cover.css";

export const metadata: Metadata = {
  title: "Ресторан «Вместо Кекса» в Ставрополе",
  description: "Меню, завтраки и контакты ресторана «Вместо Кекса» в Ставрополе.",
  icons: { icon: "/assets/restaurant/mark.png" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#F7F4EB",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preload" href="/assets/fonts/cormorant-cyrillic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/fonts/cormorant-italic-cyrillic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/fonts/onest-cyrillic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
