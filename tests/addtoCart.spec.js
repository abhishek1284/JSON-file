import { test } from "@playwright/test";
import testData from "../utils/testData.json";

test("Add to cart with different quantities", async ({ page }) => {
  try {
    // Open website
    await page.goto("https://demowebshop.tricentis.com/");
    console.log("Website opened");

    // Search product
    await page.fill("#small-searchterms", testData.searchKeywords[0]);
    await page.click('input[value="Search"]');
    console.log("Search completed");

    // Open first search result
    await page.locator(".product-title a").first().click();
    console.log("Product page opened");

    // Wait for quantity field
    await page.locator(".qty-input").waitFor({ state: "visible", timeout: 10000 });

    //  CASE 1: Quantity = 0 (Error expected)
    await page.locator(".qty-input").clear();
    await page.locator(".qty-input").fill(testData.addToCart.invalidQuantities[0].toString());
    console.log("Invalid quantity entered");

    await page.locator('input[value="Add to cart"]').click();
    console.log("Add to Cart clicked (invalid)");

    const errorText = await page.locator(".message-error").innerText();
    if (errorText.includes(testData.addToCart.expectedErrorMessage)) {
      console.log("Error message verified:", errorText);
      await page.screenshot({ path: "quantity-error-success.png", fullPage: true });
    } else {
      console.warn(" Error message mismatch:", errorText);
      await page.screenshot({ path: "quantity-error-failure.png", fullPage: true });
    }

    //  Quantity = 1 (Success expected
    await page.locator(".qty-input").clear();
    await page.locator(".qty-input").fill("1");
    console.log("Valid quantity entered");

    await page.locator('input[value="Add to cart"]').click();
    console.log("Add to Cart clicked (valid)");

    const successText = await page.locator(".bar-notification.success").innerText();
    if (successText.includes(testData.addToCart.expectedSuccessMessage)) {
      console.log(" Success message verified:", successText);
      await page.screenshot({ path: "quantity-success.png", fullPage: true });
    } else {
      console.warn(" Success message mismatch:", successText);
      await page.screenshot({ path: "quantity-success-failure.png", fullPage: true });
    }

  } catch (error) {
    console.error("Unexpected Test Error:", error);
    await page.screenshot({ path: "unexpected-error.png", fullPage: true });
  }
});

