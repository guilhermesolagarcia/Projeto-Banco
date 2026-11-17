// Prints the planning document to PDF with Playwright's Chromium.
// Usage: node docs/planejamento/gerar-pdf.mjs
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const here = (name) => fileURLToPath(new URL(name, import.meta.url));

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(here("roadmap.html")).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.pdf({
  path: here("ambar-planejamento.pdf"),
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
});
await browser.close();
console.log("docs/planejamento/ambar-planejamento.pdf");
