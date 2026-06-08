import { expect, type Page } from "@playwright/test";
import {
  DESKTOP_NAV_MIN_WIDTH,
  MOBILE_NAV_MAX_WIDTH,
  type ViewportSize,
} from "../constants/viewports";
import type { ScreenDefinition } from "../constants/screens";

const OVERFLOW_TOLERANCE_PX = 1;

export async function assertNoPageHorizontalOverflow(page: Page): Promise<void> {
  const overflowPx = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth - doc.clientWidth;
  });
  expect(
    overflowPx,
    `Page horizontal overflow: ${overflowPx}px (tolerance ${OVERFLOW_TOLERANCE_PX}px)`,
  ).toBeLessThanOrEqual(OVERFLOW_TOLERANCE_PX);
}

export async function assertMainContentBelowFixedHeader(page: Page): Promise<void> {
  const main = page.locator("main").first();
  await expect(main).toBeVisible();

  const paddingTop = await main.evaluate((el) => Number.parseFloat(getComputedStyle(el).paddingTop));
  expect(paddingTop).toBeGreaterThanOrEqual(80);
}

export async function assertAuthScreenLayout(page: Page): Promise<void> {
  await expect(page.getByRole("button", { name: "Toggle navigation" })).toHaveCount(0);
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
}

export async function assertAppChromeForViewport(
  page: Page,
  viewport: ViewportSize,
): Promise<void> {
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.locator('header nav[aria-label="Main navigation"]')).toHaveCount(1);

  const navToggle = page.getByRole("button", { name: "Toggle navigation" });

  if (viewport.width <= MOBILE_NAV_MAX_WIDTH) {
    await expect(navToggle).toBeVisible();
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeHidden();
  } else if (viewport.width >= DESKTOP_NAV_MIN_WIDTH) {
    await expect(navToggle).toBeHidden();
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
  }
}

export async function assertScreenLayout(
  page: Page,
  screen: ScreenDefinition,
  viewport: ViewportSize,
): Promise<void> {
  await assertNoPageHorizontalOverflow(page);

  if (screen.layout === "auth") {
    await assertAuthScreenLayout(page);
    return;
  }

  await assertAppChromeForViewport(page, viewport);
  await assertMainContentBelowFixedHeader(page);
}
