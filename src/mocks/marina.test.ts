// Guards the story the landing and the dashboard tell, end to end: data → rules → numbers.
import { describe, expect, it } from "vitest";
import { projectUntilPayday } from "@/insights/projection";
import { findRenewals } from "@/insights/recurring";
import { averageDailySpending, compareWithLastMonth, daysBetween } from "@/insights/spending";
import {
  OPENING_BALANCE,
  PAYDAY,
  SCHEDULED,
  TODAY,
  TRANSACTIONS,
  VARIABLE_CATEGORIES,
} from "./marina";

const total = (rows: readonly { amount: number }[]) =>
  rows.reduce((sum, row) => sum + row.amount, 0);
const balance = OPENING_BALANCE + total(TRANSACTIONS);

describe("Marina's data", () => {
  it("ends today at R$ 4.218,90 and never goes negative on the way", () => {
    expect(balance).toBe(421890);
    let running = OPENING_BALANCE;
    for (const t of [...TRANSACTIONS].reverse()) {
      running += t.amount;
      expect(running, `balance on ${t.date}`).toBeGreaterThanOrEqual(0);
    }
  });

  it("has unique ids, newest first", () => {
    expect(new Set(TRANSACTIONS.map((t) => t.id)).size).toBe(TRANSACTIONS.length);
    const dates = TRANSACTIONS.map((t) => t.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });
});

describe("the rules over Marina's data reach the numbers on screen", () => {
  it("Rule 1: R$ 54,00 a day, R$ 612,00 left on payday", () => {
    const dailySpending = averageDailySpending(TRANSACTIONS, TODAY, VARIABLE_CATEGORIES);
    expect(dailySpending).toBe(5400);
    const projection = projectUntilPayday({
      balance,
      scheduled: total(SCHEDULED),
      dailySpending,
      daysLeft: daysBetween(TODAY, PAYDAY),
    });
    expect(total(SCHEDULED)).toBe(295890);
    expect(projection.leftover).toBe(61200);
  });

  it("Rule 2: delivery is the biggest rise, R$ 260 → R$ 380", () => {
    expect(compareWithLastMonth(TRANSACTIONS, TODAY, VARIABLE_CATEGORIES)).toEqual({
      category: "delivery",
      before: 26000,
      now: 38000,
      difference: 12000,
    });
  });

  it("Rule 3: only StreamFlix renews tomorrow, R$ 5 more since October", () => {
    expect(findRenewals(TRANSACTIONS, TODAY)).toEqual([
      {
        merchant: "StreamFlix",
        nextDate: "2026-11-24",
        daysUntil: 1,
        amount: 3990,
        increase: 500,
        increasedOn: "2026-10-24",
      },
    ]);
  });
});
