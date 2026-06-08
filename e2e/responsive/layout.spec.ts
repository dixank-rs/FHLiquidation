import { test } from "@playwright/test";
import { UI_SCREENS } from "../constants/screens";
import { VIEWPORTS } from "../constants/viewports";
import { assertScreenLayout } from "../utils/layout-assertions";
import { gotoScreenReady } from "../utils/page-ready";

for (const screen of UI_SCREENS) {
  for (const viewport of VIEWPORTS) {
    test(`layout: ${screen.id} @ ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await gotoScreenReady(page, screen);
      await assertScreenLayout(page, screen, viewport);
    });
  }
}
