import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page, test } from "@playwright/test";
import { photos } from "../components/public/photo-assets";
import { dishPrice } from "../components/public/site-content";
import { syntheticPricePreview } from "./fixtures/synthetic-prices";

const reviewDirectory = join("docs", "review", "01-homepage-lettering");
const fullPageByteLimit = 700_000;
const requiredViewports = [
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 390, height: 844 },
  { width: 360, height: 800 },
  { width: 768, height: 1024 },
] as const;
const covers = [
  { path: "/", style: "cinema", label: "A", viewports: requiredViewports },
  {
    path: "/preview/editorial", style: "editorial", label: "B",
    viewports: [requiredViewports[0], requiredViewports[2], requiredViewports[3]],
  },
] as const;
const requiredSections = ["menu", "breakfast", "about", "atmosphere", "booking", "contacts"];
const dishNames = [
  "Филе миньон",
  "Тартар из говядины",
  "Наполеон со свежими фруктами",
  "Огуречный лимонад",
];

async function expectNoHorizontalOverflow(page: Page) {
  await expect.poll(() => page.evaluate(() => {
    const viewport = document.documentElement.clientWidth;
    return Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - viewport;
  })).toBeLessThanOrEqual(0);
}

async function expectLocalPhotoLoaded(photo: Locator) {
  await photo.scrollIntoViewIfNeeded();
  await expect(photo).toHaveAttribute("alt", /\S/);
  await expect(photo).toHaveAttribute("sizes", /\S/);
  await expect(photo).toHaveAttribute("srcset", /\S/);

  await expect.poll(() => photo.evaluate((image: HTMLImageElement) => {
    if (!image.complete || image.naturalWidth === 0) return false;
    const source = new URL(image.currentSrc);
    const originalPath = source.pathname === "/_next/image"
      ? source.searchParams.get("url")
      : source.pathname;
    return source.origin === window.location.origin &&
      /^\/assets\/[^?]+\.webp$/i.test(originalPath ?? "");
  })).toBe(true);
}

async function expectHomepagePhotosLoaded(page: Page) {
  const photos = await page.locator("main .photo img:visible").all();
  expect(photos.length).toBe(11);
  const files = new Set<string>();
  for (const photo of photos) {
    await expectLocalPhotoLoaded(photo);
    files.add(await photo.evaluate((image: HTMLImageElement) => {
      const src = new URL(image.currentSrc);
      return src.searchParams.get("url") ?? src.pathname;
    }));
  }
  expect(files.size).toBe(photos.length);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
}

async function expectAxePass(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const violations = results.violations.map(({ id, nodes }) => ({
    id,
    elements: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
  }));
  expect(violations).toEqual([]);
}

async function capture(page: Page, name: string, fullPage = false) {
  if (process.env.CAPTURE_REVIEW !== "1") return;

  const options = { animations: "disabled", caret: "initial", scale: "css" } as const;
  if (!fullPage) {
    await page.screenshot({ ...options, path: join(reviewDirectory, `${name}.png`) });
    return;
  }

  for (const quality of [76, 68, 60, 52, 44]) {
    const image = await page.screenshot({
      ...options,
      fullPage: true,
      type: "jpeg",
      quality,
      // Show the fixed dock at the footer in the full-page capture.
      style: "body { position: relative; } .mobile-dock { position: absolute; }",
    });
    if (image.byteLength <= fullPageByteLimit) {
      await writeFile(join(reviewDirectory, `${name}.jpg`), image);
      return;
    }
  }

  throw new Error(`${name}: full-page screenshot exceeds ${fullPageByteLimit} bytes`);
}

for (const { path, style, label, viewports } of covers) {
  for (const viewport of viewports) {
    test(`обложка ${label} в размере ${viewport.width}×${viewport.height}`, async ({ page, baseURL }) => {
      await page.setViewportSize(viewport);
      const externalRequests: string[] = [];
      const failedResponses: string[] = [];
      const pageErrors: string[] = [];
      page.on("request", (request) => {
        if (!request.url().startsWith(`${baseURL}/`)) externalRequests.push(request.url());
      });
      page.on("response", (response) => {
        if (response.status() >= 400) failedResponses.push(response.url());
      });
      page.on("pageerror", (error) => pageErrors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") {
          const location = message.location().url;
          pageErrors.push(location ? `${location}: ${message.text()}` : message.text());
        }
      });

      const response = await page.goto(path);
      expect(response?.ok()).toBe(true);
      await expect(page.locator("html")).toHaveAttribute("lang", "ru");
      await expect(page.locator(".hero")).toHaveClass(`hero hero--${style}`);
      await expect(page.locator("main h1")).toHaveCount(1);
      await expect(page.getByRole("heading", { level: 1, name: /Вместо\s+Кекса/i })).toBeVisible();
      const bookingCTA = page.getByRole("main").getByRole("link", { name: "Забронировать столик" }).first();
      await expect(bookingCTA).toBeInViewport();
      await expect(bookingCTA).toHaveAttribute("href", "#booking");
      const bookingTarget = await bookingCTA.boundingBox();
      expect(bookingTarget?.width).toBeGreaterThanOrEqual(44);
      expect(bookingTarget?.height).toBeGreaterThanOrEqual(54);
      expect(bookingTarget?.height).toBeLessThanOrEqual(58);
      const menuCTA = page.locator(".hero a[href='#menu']");
      const heroPhoto = page.locator(".hero-photo img");
      await expect(menuCTA).toBeInViewport();
      await expect(heroPhoto).toBeInViewport({ ratio: 0.6 });
      const dock = await page.locator(".mobile-dock").boundingBox();
      if (dock) {
        for (const cta of [bookingCTA, menuCTA]) {
          const box = (await cta.boundingBox())!;
          expect(box.y + box.height).toBeLessThanOrEqual(dock.y + 1);
        }
      }
      const image = (await heroPhoto.boundingBox())!;
      if (style === "cinema") {
        expect(image.x).toBeCloseTo(0, 0);
        expect(image.width).toBeCloseTo(viewport.width, 0);

        const wordmark = page.locator(".hero-wordmark");
        await expect(wordmark).toBeInViewport({ ratio: 1 });
        const bounds = (await wordmark.boundingBox())!;
        expect(bounds.x + bounds.width / 2).toBeCloseTo(viewport.width / 2, 0);
        expect(Math.abs(bounds.y + bounds.height / 2 - viewport.height / 2))
          .toBeLessThan(viewport.height * 0.05);

        const wordsFit = await wordmark.locator("svg").evaluateAll((words) => words.map((word) => {
          const svg = word as SVGSVGElement;
          const drawing = svg.getBBox();
          const frame = svg.viewBox.baseVal;
          return drawing.x >= frame.x && drawing.y >= frame.y &&
            drawing.x + drawing.width <= frame.x + frame.width &&
            drawing.y + drawing.height <= frame.y + frame.height;
        }));
        expect(wordsFit).toEqual([true, true]);

        if (viewport.width > 768) {
          const composition = (await page.locator(".hero-stage").boundingBox())!;
          expect(bounds.width / composition.width).toBeGreaterThanOrEqual(0.8);
          expect(bounds.width / composition.width).toBeLessThanOrEqual(0.9);
        }
      } else {
        const title = (await page.locator(".hero h1").boundingBox())!;
        expect(title.y + title.height).toBeLessThan(image.y);
      }
      await expect(page.getByText("Иллюстративное фото интерьера", { exact: true })).toBeVisible();

      for (const id of requiredSections) await expect(page.locator(`#${id}`)).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await expectNoHorizontalOverflow(page);
      const contacts = page.locator("#contacts");
      await expect(contacts.locator('a[href="tel:+79064640508"]')).toBeVisible();
      await expect(contacts.getByText(/Дзержинского.{0,4}133/i)).toBeVisible();
      await expect(contacts.getByText(/требуется подтверждение/i)).toBeVisible();
      await expect(contacts.getByRole("link", { name: "edagda" })).toHaveAttribute(
        "href",
        "https://edagda.ru/stavropol/restaurant/vmesto-keksa",
      );
      const sectionColors = await page.locator(
        "#about, #menu, #breakfast, #atmosphere, .atmosphere-gallery, #booking, #contacts",
      ).evaluateAll((sections) => sections.map((section) => getComputedStyle(section).backgroundColor));
      const [paper, menu, breakfast, atmosphere, gallery, booking, contactsColor] = sectionColors;
      expect([menu, breakfast, atmosphere]).toEqual([paper, paper, paper]);
      expect([booking, contactsColor]).toEqual([gallery, gallery]);
      expect(paper).not.toEqual(gallery);
      if (style === "editorial") {
        await expect(page.locator(".hero")).toHaveCSS("background-color", paper);
      }
      await expectHomepagePhotosLoaded(page);

      if (style === "cinema" && viewport.width !== 768) {
        const size = `${viewport.width}x${viewport.height}`;
        await capture(page, `hero-a-${size}`);
        await capture(page, `home-a-${size}`, true);
      }
      expect(pageErrors).toEqual([]);
      expect(failedResponses).toEqual([]);
      expect(externalRequests).toEqual([]);
    });
  }
}

test("вариант B сохраняет клавиатурную навигацию, reflow и reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/preview/editorial");
  await expectAxePass(page);

  await page.setViewportSize({ width: 390, height: 844 });
  await expectAxePass(page);
  const opener = page.getByRole("banner").getByRole("button", { name: "Открыть меню" });
  await opener.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
  await page.setViewportSize({ width: 320, height: 800 });
  await expectNoHorizontalOverflow(page);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.getAnimations().some((animation) =>
    Number(animation.effect?.getComputedTiming().endTime ?? 0) > 100,
  ))).toBe(false);
});

test("проверка WCAG на широком экране", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expectAxePass(page);
});

test("если файл фотографии недоступен, видна текстовая замена", async ({ page }) => {
  await page.route(
    (url) => url.pathname === photos.hero.src || url.searchParams.get("url") === photos.hero.src,
    (route) => route.abort(),
  );
  await page.goto("/");
  const heroPhoto = page.locator(".hero-photo");
  await expect(heroPhoto.getByRole("img")).toHaveAccessibleName(/фотография недоступна/i);
  await expect(heroPhoto.getByText("Фотография недоступна", { exact: true })).toBeVisible();
});

test("мобильное меню работает с клавиатуры, анкоры доступны", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expectAxePass(page);

  const opener = page.getByRole("banner").getByRole("button", { name: "Открыть меню" });
  const dialog = page.getByRole("dialog");
  const target = await opener.boundingBox();
  expect(target?.width).toBeGreaterThanOrEqual(44);
  expect(target?.height).toBeGreaterThanOrEqual(44);
  await opener.focus();
  await page.keyboard.press("Enter");
  await expect(dialog).toBeVisible();
  await expectAxePass(page);

  for (const direction of ["Tab", "Shift+Tab"]) {
    for (let press = 0; press < 8; press++) {
      await page.keyboard.press(direction);
      await expect.poll(() => dialog.evaluate((element) =>
        element.contains(document.activeElement))).toBe(true);
    }
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();

  await page.keyboard.press("Enter");
  await dialog.getByRole("link", { name: "Завтраки", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/#breakfast$/);
});

test("галерея открывается с клавиатуры и возвращает фокус", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const gallery = page.locator("#atmosphere");
  const frames = gallery.getByRole("button", { name: /(?:Интерьер|Деталь интерьера|Сервировка)$/ });
  await expect(frames).toHaveCount(3);

  const opener = frames.first();
  await opener.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Интерьер", exact: true })).toBeVisible();
  const activePhoto = dialog.getByRole("img");
  await expectLocalPhotoLoaded(activePhoto);
  const firstPhoto = await activePhoto.getAttribute("src");
  await expectAxePass(page);
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByRole("heading", { name: "Деталь интерьера", exact: true })).toBeVisible();
  await expectLocalPhotoLoaded(activePhoto);
  await expect(activePhoto).not.toHaveAttribute("src", firstPhoto ?? "");
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.getByRole("heading", { name: "Интерьер", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test("демо-меню и подробности блюда доступны без внешнего перехода", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const menu = page.locator("#menu");
  const dialog = page.getByRole("dialog");
  const opener = menu.getByRole("button", { name: "Открыть меню", exact: true });
  const dishButtons = dishNames.map((name) => menu.getByRole("button", { name: new RegExp(name) }));
  const dishCards = menu.getByRole("article");
  await expect(dishCards).toHaveCount(dishNames.length);
  for (const [index, card] of (await dishCards.all()).entries()) {
    await expect(card.getByRole("button")).toHaveCount(1);
    await expect(dishButtons[index].getByRole("img")).toBeVisible();
  }
  for (const status of ["Цена уточняется", "Наличие уточняется"]) {
    const statuses = menu.locator(".dish-grid").getByText(status, { exact: true });
    await expect(statuses).toHaveCount(dishNames.length);
    for (const text of await statuses.all()) await expect(text).toBeVisible();
  }
  await expect(menu.getByText(/фотографии иллюстративные/i)).toBeVisible();
  if (process.env.CAPTURE_REVIEW === "1") await expectHomepagePhotosLoaded(page);

  await opener.click();
  await expect(dialog.getByRole("heading", { name: "Меню", exact: true })).toBeVisible();
  await expectAxePass(page);
  await capture(page, "menu-interaction-1280x800");
  await dialog.getByRole("button", { name: "Закрыть", exact: true }).click();
  await expect(opener).toBeFocused();

  const dish = dishButtons[0];
  await dish.getByRole("img").click();
  await expect(dialog.getByRole("heading", { name: dishNames[0], exact: true })).toBeVisible();
  await expectLocalPhotoLoaded(dialog.getByRole("img"));
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(dish).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(dialog.getByRole("heading", { name: dishNames[0], exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(dish).toBeFocused();
  await expect(page).toHaveURL(/\/$/);
});

test("выравнивание цен в демо-меню с синтетическими данными", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator("#menu").getByRole("button", { name: "Открыть меню", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Меню", exact: true });
  await expect(dialog.locator(".preview-menu__price")).toHaveText(dishNames.map(() => "Цена уточняется"));

  const previewPrices = syntheticPricePreview.items.map((item) => {
    const formatted = dishPrice(item.priceKopecks);
    expect(formatted.replace(/[\u00a0\u202f]/g, " ")).toBe(item.display);
    return { title: item.title, formatted };
  });

  await dialog.evaluate((element, { label, items }) => {
    const note = element.querySelector(".dialog-heading + p")!;
    note.textContent = label;
    element.querySelectorAll(".preview-menu li").forEach((row, index) => {
      row.querySelector(".preview-menu__name")!.textContent = items[index].title;
      row.querySelector(".preview-menu__price")!.textContent = items[index].formatted;
    });
  }, { label: syntheticPricePreview.label, items: previewPrices });

  await expect(dialog.getByText(syntheticPricePreview.label, { exact: true })).toBeVisible();

  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({ width, height: 800 });
    await expectNoHorizontalOverflow(page);
    const aligned = await dialog.locator(".preview-menu li").evaluateAll((rows) => rows.map((row) => {
      const name = row.querySelector(".preview-menu__name")!;
      const price = row.querySelector(".preview-menu__price")!;
      const bounds = row.getBoundingClientRect();
      const nameBounds = name.getBoundingClientRect();
      const priceBounds = price.getBoundingClientRect();
      return Math.abs(nameBounds.left - bounds.left) < 1 &&
        Math.abs(priceBounds.right - bounds.right) < 1 &&
        nameBounds.right <= priceBounds.left &&
        ["start", "left"].includes(getComputedStyle(name).textAlign) &&
        ["end", "right"].includes(getComputedStyle(price).textAlign);
    }));
    expect(aligned).toEqual([true, true, true, true]);
  }
});

test("форма демонстрирует валидацию, шаги и завершение без отправки", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-11-25T09:00:00+03:00"));
  await page.setViewportSize({ width: 390, height: 844 });
  const writes: string[] = [];
  page.on("request", (request) => {
    if (!["GET", "HEAD"].includes(request.method())) {
      writes.push(`${request.method()} ${request.url()}`);
    }
  });
  await page.goto("/");
  const section = page.locator("#booking");
  const date = section.getByLabel("Дата", { exact: true });
  const time = section.getByLabel("Время", { exact: true });
  const next = section.getByRole("button", { name: "Далее", exact: true });
  const back = section.getByRole("button", { name: "Назад", exact: true });

  await next.click();
  await expect(section.getByText("Выберите дату.", { exact: true })).toBeVisible();
  await expect(date).toBeFocused();
  await section.getByLabel("Гостей", { exact: true }).selectOption("3");
  await date.fill("2026-11-24");
  await time.fill("14:30");
  await next.click();
  await expect(date).toBeFocused();
  await expect(date).toHaveAttribute("aria-invalid", "true");
  await date.fill("2026-11-26");
  await next.click();
  await expect(section.getByRole("heading", { name: "Где вам будет уютнее?" })).toBeFocused();
  await section.getByRole("radio", { name: "Тихое место" }).check();
  await back.click();
  await expect(section.getByLabel("Гостей", { exact: true })).toHaveValue("3");
  await expect(date).toHaveValue("2026-11-26");
  await expect(time).toHaveValue("14:30");
  await next.click();
  await expect(section.getByRole("radio", { name: "Тихое место" })).toBeChecked();
  await section.getByRole("button", { name: "Пропустить", exact: true }).click();
  await expect(section.getByRole("heading", { name: "Как связаться с гостем?" })).toBeFocused();

  const submit = section.getByRole("button", { name: "Завершить демонстрацию" });
  await expectAxePass(page);
  await submit.scrollIntoViewIfNeeded();
  await capture(page, "booking-interaction-390x844");
  await submit.click();
  await expect(section.getByLabel("Имя", { exact: true })).toBeFocused();
  await expect(section.getByLabel("Телефон", { exact: true })).toHaveAttribute("aria-invalid", "true");
  await expectAxePass(page);
  await section.getByRole("button", { name: "Подставить тестовые данные" }).click();
  await submit.click();
  await expect(section.getByText("Подтвердите использование тестовых данных.")).toBeVisible();
  await section.getByRole("checkbox", { name: "Я использую только тестовые данные" }).check();
  await submit.click();
  await expect(section.getByRole("heading", { name: "Демонстрация завершена" })).toBeVisible();
  await expect(section.getByText(/не отправлен/).first()).toBeVisible();
  expect(writes).toEqual([]);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
  await section.getByRole("button", { name: "Начать заново" }).click();
  await expect(date).toHaveValue("");
});

test("при эквиваленте масштаба 200% ширина макета адаптируется и движение сокращается", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  // 720 CSS px corresponds to the layout width of a 1440px window at 200% zoom.
  // 320 CSS px exercises the WCAG reflow width.
  for (const width of [720, 320]) {
    await page.setViewportSize({ width, height: 800 });
    await expectNoHorizontalOverflow(page);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const preferences = await page.evaluate(() => ({
      matches: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      scroll: getComputedStyle(document.documentElement).scrollBehavior,
      longAnimations: document.getAnimations().filter((animation) =>
        Number(animation.effect?.getComputedTiming().endTime ?? 0) > 100,
      ).length,
    }));
    expect(preferences).toEqual({ matches: true, scroll: "auto", longAnimations: 0 });
  }
});

test.describe("мобильная безопасная область", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });

  test("нижняя панель учитывает системный отступ и оставляет подвал доступным", async ({ page, context }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const cdp = await context.newCDPSession(page);
    const safeAreaBottom = 34;
    await cdp.send("Emulation.setSafeAreaInsetsOverride", { insets: { bottom: safeAreaBottom } });
    await page.goto("/");
    const dock = page.getByRole("navigation", { name: "Быстрые действия" });
    const dockActions = [
      dock.locator('a[href="tel:+79064640508"]'),
      dock.getByRole("link", { name: "Меню" }),
      dock.getByRole("link", { name: "Бронь" }),
    ];
    await expect(dock).toBeVisible();
    for (const action of dockActions) {
      const box = await action.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
      expect(box && box.y + box.height).toBeLessThanOrEqual(844 - safeAreaBottom + 1);
    }
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const footerButton = page.getByRole("button", { name: "Политика и согласие" });
    await expect(footerButton).toBeInViewport();
    await footerButton.click({ trial: true });
    await expectNoHorizontalOverflow(page);
  });
});
