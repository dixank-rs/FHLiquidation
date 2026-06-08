import { expect, test } from "@playwright/test";
import { SAMPLE_AUCTION_ID, UI_SCREENS } from "../constants/screens";
import { assertNoPageHorizontalOverflow } from "../utils/layout-assertions";
import { gotoScreenReady } from "../utils/page-ready";

const mobileViewport = { width: 375, height: 812 };

test.describe("Responsive interactions", () => {
  test("mobile navigation opens and closes", async ({ page }) => {
    const screen = UI_SCREENS.find((s) => s.id === "select-auction")!;
    await page.setViewportSize(mobileViewport);
    await gotoScreenReady(page, screen);

    const toggle = page.getByRole("button", { name: "Toggle navigation" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("button", { name: "Administration" }).click();
    await expect(page.getByRole("link", { name: "Users" })).toBeVisible();

    await page.getByRole("link", { name: "Users" }).click();
    await expect(page).toHaveURL(/\/users$/);
    await expect(page.getByRole("heading", { name: /^Users$/i })).toBeVisible();
    await assertNoPageHorizontalOverflow(page);
  });

  test("users delete modal fits mobile viewport", async ({ page }) => {
    const screen = UI_SCREENS.find((s) => s.id === "users")!;
    await page.setViewportSize(mobileViewport);
    await gotoScreenReady(page, screen);

    const deleteButton = page.locator("table").getByRole("button", { name: "Delete user" }).first();
    await deleteButton.scrollIntoViewIfNeeded();
    await expect(deleteButton).toBeEnabled();
    await deleteButton.evaluate((el) => (el as HTMLButtonElement).click());
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Confirm" })).toBeVisible();

    const dialogBox = await dialog.boundingBox();
    expect(dialogBox).not.toBeNull();
    expect(dialogBox!.width).toBeLessThanOrEqual(mobileViewport.width);
    await assertNoPageHorizontalOverflow(page);

    await dialog.getByLabel("Close").click();
    await expect(dialog).toBeHidden();
  });

  test("auction images lightbox fits mobile viewport", async ({ page }) => {
    const screen = UI_SCREENS.find((s) => s.id === "auction-images")!;
    await page.setViewportSize(mobileViewport);
    await gotoScreenReady(page, screen);

    await page.getByRole("button", { name: "Open image 1 in viewer" }).click();
    const viewer = page.getByRole("dialog", { name: "Image viewer" });
    await expect(viewer).toBeVisible();

    const viewerBox = await viewer.boundingBox();
    expect(viewerBox).not.toBeNull();
    expect(viewerBox!.width).toBeLessThanOrEqual(mobileViewport.width);
    expect(viewerBox!.height).toBeLessThanOrEqual(mobileViewport.height);
    await assertNoPageHorizontalOverflow(page);

    await page.getByRole("button", { name: "Close" }).click();
    await expect(viewer).toBeHidden();
  });

  test("data tables scroll inside container on mobile", async ({ page }) => {
    const screen = UI_SCREENS.find((s) => s.id === "select-auction")!;
    await page.setViewportSize({ width: 320, height: 568 });
    await gotoScreenReady(page, screen);

    const tableScroller = page.locator(".overflow-x-auto, .overflow-auto").first();
    await expect(tableScroller).toBeVisible();

    const scrollerMetrics = await tableScroller.evaluate((el) => ({
      clientWidth: el.clientWidth,
      scrollWidth: el.scrollWidth,
    }));
    expect(scrollerMetrics.scrollWidth).toBeGreaterThanOrEqual(scrollerMetrics.clientWidth);
    await assertNoPageHorizontalOverflow(page);
  });

  test("login flow navigates to select auction", async ({ page }) => {
    const screen = UI_SCREENS.find((s) => s.id === "login")!;
    await page.setViewportSize(mobileViewport);
    await gotoScreenReady(page, screen);

    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL(/\/auction$/, { timeout: 10_000 });
    await expect(page.getByRole("heading", { name: /Select Auction/i })).toBeVisible();
    await assertNoPageHorizontalOverflow(page);
  });

  test("auction detail links to images route", async ({ page }) => {
    await page.setViewportSize(mobileViewport);
    await gotoScreenReady(page, {
      id: "auction-detail",
      path: `/auction/${SAMPLE_AUCTION_ID}`,
      heading: /Auction Item Details/i,
      layout: "app",
    });

    await page.getByRole("link", { name: "View Images" }).first().click();
    await expect(page).toHaveURL(new RegExp(`/auction/${SAMPLE_AUCTION_ID}/images$`));
    await expect(page.getByRole("heading", { name: /View Images/i })).toBeVisible();
    await assertNoPageHorizontalOverflow(page);
  });
});





