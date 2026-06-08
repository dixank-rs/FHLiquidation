import { expect, type Page } from "@playwright/test";
import type { ScreenDefinition } from "../constants/screens";

export async function gotoScreenReady(page: Page, screen: ScreenDefinition): Promise<void> {
  await page.goto(screen.path, { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: screen.heading })).toBeVisible();

  if (screen.layout === "app") {
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.locator('header nav[aria-label="Main navigation"]')).toHaveCount(1);
  }

  await page.evaluate(async () => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
  });

  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {
    /* mock/static pages may keep connections open */
  });
}
