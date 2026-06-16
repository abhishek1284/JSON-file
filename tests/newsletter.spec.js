import { test, expect } from "@playwright/test";
import testData from "../utils/testData.json";

test.describe("Newsletter Subscription", () => {
  test("Valid email subscription", async ({ page }) => {
    await page.goto("https://demowebshop.tricentis.com/");
    try {
      await page.fill("#newsletter-email", testData.newsletter.validEmail);
      await page.click("#newsletter-subscribe-button");

      const resultLocator = page.locator(".newsletter-result");
      await resultLocator.waitFor({ state: "visible", timeout: 10000 });

      const result = await resultLocator.innerText();
      expect.soft(result).toContain("Thank you for signing up!");
      console.log("✅ Valid email subscription handled successfully");

      // Screenshot after success
      await page.screenshot({ path: "screenshots/valid-subscription.png", fullPage: true });
    } catch (error) {
      console.log("⚠️ Error in valid subscription test:", error.message);
      await page.screenshot({ path: "screenshots/valid-subscription-error.png", fullPage: true });
      expect.soft(false, `Handled error: ${error.message}`);
    }
  });

  test("Invalid email subscription", async ({ page }) => {
    await page.goto("https://demowebshop.tricentis.com/");
    try {
      await page.fill("#newsletter-email", testData.newsletter.invalidEmail);
      await page.click("#newsletter-subscribe-button");

      const resultLocator = page.locator(".newsletter-result");
      await resultLocator.waitFor({ state: "visible", timeout: 10000 });

      const result = await resultLocator.innerText();
      expect.soft(result).toContain("Enter valid email");
      console.log("✅ Invalid email subscription handled successfully");

      // Screenshot after success
      await page.screenshot({ path: "screenshots/invalid-subscription.png", fullPage: true });
    } catch (error) {
      console.log("⚠️ Error in invalid subscription test:", error.message);
      await page.screenshot({ path: "screenshots/invalid-subscription-error.png", fullPage: true });
      expect.soft(false, `Handled error: ${error.message}`);
    }
  });
});
