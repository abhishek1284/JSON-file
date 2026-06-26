import { test, expect } from "@playwright/test";
import testData from "../utils/testData.json";
import fs from "fs";

// Create screenshots folder if it doesn't exist
if (!fs.existsSync("screenshots")) {
  fs.mkdirSync("screenshots");
}

test.describe("DemoShop - Share Product Feature", () => {

  test("Registered customer can share product", async ({ page }) => {
    await page.goto("https://demowebshop.tricentis.com/");

    // Login
    await page.click("a.ico-login");
    await page.fill("#Email", testData.validUser.email);
    await page.fill("#Password", testData.validUser.password);
    await page.click("input[value='Log in']");

    // Search product
    await page.fill("#small-searchterms", "desktop");
    await page.click('input[value="Search"]');

    // Open first product
    await page.locator(".product-title a").first().click();

    // Email a friend
    await page.locator(".email-a-friend-button").click();

    // Fill form
    await page.fill("#FriendEmail", testData.shareProduct.friendEmail);
    if (await page.locator("#YourEmailAddress").isVisible()) {
      await page.fill("#YourEmailAddress", testData.shareProduct.yourEmail);
    }
    await page.fill("#PersonalMessage", testData.shareProduct.message);

    // Send email
    await page.locator('input[name="send-email"]').click();

    // Verify success
    const successMessage = page.locator(".result");
    await expect(successMessage).toBeVisible({ timeout: 10000 });
    await expect(successMessage).toContainText("Your message has been sent");

    // Screenshot
    await page.screenshot({
      path: "screenshots/shareProduct_success.png",
      fullPage: true
    });

    console.log("Product shared successfully.");
  });

});
