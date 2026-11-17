// Rules 1–3 over Marina's data must reach the numbers the landing shows. `npm run check:insights`.
import assert from "node:assert/strict";
import {
  OPENING_BALANCE,
  PAYDAY,
  SCHEDULED,
  TODAY,
  TRANSACTIONS,
  VARIABLE_CATEGORIES,
} from "../mocks/marina.ts";
import { projectUntilPayday } from "./projection.ts";
import { findRenewals } from "./recurring.ts";
import {
  averageDailySpending,
  compareWithLastMonth,
  daysBetween,
  samePointLastMonth,
} from "./spending.ts";

// Rule 1: 4.218,90 − 2.958,90 − 54,00 × 12 = 612,00.
const daily = averageDailySpending(TRANSACTIONS, TODAY, VARIABLE_CATEGORIES);
assert.equal(daily, 5400);
const projection = projectUntilPayday({
  balance: OPENING_BALANCE + TRANSACTIONS.reduce((sum, t) => sum + t.amount, 0),
  scheduled: SCHEDULED.reduce((sum, s) => sum + s.amount, 0),
  dailySpending: daily,
  daysLeft: daysBetween(TODAY, PAYDAY),
});
assert.equal(projection.leftover, 61200);

// Rule 2: delivery is the biggest rise (R$ 260 → R$ 380).
assert.deepEqual(compareWithLastMonth(TRANSACTIONS, TODAY, VARIABLE_CATEGORIES), {
  category: "delivery",
  before: 26000,
  now: 38000,
  difference: 12000,
});
// "Same point of last month" across the year turn and into a shorter month.
assert.deepEqual(samePointLastMonth("2027-01-15"), { start: "2026-12-01", end: "2026-12-15" });
assert.deepEqual(samePointLastMonth("2026-03-31"), { start: "2026-02-01", end: "2026-02-28" });
// Under R$ 50, or under 20%, says nothing.
const small = [
  { date: "2026-10-05", category: "lazer", amount: -10000 },
  { date: "2026-11-05", category: "lazer", amount: -14000 }, // +40, +40%
  { date: "2026-10-06", category: "mercado", amount: -100000 },
  { date: "2026-11-06", category: "mercado", amount: -110000 }, // +100, +10%
];
assert.equal(compareWithLastMonth(small, TODAY, ["lazer", "mercado"]), null);

// Rule 3: only StreamFlix renews within 2 days, R$ 5 more since October 24.
assert.deepEqual(findRenewals(TRANSACTIONS, TODAY), [
  {
    merchant: "StreamFlix",
    nextDate: "2026-11-24",
    daysUntil: 1,
    amount: 3990,
    increase: 500,
    increasedOn: "2026-10-24",
  },
]);
// Weekly habits are not subscriptions, and a price jump over 20% breaks the pattern.
const notMonthly = [
  { date: "2026-11-02", merchant: "Café", amount: -1000 },
  { date: "2026-11-09", merchant: "Café", amount: -1000 },
  { date: "2026-11-16", merchant: "Café", amount: -1000 },
  { date: "2026-08-24", merchant: "Loja", amount: -3000 },
  { date: "2026-09-24", merchant: "Loja", amount: -3000 },
  { date: "2026-10-24", merchant: "Loja", amount: -9000 },
];
assert.deepEqual(findRenewals(notMonthly, TODAY, 31), []);

console.log("insights/rules: ok");
