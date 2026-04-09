import { expect, test } from "@playwright/test";

test.describe("Docs mobile experience", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test("contributing links to principles and renders principles content", async ({
    page,
  }) => {
    await page.goto("/docs/contributing", { waitUntil: "load" });
    await page.locator("main").waitFor({ state: "visible" });

    await page.getByRole("link", { name: /principle 15/i }).click();

    await expect(page).toHaveURL(/\/docs\/principles$/);
    await expect(
      page.getByText(/These principles were developed/i),
    ).toBeVisible();
  });

  test("docs pages render stable mobile snapshots", async ({ page }) => {
    await page.goto("/docs/contributing", { waitUntil: "load" });
    await page.locator("main").waitFor({ state: "visible" });
    await expect(page).toHaveScreenshot("docs-contributing-mobile.png", {
      fullPage: true,
      animations: "disabled",
    });

    await page.goto("/docs/principles", { waitUntil: "load" });
    await page.locator("main").waitFor({ state: "visible" });
    await expect(page).toHaveScreenshot("docs-principles-mobile.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("all docs keep mobile viewport layout", async ({ page }) => {
    await page.goto("/docs", { waitUntil: "load" });
    await page.locator("main").waitFor({ state: "visible" });

    const links = await page
      .locator("a[href^='/docs/']")
      .evaluateAll((anchors) =>
        anchors.map((anchor) => (anchor as HTMLAnchorElement).pathname),
      );
    const docPaths = Array.from(new Set(links)).filter(
      (href) => href !== "/docs",
    );

    for (const docPath of docPaths) {
      await page.goto(docPath, { waitUntil: "load" });
      await page.locator("main").waitFor({ state: "visible" });

      const dimensions = await page.evaluate(() => {
        const root = document.documentElement;
        return {
          clientWidth: root.clientWidth,
          scrollWidth: root.scrollWidth,
        };
      });

      expect(dimensions.scrollWidth).toBeLessThanOrEqual(
        dimensions.clientWidth + 1,
      );
    }
  });
});
