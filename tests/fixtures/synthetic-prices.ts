// Only imported by Playwright. These amounts and names do not describe the restaurant.
export const syntheticPricePreview = {
  label: "Синтетические тестовые цены",
  items: [
    { title: "Тестовая позиция с короткой ценой", priceKopecks: 9500, display: "95 ₽" },
    { title: "Тестовая позиция с длинным названием для переноса строки", priceKopecks: 125050, display: "1 250,5 ₽" },
    { title: "Тестовая позиция с четырьмя цифрами", priceKopecks: 999999, display: "9 999,99 ₽" },
    { title: "Тестовая позиция с группировкой разрядов", priceKopecks: 12345678, display: "123 456,78 ₽" },
  ],
} as const;
