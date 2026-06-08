import { expect, test } from "@playwright/test";

test("login page loads", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Welcome back!" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
});

test("auction list loads after login redirect path", async ({ page }) => {
  await page.goto("/auction");
  await expect(page.getByRole("heading", { level: 1, name: "Select Auction" })).toBeVisible();
});
