import { expect, test } from "@playwright/test";
import { BREAKPOINT_EDGE_VIEWPORTS, DESKTOP_NAV_MIN_WIDTH, MOBILE_NAV_MAX_WIDTH } from "../constants/viewports";
import { assertNoPageHorizontalOverflow } from "../utils/layout-assertions";
import { gotoScreenReady } from "../utils/page-ready";
import { UI_SCREENS } from "../constants/screens";

const navProbeScreen = UI_SCREENS.find((s) => s.id === "select-auction")!;

test.describe("Tailwind breakpoint edges", () => {
  for (const viewport of BREAKPOINT_EDGE_VIEWPORTS) {
    test(`no horizontal overflow @ ${viewport.name} (${viewport.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await gotoScreenReady(page, navProbeScreen);
      await assertNoPageHorizontalOverflow(page);
    });
  }

  test("mobile nav toggle below lg (1023px)", async ({ page }) => {
    await page.setViewportSize({ width: MOBILE_NAV_MAX_WIDTH, height: 800 });
    await gotoScreenReady(page, navProbeScreen);
    await expect(page.getByRole("button", { name: "Toggle navigation" })).toBeVisible();
  });

  test("desktop nav at lg (1024px)", async ({ page }) => {
    await page.setViewportSize({ width: DESKTOP_NAV_MIN_WIDTH, height: 800 });
    await gotoScreenReady(page, navProbeScreen);
    await expect(page.getByRole("button", { name: "Toggle navigation" })).toBeHidden();
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
  });

  test("login card uses compact padding below sm (639px)", async ({ page }) => {
    const loginScreen = UI_SCREENS.find((s) => s.id === "login")!;
    await page.setViewportSize({ width: 639, height: 800 });
    await gotoScreenReady(page, loginScreen);
    const card = page.locator("#frmLogin .rounded-3xl").first();
    const paddingBelowSm = await card.evaluate((el) => getComputedStyle(el).paddingLeft);
    expect(paddingBelowSm).toBe("12px");

    await page.setViewportSize({ width: 640, height: 800 });
    await gotoScreenReady(page, loginScreen);
    const paddingAtSm = await card.evaluate((el) => getComputedStyle(el).paddingLeft);
    expect(paddingAtSm).toBe("48px");
  });
});
