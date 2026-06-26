import { test, expect } from "@playwright/test";
import testData from "../utils/testData.json";

// 🔹 After each test, capture screenshot with status in filename
test.afterEach(async ({ page }, testInfo) => {
  const screenshotPath = `screenshots/${testInfo.title}-${testInfo.status}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
});

test.describe("DemoShop - Authentication Flaws", () => {

  test("Registration fails with weak password", async ({ page }) => {
    await page.goto("https://demowebshop.tricentis.com/register");

    await page.fill("#FirstName", "Abhishek");
    await page.fill("#LastName", "Pradhan");
    await page.fill("#Email", testData.weakPasswordUser.email);
    await page.fill("#Password", testData.weakPasswordUser.password);
    await page.fill("#ConfirmPassword", testData.weakPasswordUser.password);

    await page.click("#register-button");

    const errorLocator = page.locator(".field-validation-error");
    await errorLocator.waitFor({ state: "visible", timeout: 10000 });

    // Screenshot before assertion
    await page.screenshot({ path: "screenshots/weakPassword_beforeAssert.png", fullPage: true });

    // ✅ Option 1: Match exact text
    await expect(errorLocator).toContainText("The password should have at least 6 characters.");

    // ✅ Option 2: Use regex for flexibility
    // await expect(errorLocator).toContainText(/at least 6 characters/);

    // Screenshot for success case
    await errorLocator.screenshot({ path: "screenshots/weakPassword_success.png" });

    // Keep page visible for observation
    await page.waitForTimeout(7000);
  });

  test("Session handling - multiple logins", async ({ browser }) => {
    // First Session
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();

    await page1.goto("https://demowebshop.tricentis.com/login");
    await page1.fill("#Email", testData.validUser.email);
    await page1.fill("#Password", testData.validUser.password);
    await page1.click("input.button-1.login-button");

    await expect(page1.locator("a.ico-logout")).toBeVisible();

    // Second Session
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();

    await page2.goto("https://demowebshop.tricentis.com/login");
    await page2.fill("#Email", testData.validUser.email);
    await page2.fill("#Password", testData.validUser.password);
    await page2.click("input.button-1.login-button");

    await expect(page2.locator("a.ico-logout")).toBeVisible();

    // Verify both sessions remain active
    await expect(page1.locator("a.ico-logout")).toBeVisible();
    await expect(page2.locator("a.ico-logout")).toBeVisible();

    // Screenshot for success case
    await page2.screenshot({ path: "screenshots/session_success.png", fullPage: true });

    // Keep browser open for observation
    await page2.waitForTimeout(7000);

    await context1.close();
    await context2.close();
  });

});

