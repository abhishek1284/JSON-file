import { test, expect } from "@playwright/test";
import testData from "../utils/testData.json";

test("Validate Demo Web Shop menu navigation with hover using JSON", async ({ page }) => {
  await page.goto("https://demowebshop.tricentis.com/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  const menus = page.locator(".top-menu > li");
  const menuCount = await menus.count();

  for (let i = 0; i < menuCount; i++) {
    const menuName = await menus.nth(i).textContent();
    console.log(`Main Menu: ${menuName?.trim()}`);

    await menus.nth(i).hover();

    const subMenus = menus.nth(i).locator("ul li");
    const subCount = await subMenus.count();

    for (let j = 0; j < subCount; j++) {
      const subMenuName = await subMenus.nth(j).textContent();
      console.log(`   Sub Menu: ${subMenuName?.trim()}`);

      expect(subMenuName?.trim()).not.toBe("");

  
      const expectedSubMenus = testData.menus.find(m => m.name === menuName?.trim())?.subMenus || [];
      if (expectedSubMenus.length > 0) {
        expect(expectedSubMenus).toContain(subMenuName?.trim());
      }
    }

    await page.waitForTimeout(1000);
  }

  await page.waitForTimeout(5000);
});

