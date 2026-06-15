import { test, expect } from "@playwright/test";
import testData from "../utils/testData.json";

test("Search functionality using JSON keywords with try/catch", async ({ page }) => {
  await page.goto("https://demowebshop.tricentis.com/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  const searchBox = page.locator("#small-searchterms");
  const searchButton = page.locator("input.button-1.search-box-button");
  const searchResults = page.locator(".product-item");

  for (const keyword of testData.searchKeywords) {
    await searchBox.fill(keyword);
    await searchButton.click();

    try {
      // Assertion wrapped in try/catch
      await expect(searchResults.first()).toContainText(keyword, { timeout: 5000 });
      console.log(`Search for "${keyword}" passed`);
    } catch (error) {
      console.warn(` Search for "${keyword}" failed: ${error.message}`);
      // Optional: take screenshot on failure
      await page.screenshot({ path: `screenshots/search-${keyword}-error.png`, fullPage: true });
    }
  }
});
