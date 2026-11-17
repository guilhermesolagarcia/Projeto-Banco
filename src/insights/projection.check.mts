// Minimal runnable check until Vitest arrives in Phase 4: `npm run check:insights`.
import assert from "node:assert/strict";
import { projectUntilPayday } from "./projection.ts";

// The landing example: 4.218,90 − 2.958,90 − 54,00 × 12 = 612,00.
const landing = projectUntilPayday({
  balance: 421890,
  scheduled: 295890,
  dailySpending: 5400,
  daysLeft: 12,
});
assert.equal(landing.leftover, 61200);
assert.equal(landing.status, "comfortable");
assert.equal(landing.dailyCut, 0);

// Tight: leftover is positive but below 10% of a month of spending (5.400 × 30 × 10% = 16.200).
assert.equal(
  projectUntilPayday({ balance: 100000, scheduled: 0, dailySpending: 5400, daysLeft: 16 }).status,
  "tight",
);

// Short: 10.000 − 5.000 × 3 = −5.000 → cut 1.667 per day (rounded up, never under-advise).
const short = projectUntilPayday({
  balance: 10000,
  scheduled: 0,
  dailySpending: 5000,
  daysLeft: 3,
});
assert.equal(short.status, "short");
assert.equal(short.leftover, -5000);
assert.equal(short.dailyCut, 1667);
assert.equal(short.share, 0);

// Days are clamped to at least 1.
assert.equal(
  projectUntilPayday({ balance: 1000, scheduled: 0, dailySpending: 100, daysLeft: 0 }).leftover,
  900,
);

console.log("insights/projection: ok");
