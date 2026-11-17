import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Same "@/…" imports as the app (tsconfig paths).
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    // Two projects: pure logic in plain Node (fast), components in a simulated browser.
    projects: [
      {
        extends: true,
        test: { name: "logic", include: ["src/**/*.test.ts"], environment: "node" },
      },
      {
        extends: true,
        test: {
          name: "ui",
          include: ["src/**/*.test.tsx"],
          environment: "jsdom",
          setupFiles: ["./src/test/setup.ts"],
        },
      },
    ],
    coverage: {
      provider: "v8",
      // The insight rules are the heart of the product: pure logic, high bar.
      include: ["src/insights/**/*.ts"],
      exclude: ["src/insights/**/*.test.ts"],
      thresholds: { lines: 90, functions: 90, branches: 90, statements: 90 },
    },
  },
});
