import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { dishPrice, menuDishes } from "../components/public/menu-catalog";
import { selectionSummary } from "../components/public/menu-selection";
import { syntheticPricePreview } from "./fixtures/synthetic-prices";

test("кнопки главной открывают соответствующее меню", async ({ page }) => {
  for (const [name, path, title] of [
    ["Смотреть меню", "/menu", "Меню"],
    ["Смотреть всё меню", "/menu", "Меню"],
    ["Смотреть завтраки", "/breakfast", "Завтраки"],
  ]) {
    await page.goto("/");
    await page.getByRole("link", { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole("heading", { name: title, level: 1 })).toBeVisible();
    await page.getByRole("link", { name: "На главную", exact: false }).click();
    await expect(page).toHaveURL(/\/#(?:menu|breakfast)$/);
  }
});

test("настольное меню фильтрует блюда и восстанавливает выбранное блюдо", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/menu");
  const list = page.getByRole("list", { name: "Блюда" });
  const details = page.locator(".menu-spread article");
  await expect(details.getByRole("heading", { name: "Филе миньон" })).toBeVisible();
  await expect(list.getByRole("button")).toHaveCount(4);
  await page.getByRole("button", { name: "Закуски", exact: true }).click();
  await expect(list.getByRole("button")).toHaveCount(1);
  await expect(list.getByRole("button", { name: "Тартар из говядины", exact: true })).toBeVisible();
  await expect(details.getByText("Цена уточняется", { exact: true })).toBeVisible();
  const image = details.getByRole("img");
  await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
  await expect(image).toHaveAttribute("src", /dish-tartare/);
  await page.getByRole("button", { name: "Все блюда", exact: true }).click();
  const search = page.getByRole("searchbox", { name: "Найти блюдо" });
  await search.fill("КАПЕРСЫ трюфель");
  await expect(list.getByRole("button", { name: "Тартар из говядины" })).toBeVisible();
  await search.fill("нет такого блюда");
  await expect(page.getByText("По этому запросу блюд нет.")).toBeVisible();
  await page.getByRole("button", { name: "Сбросить поиск и фильтр" }).click();
  await list.getByRole("button", { name: "Огуречный лимонад" }).click();
  await expect(page).toHaveURL(/dish=lemonade$/);
  await page.reload();
  await expect(details.getByRole("heading", { name: "Огуречный лимонад" })).toBeVisible();
  await details.getByRole("button", { name: "Закрыть блюдо" }).click();
  await expect(details).toHaveCount(0);
  await expect(list.getByRole("button", { name: "Огуречный лимонад" })).toBeFocused();
  await page.goBack();
  await expect(details.getByRole("heading", { name: "Огуречный лимонад" })).toBeVisible();
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(result.violations).toEqual([]);
});

test("мобильные завтраки раскрываются под блюдом и сохраняют общий выбор", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/breakfast");
  const list = page.getByRole("list", { name: "Блюда" });
  await expect(list.getByRole("article")).toHaveCount(0);
  const row = list.getByRole("button", { name: "Полента со шпинатом и страчателлой" });
  await row.click();
  const details = row.locator("xpath=following-sibling::article");
  await expect(details.getByRole("heading", { name: "Полента со шпинатом и страчателлой" })).toBeVisible();
  const photo = details.getByRole("img");
  await expect(photo).toHaveAttribute("src", /breakfast-polenta/);
  await expect.poll(() => photo.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
  await details.getByRole("button", { name: "В мой выбор" }).click();
  await details.getByRole("button", { name: "Закрыть блюдо" }).click();
  await expect(details).toHaveCount(0);
  await expect(row).toHaveAttribute("aria-expanded", "false");

  await page.getByRole("button", { name: "Каши", exact: true }).click();
  await list.getByRole("button", { name: "Рисовая каша с клубникой" }).click();
  await expect(list.getByRole("img")).toHaveAttribute("src", /breakfast-rice-porridge/);
  await page.setViewportSize({ width: 320, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(result.violations).toEqual([]);

  await page.getByRole("navigation", { name: "Разделы меню" }).getByRole("link", { name: "Меню", exact: true }).click();
  await expect(page).toHaveURL(/\/menu$/);
  await page.getByRole("button", { name: "Мой выбор" }).click();
  const selection = page.getByRole("dialog", { name: "Мой выбор" });
  await expect(selection.getByText("Полента со шпинатом и страчателлой")).toBeVisible();
  await selection.getByRole("button", { name: /Добавить порцию.*Полента/ }).click();
  await expect(selection.getByText("Порций с неуточнённой ценой: 2")).toBeVisible();
  await expect(selection.getByText("Итого")).toHaveCount(0);
  await selection.getByRole("button", { name: /Убрать из выбора.*Полента/ }).click();
  await expect(selection.getByText("Здесь можно сохранить блюда из обоих меню.")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(selection).toBeHidden();
  await expect(page.getByRole("button", { name: "Мой выбор" })).toBeFocused();
});

test("сумма использует актуальные известные цены в целых копейках", () => {
  for (const item of syntheticPricePreview.items) {
    expect(dishPrice(item.priceKopecks).replace(/[\u00a0\u202f]/g, " ")).toBe(item.display);
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
