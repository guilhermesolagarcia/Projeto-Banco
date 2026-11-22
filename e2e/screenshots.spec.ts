/*
 * README pictures, regenerated in one command instead of by hand:
 *   SCREENSHOTS=1 npx playwright test screenshots --project=desktop
 * Skipped in normal runs. Reduced motion, so no animation is caught halfway.
 */
import { devices, expect, test, type Page } from "@playwright/test";

const OUT = "docs/readme";
test.skip(!process.env.SCREENSHOTS, "Only when regenerating the README pictures.");
test.use({ colorScheme: "light", reducedMotion: "reduce" });

async function settle(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800); // opacity fades still run with reduced motion
}

async function signIn(page: Page) {
  await page.goto("/login");
  await page.getByRole("button", { name: "Entrar como Marina" }).click();
  await expect(page.getByRole("heading", { name: "Olá, Marina." })).toBeVisible();
}

async function section(page: Page, selector: string, name: string) {
  const target = page.locator(selector).first();
  await target.scrollIntoViewIfNeeded();
  await settle(page);
  await target.screenshot({ path: `${OUT}/${name}.png` });
}

test.describe("desktop", () => {
  test.use({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });

  test("landing", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    await page.screenshot({ path: `${OUT}/hero.png` });
    await section(page, "#clareza", "clareza");
    await section(page, "#avisos", "avisos");
    await section(page, "#nao-julga", "nao-julga");
    await section(page, "#cartao", "cartao");
  });

  test("dashboard and statement", async ({ page }) => {
    await signIn(page);
    await settle(page);
    await page.screenshot({ path: `${OUT}/painel.png`, fullPage: true });
    await page.getByRole("link", { name: "Ver extrato" }).click();
    await expect(page.getByRole("radio", { name: "novembro" })).toBeChecked();
    await settle(page);
    await page.screenshot({ path: `${OUT}/extrato.png` });
  });
});

test.describe("phone", () => {
  // The phone's screen, not its browser type (that can't change inside a describe).
  const pixel = devices["Pixel 7"];
  test.use({
    viewport: pixel.viewport,
    userAgent: pixel.userAgent,
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 1,
  });

  test("landing and dashboard", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    await page.screenshot({ path: `${OUT}/mobile-hero.png` });
    await section(page, "#clareza", "mobile-clareza");
    await signIn(page);
    await settle(page);
    await page.screenshot({ path: `${OUT}/mobile-painel.png` });
  });
});
