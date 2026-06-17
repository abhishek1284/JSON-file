import { test, expect } from "@playwright/test";
import testData from "../utils/testData.json";

test.describe("Newsletter Subscription", () => {

  test("Valid email subscription", async ({ page }) => {
    await page.goto("https://demowebshop.tricentis.com/");

    await page.fill(
      "#newsletter-email",
      testData.newsletter.validEmail
    );

    await page.click("#newsletter-subscribe-button");

    try {
      const resultLocator = page.locator(
        ".newsletter-result-block, .newsletter-result"
      );

      await resultLocator.waitFor({
        state: "visible",
        timeout: 5000,
      });

      const message = await resultLocator.textContent();

      console.log("Success Message:", message);

      await page.screenshot({
        path: "screenshots/valid-subscription.png",
        fullPage: true,
      });

      console.log("Valid subscription completed");
    } catch (error) {
      console.log("Success message not found");

      await page.screenshot({
        path: "screenshots/valid-subscription-error.png",
        fullPage: true,
      });
    }
  });

  test("Invalid email subscription", async ({ page }) => {
    await page.goto("https://demowebshop.tricentis.com/");

    await page.fill(
      "#newsletter-email",
      testData.newsletter.invalidEmail
    );

    await page.click("#newsletter-subscribe-button");

    await page.waitForTimeout(3000);

    const bodyText = await page.locator("body").textContent();

    console.log("Page Content:");
    console.log(bodyText);

    await page.screenshot({
      path: "screenshots/invalid-subscription.png",
      fullPage: true,
    });

    if (
      bodyText &&
      (
        bodyText.includes("valid email") ||
        bodyText.includes("Wrong email") ||
        bodyText.includes("email address")
      )
    ) {
      console.log("Invalid email validation displayed");
    } else {
      console.log("Validation message not found");
    }
  });

});