/*
 * Next 16 keeps visited pages in the DOM, hidden (React <Activity>), so "back" is instant:
 * queries that could also match a previous page use .visible().
 *
 * The MVP success criterion (SPEC.md): landing → demo account → dashboard → statement,
 * on desktop and on a phone. Runs against the production build.
 */
import { expect, test, type Page } from "@playwright/test";

async function signIn(page: Page) {
  await page.goto("/login");
  await page.getByRole("button", { name: "Entrar como Marina" }).click();
  await expect(page).toHaveURL(/\/inicio$/);
}

test("the whole demo: landing → login → dashboard → statement", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Sem susto no\s*fim do mês\./);

  await page.getByRole("link", { name: "Experimentar com conta demo" }).first().click();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByRole("button", { name: "Entrar como Marina" }).click();
  await expect(page.getByRole("heading", { name: "Olá, Marina." })).toBeVisible();
  // The numbers on screen come from the rules over Marina's data (through the fake API).
  await expect(
    page.getByRole("heading", { name: "Dá para chegar até dia 5 com folga." }),
  ).toBeVisible();
  await expect(page.getByText(/StreamFlix renova amanhã/).visible()).toBeVisible();

  // The shortcut on the balance card (the bottom bar keeps the statement inside "Mais").
  await page.getByRole("link", { name: "Ver extrato" }).click();
  await expect(page).toHaveURL(/\/extrato$/);
  // People click the whole pill (the label); the radio inside is visually hidden.
  const delivery = page.getByRole("radio", { name: "Delivery" });
  await page.locator("label", { has: delivery }).click();
  await expect(delivery).toBeChecked();
  await expect(page.getByText("Rango Delivery").visible()).toHaveCount(7);
  await expect(page.getByRole("note").visible()).toContainText("a mais com delivery este mês");
});

test("the landing simulator redoes the math as you type", async ({ page }) => {
  await page.goto("/");
  const balance = page.getByLabel("Saldo hoje");
  await balance.fill("1000");
  await expect(page.getByText("Vai faltar antes do salário.")).toBeVisible();
});

test("the banking area sends visitors without a session to the login", async ({ page }) => {
  await page.goto("/inicio");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Olá, Marina." })).toBeHidden();
});

test("signing out ends the session", async ({ page, isMobile }) => {
  await signIn(page);
  // Desktop: at the foot of the sidebar. Phone: inside "Mais".
  if (isMobile) await page.getByRole("link", { name: "Mais" }).click();
  await page.getByRole("button", { name: "Sair" }).visible().click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/extrato");
  await expect(page).toHaveURL(/\/login$/);
});

test("the error state is calm and offers a way forward", async ({ page }) => {
  await signIn(page);
  await page.goto("/inicio?simular=erro");
  // Next also has a (hidden, empty) route announcer with role="alert": pick ours by its text.
  await expect(
    page.getByRole("alert").filter({ hasText: "Não conseguimos carregar sua conta agora." }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Tentar de novo" })).toBeVisible();
});

test("the login works from the keyboard alone", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/inicio$/);
});

test("with reduced motion, money shows its final value at once", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await signIn(page);
  // The visible (animated) number, not the screen-reader copy: no counting up from zero.
  await expect(page.locator('[aria-hidden="true"]', { hasText: /612,00/ }).first()).toBeVisible({
    timeout: 3000,
  });
});

test.describe("at 320 px wide (the smallest common phone)", () => {
  test.use({ viewport: { width: 320, height: 720 } });

  // SPEC: "a partir de 320 px, sem rolagem horizontal". A fieldset once broke this on /extrato.
  test("no page scrolls sideways", async ({ page }) => {
    // Public pages first: once signed in, /login redirects to the dashboard.
    const pages = [
      "/",
      "/login",
      "signin",
      "/inicio",
      "/extrato",
      "/pix",
      "/cartao",
      "/planejar",
      "/beneficios",
      "/assistente",
      "/configuracoes",
      "/mais",
    ];
    for (const path of pages) {
      if (path === "signin") {
        await signIn(page);
        continue;
      }
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const { scrollWidth, width } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        width: innerWidth,
      }));
      expect(
        scrollWidth,
        `${path} is ${scrollWidth}px wide on a ${width}px screen`,
      ).toBeLessThanOrEqual(width);
    }
  });
});

test.describe("app navigation on a phone", () => {
  test.skip(({ isMobile }) => !isMobile, "The bottom bar is the phone's navigation.");

  test("the bottom bar has five places and marks the current one", async ({ page }) => {
    await signIn(page);
    await page.goto("/pix");
    const bar = page.getByRole("navigation", { name: "Principal" }).visible();
    await expect(bar.getByRole("link")).toHaveCount(5);
    await expect(bar.getByRole("link", { name: "Pix" })).toHaveAttribute("aria-current", "page");
  });

  test("the end of the page stays above the bar", async ({ page }) => {
    await signIn(page);
    const last = page
      .getByRole("heading", { name: "Últimas transações" })
      .locator("..")
      .getByRole("listitem")
      .last();
    await last.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const bar = await page.getByRole("navigation", { name: "Principal" }).visible().boundingBox();
    const end = await last.boundingBox();
    expect(end!.y + end!.height).toBeLessThanOrEqual(bar!.y);
  });
});

test("a demo action survives a reload, and starting over undoes it", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await signIn(page);
  await expect(
    page
      .getByText(/4\.218,90/)
      .visible()
      .first(),
  ).toBeVisible();

  // The Pix screen arrives in Phase 6: send one straight to the fake API, as that screen will.
  await page.evaluate(() =>
    fetch("/api/demo/acoes", {
      method: "POST",
      body: JSON.stringify({ type: "pix-out", date: "2026-11-23", contactId: "c1", amount: 5000 }),
    }),
  );
  // A plain reload (F5): the service worker stays on and the action comes back from localStorage.
  await page.reload();
  await expect(
    page
      .getByText(/4\.168,90/)
      .visible()
      .first(),
  ).toBeVisible();
  await expect(page.getByText("Pix para Lucas Andrade").visible()).toBeVisible();

  await page.goto("/mais");
  await page.getByRole("button", { name: /Recomeçar a demo/ }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "A demo voltou ao começo." }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Início" }).visible().click();
  await expect(
    page
      .getByText(/4\.218,90/)
      .visible()
      .first(),
  ).toBeVisible();
  await expect(page.getByText("Pix para Lucas Andrade").visible()).toHaveCount(0);
});
