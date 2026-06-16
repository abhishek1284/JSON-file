import { test, expect } from "@playwright/test";
import testData from "../utils/testData.json";

test("Add to cart with different quantities", async ({ page }) => {
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
  const qtyInput = page.locator(".qty-input");
  await qtyInput.waitFor({ state: "visible", timeout: 10000 });

  // CASE 1: Quantity = 0
  await qtyInput.clear();
  await qtyInput.fill(
    testData.addToCart.invalidQuantities[0].toString()
  );

  console.log("Invalid quantity entered");

  await page.click('input[value="Add to cart"]');

  try {
    const errorMessage = page.locator(
      ".message-error, .field-validation-error"
    );

    await errorMessage.first().waitFor({
      state: "visible",
      timeout: 5000,
    });

    console.log(
      "Error Message:",
      await errorMessage.first().textContent()
    );

    await page.screenshot({
      path: "screenshots/quantity-error.png",
      fullPage: true,
    });

  } catch (error) {
    console.log("No error message displayed for quantity 0.");
  }

  // CASE 2: Quantity = 1
  await qtyInput.clear();
  await qtyInput.fill(
    testData.addToCart.validQuantities[0].toString()
  );

  console.log("Valid quantity entered");

  await page.click('input[value="Add to cart"]');

  const successNotification = page.locator(".bar-notification");

  await expect(successNotification).toBeVisible({
    timeout: 10000,
  });

  console.log(
    "Success Message:",
    await successNotification.textContent()
  );

  await page.waitForTimeout(1500);

  await page.screenshot({
    path: "screenshots/add-to-cart-success.png",
    fullPage: true,
  });

  console.log("Success screenshot captured.");
});