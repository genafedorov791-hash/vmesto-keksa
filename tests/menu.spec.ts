import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { dishPrice, menuAdditions, menuDishes } from "../components/public/menu-catalog";
import { selectionSummary } from "../components/public/menu-selection";
import { syntheticPricePreview } from "./fixtures/synthetic-prices";

test("29 позиций и три добавки совпадают с обеими страницами печатного меню", () => {
  expect(menuDishes.map(({ category, serving, priceKopecks }) => [category, serving?.amount, serving?.unit, priceKopecks])).toEqual([
    ["breakfast", 260, "г", 52000], ["breakfast", 240, "г", 42000], ["breakfast", 290, "г", 49000],
    ["breakfast", 250, "г", 55000], ["breakfast", 230, "г", 42000],
    ["starters", 270, "г", 59000], ["starters", 180, "г", 73000], ["starters", 180, "г", 87000],
    ["starters", 420, "г", 110000], ["starters", 160, "г", 59000], ["starters", 170, "г", 55000],
    ["starters", 140, "г", 45000], ["starters", 210, "г", 42000],
    ["salads", 190, "г", 61000], ["salads", 210, "г", 78000], ["salads", 260, "г", 55000],
    ["soups", 320, "г", 49000], ["soups", 320, "г", 59000], ["soups", 270, "г", 55000], ["soups", 250, "г", 45000],
    ["hot", 400, "г", 175000], ["hot", 270, "г", 79000], ["hot", 340, "г", 145000],
    ["hot", 160, "г", 54000], ["hot", 210, "г", 72000], ["hot", 230, "г", 64000],
    ["children", 240, "г", 52000], ["children", 200, "г", 47000], ["bread", 4, "кусочка", 15000],
  ]);
  expect(menuAdditions.map(({ serving, priceKopecks }) => [serving.amount, priceKopecks])).toEqual([
    [50, 8000], [50, 17000], [50, 19000],
  ]);
});

test("десктоп показывает выход и цены, сохраняет поиск, фильтр и прямую ссылку", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/menu");
  const rows = page.locator(".menu-row");
  await expect(rows).toHaveCount(29);
  await expect(page.getByText(/Если у вас имеется аллергия/)).toBeVisible();
  await page.getByRole("button", { name: "Закуски", exact: true }).click();
  await expect(rows).toHaveCount(8);
  const beef = page.getByRole("button", { name: /Брускетта.*ростбифом/ });
  await expect(beef).toContainText("170 г");
  await expect(beef).toContainText("550 ₽");
  const salmon = page.getByRole("button", { name: /Брускетта.*с сёмгой/ });
  await expect(salmon).toContainText("160 г");
  await expect(salmon).toContainText("590 ₽");
  await page.getByRole("button", { name: "Все блюда", exact: true }).click();
  const search = page.getByRole("searchbox", { name: "Найти блюдо" });
  await search.fill("сёмгой авокадо");
  await expect(rows).toHaveCount(1);
  await expect(salmon).toBeVisible();
  await search.fill("нет такого блюда");
  await expect(page.getByText("По этому запросу блюд нет.")).toBeVisible();
  await page.getByRole("button", { name: "Сбросить поиск и фильтр" }).click();
  await page.getByRole("button", { name: /Крем-суп из брокколи/ }).click();
  await expect(page).toHaveURL(/dish=broccoli-soup$/);
  await page.reload();
  const detail = page.locator(".menu-feature article");
  await expect(detail.getByRole("heading", { name: "Крем-суп из брокколи" })).toBeVisible();
  await expect(detail.locator("img")).toHaveCount(0);
  await detail.getByRole("button", { name: "Закрыть блюдо" }).click();
  await expect(detail).toHaveCount(0);
  await page.goBack();
  await expect(detail.getByRole("heading", { name: "Крем-суп из брокколи" })).toBeVisible();
});

test("на телефоне подробности под блюдом, выбор и добавки общие", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/breakfast");
  await expect(page.locator(".menu-row")).toHaveCount(5);
  const omelette = page.locator("#menu-row-omelette");
  await expect(omelette).toContainText("240 г");
  await expect(omelette).toContainText("420 ₽");
  await omelette.click();
  const detail = omelette.locator("xpath=following-sibling::article");
  await expect(detail.getByRole("heading", { name: "Омлет", exact: true })).toBeVisible();
  const addition = detail.getByRole("button", { name: "Добавка: Курица сувид" });
  await expect(addition).toBeDisabled();
  await detail.getByRole("button", { name: "В мой выбор" }).click();
  await addition.click();
  await detail.getByRole("button", { name: "Закрыть блюдо" }).click();
  await expect(omelette).toBeFocused();
  await page.getByRole("link", { name: "Всё меню" }).click();
  await expect(page.locator("#menu-row-omelette")).toContainText("420 ₽");
  await page.getByRole("button", { name: /Мой выбор/ }).click();
  const selection = page.getByRole("dialog", { name: "Мой выбор" });
  await expect(selection.getByText("500 ₽", { exact: true })).toBeVisible();
  await selection.getByRole("button", { name: /Добавить порцию.*Курица сувид/ }).click();
  await expect(selection.getByText("580 ₽", { exact: true })).toBeVisible();
  await selection.getByRole("button", { name: /Убрать из выбора.*Омлет/ }).click();
  await expect(selection.getByText("Здесь можно сохранить блюда из обоих меню.")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(selection).toBeHidden();
});

for (const viewport of [{width: 1440, height: 900}, {width: 390, height: 844}]) {
  test(`доступность меню и завтраков ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const route of ["/menu?dish=coconut-rice-porridge", "/breakfast?dish=omelette"]) {
      await page.goto(route);
      await expect(page.locator("#menu-dish-panel")).toBeVisible();
      const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(result.violations).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
    }
  });
}

test("сумма использует актуальные известные цены в целых копейках", () => {
  for (const item of syntheticPricePreview.items) {
    expect(dishPrice(item.priceKopecks)?.replace(/[\u00a0\u202f]/g, " ")).toBe(item.display);
  }
  const catalog = menuDishes.slice(0, 4).map((dish, index) => ({
    ...dish,
    priceKopecks: [105050, null, 25000, 0][index],
    availability: index === 2 ? "sold-out" as const : "available" as const,
  }));
  const saved = JSON.stringify(catalog.map(({ id }) => ({ id, quantity: 2, priceKopecks: 100000, availability: "available" })));
  const result = selectionSummary(saved, catalog);
  expect(result).toMatchObject({ total: 210100, priced: 4, missingPrice: 2, unavailable: 2, count: 8 });
  expect(result.items[0].priceChanged).toBe(true);
  expect(result.items[2].availabilityChanged).toBe(true);
  expect(selectionSummary("{").count).toBe(0);
});
