// Guards the story the landing tells. Run with `npm run check:insights`.
import assert from "node:assert/strict";
import {
  OPENING_BALANCE,
  SCHEDULED,
  TODAY,
  TRANSACTIONS,
  VARIABLE_CATEGORIES,
  type Category,
} from "./marina.ts";

const total = (rows: readonly { amount: number }[]) =>
  rows.reduce((sum, row) => sum + row.amount, 0);
const spent = (category: Category, from: string, to: string) =>
  -total(TRANSACTIONS.filter((t) => t.category === category && t.date >= from && t.date <= to));

// Today's balance, and it never goes negative along the way.
assert.equal(OPENING_BALANCE + total(TRANSACTIONS), 421890);
let balance = OPENING_BALANCE;
for (const t of [...TRANSACTIONS].reverse()) {
  balance += t.amount;
  assert.ok(balance >= 0, `balance negative on ${t.date}`);
}

// Rule 1 inputs: R$ 2.958,90 scheduled, R$ 54,00 per day over the last 60 days (Sep 25 → Nov 23).
assert.equal(total(SCHEDULED), 295890);
const variable60 = -total(
  TRANSACTIONS.filter(
    (t) => VARIABLE_CATEGORIES.includes(t.category) && t.date >= "2026-09-25" && t.date <= TODAY,
  ),
);
assert.equal(variable60 / 60, 5400);

// Rule 2: delivery R$ 260 → R$ 380 at the same point of the month, the biggest rise.
assert.equal(spent("delivery", "2026-10-01", "2026-10-23"), 26000);
assert.equal(spent("delivery", "2026-11-01", "2026-11-23"), 38000);
for (const category of VARIABLE_CATEGORIES.filter((c) => c !== "delivery")) {
  const before = spent(category, "2026-10-01", "2026-10-23");
  const now = spent(category, "2026-11-01", "2026-11-23");
  assert.ok(now - before < 5000 || now - before < before * 0.2, `${category} would beat delivery`);
}

// Rule 3: three streaming charges, the last one R$ 5 more.
const streaming = TRANSACTIONS.filter((t) => t.merchant === "StreamFlix").map((t) => -t.amount);
assert.deepEqual(streaming, [3990, 3490, 3490]);

console.log(`mocks/marina: ok (${TRANSACTIONS.length} transactions)`);
