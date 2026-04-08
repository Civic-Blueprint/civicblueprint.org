import { expect, test } from "@playwright/test";

test.describe("Homepage visual snapshots", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.locator("main").waitFor({ state: "visible" });
  });

  test("desktop 1440", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page).toHaveScreenshot("home-desktop.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("tablet 768", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    await expect(page).toHaveScreenshot("home-tablet.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("mobile 390", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page).toHaveScreenshot("home-mobile.png", {
      fullPage: true,
      animations: "disabled",
    });
  });
});
