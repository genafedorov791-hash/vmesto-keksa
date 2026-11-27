import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const viewports = [
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 390, height: 844 },
  { width: 360, height: 800 },
] as const;

async function expectNoHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
}

for (const viewport of viewports) {
  test(`главная и кадрирование ${viewport.width}×${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: "Вместо Кекса" })).toBeVisible();

    const cover = page.locator(".home-hero__image");
    await expect.poll(() => cover.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    const file = viewport.width < 770 ? /\/hero-mobile(?:-\d+)?\.webp$/ : /\/hero(?:-\d+)?\.webp$/;
    expect(await cover.evaluate((img: HTMLImageElement) => new URL(img.currentSrc).pathname)).toMatch(file);
    const before = await cover.boundingBox();
    await page.evaluate(() => document.fonts.ready);
    expect(await cover.boundingBox()).toEqual(before);
    for (const name of ["Смотреть меню", "Забронировать столик"]) {
      const button = page.getByRole("link", { name, exact: true });
      await expect(button).toBeInViewport();
      expect((await button.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    }

    await expectNoHorizontalOverflow(page);
    for (const id of ["menu", "breakfast", "about", "booking", "contacts"]) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
    expect(errors).toEqual([]);
  });
}

test("главная ведёт в меню, завтраки, афишу и к форме", async ({ page }) => {
  await page.goto("/");
  const homeLinks = [
    ["Смотреть меню", "/menu"],
    ["Смотреть всё меню", "/menu"],
    ["Смотреть завтраки", "/breakfast"],
    ["Смотреть афишу", "/events"],
  ];
  for (const [label, path] of homeLinks) {
    await page.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await page.goBack();
  }
  await page.getByRole("link", { name: "Забронировать столик", exact: true }).click();
  await expect(page).toHaveURL(/#booking$/);
  await expect(page.getByLabel("Дата", { exact: true })).toBeVisible();
});

test("мобильная навигация и фотогалерея доступны с клавиатуры", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const opener = page.getByRole("button", { name: "Открыть меню", exact: true });
  await opener.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Меню сайта" });
  await expect(dialog.getByRole("link", { name: "Афиша", exact: true })).toHaveAttribute("href", "/events");
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
  await page.keyboard.press("Enter");
  await dialog.getByRole("link", { name: "О ресторане", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#about")).toBeFocused();
  const photo = page.locator(".gallery-item").first();
  await photo.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "За столом" })).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("dialog", { name: "Тост" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(photo).toBeFocused();
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
  const sources = page.getByRole("button", { name: "Источники" });
  await sources.click({ trial: true });
  const dock = page.getByRole("navigation", { name: "Быстрые действия" });
  expect((await sources.boundingBox())!.y + (await sources.boundingBox())!.height).toBeLessThanOrEqual((await dock.boundingBox())!.y);
});

test("форма проверяет поля и честно завершает локальный сценарий", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-11-27T09:00:00+03:00"));
  await page.setViewportSize({ width: 390, height: 844 });
  const writes: string[] = [];
  page.on("request", (request) => {
    if (!["GET", "HEAD"].includes(request.method())) writes.push(request.url());
  });
  await page.goto("/#booking");
  const section = page.locator("#booking");
  const date = section.getByLabel("Дата", { exact: true });
  const time = section.getByLabel("Время", { exact: true });
  const next = section.getByRole("button", { name: "Далее", exact: true });
  await next.click();
  await expect(date).toBeFocused();
  await date.fill("2026-11-26");
  await time.fill("14:30");
  await next.click();
  await expect(date).toHaveAttribute("aria-invalid", "true");
  await date.fill("2026-11-28");
  await next.click();
  await section.getByRole("radio", { name: "Тихое место" }).check();
  await section.getByRole("button", { name: "Назад" }).click();
  await expect(date).toHaveValue("2026-11-28");
  await next.click();
  await section.getByRole("button", { name: "Пропустить" }).click();
  const submit = section.getByRole("button", { name: "Завершить" });
  await submit.click();
  await expect(section.getByLabel("Имя", { exact: true })).toBeFocused();
  await section.getByRole("button", { name: "Заполнить пример" }).click();
  await section.getByRole("checkbox", { name: "Я использую только тестовые данные" }).check();
  await submit.click();
  await expect(section.getByRole("heading", { name: "Заявка не отправлена" })).toBeVisible();
  expect(writes).toEqual([]);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
});

test("контраст, ориентиры и имена элементов на главной", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(result.violations).toEqual([]);
});

test("фотография блюда сообщает об ошибке загрузки", async ({ page }) => {
  await page.route("**/_next/image?*", (route) => {
    const asset = new URL(route.request().url()).searchParams.get("url");
    return asset?.endsWith("/green-salad.webp") ? route.abort() : route.continue();
  });
  await page.goto("/");
  await expect(page.locator("#menu").getByText("Фотография недоступна")).toBeVisible();
});
