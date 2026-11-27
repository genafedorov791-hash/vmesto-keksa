import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const viewport of [{ width: 1280, height: 800 }, { width: 360, height: 800 }]) {
  test(`афиша и отдельное превью события ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/events");
    await expect(page.getByRole("heading", { name: "Афиша" })).toBeVisible();
    await expect(page.getByText("Ближайшие события пока не объявлены.")).toBeVisible();
    await expect(page.getByText("Ужин за общим столом")).toHaveCount(0);
    await page.goto("/preview/events");
    await expect(page.getByText("Превью · тестовые данные")).toBeVisible();
    await page.getByRole("link", { name: /Ужин за общим столом/ }).click();
    await expect(page.getByRole("heading", { name: "Ужин за общим столом" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Записаться" })).toBeDisabled();
    await expect(page.locator("main time")).toHaveAttribute("datetime", "2026-12-12T19:00:00+03:00");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(result.violations).toEqual([]);
    await page.getByRole("link", { name: /К афише/ }).click();
    await expect(page).toHaveURL(/\/preview\/events$/);
    const response = await page.goto("/events/uzhin-za-obschim-stolom");
    expect(response?.status()).toBe(404);
  });
}
