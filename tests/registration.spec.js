import { test, expect } from "@playwright/test";
import testData from "../utils/testData.json";

test.describe("Registration Scenarios", () => {
  test("Register new user successfully with unique email", async ({ page }) => {
    await page.goto("https://demowebshop.tricentis.com/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    const registerLink = page.locator("a.ico-register");
    await registerLink.waitFor({ state: "visible", timeout: 10000 });
    await registerLink.click();
    await expect(page).toHaveURL(/register/);

    await page.locator("#gender-male").check();
    await page.locator("#FirstName").fill(testData.registration.firstName);
    await page.locator("#LastName").fill(testData.registration.lastName);

    const uniqueEmail = `user${Date.now()}@example.com`; // ensures uniqueness
    await page.locator("#Email").fill(uniqueEmail);
    await page.locator("#Password").fill(testData.registration.password);
    await page.locator("#ConfirmPassword").fill(testData.registration.password);

    await page.locator('input[name="register-button"]').click();

    await expect(page.locator(".result")).toHaveText("Your registration completed");
    await expect(page.locator("a.ico-logout")).toBeVisible();

    
    await page.screenshot({ path: "screenshots/registration-success.png", fullPage: true });

    await page.waitForTimeout(5000);
  });

  test("Register with duplicate email shows error", async ({ page }) => {
    await page.goto("https://demowebshop.tricentis.com/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    const registerLink = page.locator("a.ico-register");
    await registerLink.waitFor({ state: "visible", timeout: 10000 });
    await registerLink.click();
    await expect(page).toHaveURL(/register/);

    await page.locator("#gender-male").check();
    await page.locator("#FirstName").fill(testData.registration.firstName);
    await page.locator("#LastName").fill(testData.registration.lastName);
    await page.locator("#Email").fill(testData.registration.duplicateEmail);
    await page.locator("#Password").fill(testData.registration.password);
    await page.locator("#ConfirmPassword").fill(testData.registration.password);

    await page.locator('input[name="register-button"]').click();

    const errorMessage = page.locator(".validation-summary-errors li");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText("The specified email already exists");

    await page.screenshot({ path: "screenshots/registration-error.png", fullPage: true });

    await page.waitForTimeout(5000);
  });
});