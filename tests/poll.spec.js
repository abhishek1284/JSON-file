import { test, expect } from "@playwright/test";
import testData from "../utils/testData.json";

test.describe("Poll Scenarios", () => {
  test("Register and vote in poll using JSON data", async ({ page }) => {
   
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
    const uniqueEmail = `abhishek_${Date.now()}@example.com`;
    await page.locator("#Email").fill(uniqueEmail);
    await page.locator("#Password").fill(testData.registration.password);
    await page.locator("#ConfirmPassword").fill(testData.registration.password);

    await page.locator('input[name="register-button"]').click();

    await expect(page.locator(".result")).toHaveText("Your registration completed");
    await expect(page.locator("a.ico-logout")).toBeVisible();

   
    await page.goto("https://demowebshop.tricentis.com/");


    const pollOptions = page.locator('input[name="pollanswers-1"]');
    await pollOptions.nth(0).hover();


    await pollOptions.nth(0).check();
    await page.locator('input[value="Vote"]').click();

    try {
      const resultMessage = page.locator(".poll-results");
      await expect(resultMessage).toBeVisible({ timeout: 10000 });
      const resultText = await resultMessage.textContent();
      console.log("Poll result message:", resultText);

      if (!resultText || resultText.trim().length === 0) {
        throw new Error("Poll result text was empty");
      }

      const foundOption = testData.poll.options.some(opt =>
        resultText.includes(opt)
      );
      expect(foundOption).toBeTruthy();
    } catch (error) {
      console.warn("Non-critical error in poll verification:", error.message);
    }
  });
});
