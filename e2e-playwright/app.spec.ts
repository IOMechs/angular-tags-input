import { test, expect } from "@playwright/test";

test("should display welcome message", async ({ page }) => {
  // Navigate to the base URL defined in playwright.config.ts
  await page.goto("/");

  // Find the title element using the same selector as the old Protractor test
  const titleElement = page.locator("tid-root .content span");

  // Assert that the element has the expected text
  await expect(titleElement).toHaveText("@iomechs/angular-tags-input");

  // Note: Playwright automatically checks for console errors.
  // The afterEach logic from Protractor for checking SEVERE logs is generally not needed
  // unless you have specific error conditions to assert.
});
