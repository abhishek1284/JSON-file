import { test, expect } from "@playwright/test";
import testData from "../utils/testData.json";

test.describe("Login Scenarios", () => {
  test("Login with valid credentials", async ({ page }) => {
    await page.goto("https://demowebshop.tricentis.com/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await page.locator('//a[text()="Log in"]').click();
    await expect(page).toHaveURL(/login/);

    await page.locator('//*[@id="Email"]').fill(testData.validUser.email);
    await page.locator('//*[@id="Password"]').fill(testData.validUser.password);
    await page.locator('input[value="Log in"]').click();

    await expect(page.locator('//a[text()="Log out"]')).toBeVisible();
  });

  test("Login with invalid credentials shows error", async ({ page }) => {
    await page.goto("https://demowebshop.tricentis.com/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await page.locator('//a[text()="Log in"]').click();
    await expect(page).toHaveURL(/login/);

    await page.locator('//*[@id="Email"]').fill(testData.invalidUser.email);
    await page.locator('//*[@id="Password"]').fill(testData.invalidUser.password);
    await page.locator('input[value="Log in"]').click();

    const errorMessage = page.locator('.message-error, .validation-summary-errors li').first();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText("Login was unsuccessful");
  });
});
