import { describe, expect, it } from "vitest";
import { findRenewals } from "./recurring";

const today = "2026-11-23";
const charge = (date: string, amount: number, merchant = "StreamFlix") => ({
  date,
  merchant,
  amount: -amount,
});

describe("Rule 3 · findRenewals", () => {
  it("predicts the next charge and says how much the price went up, and since when", () => {
    const rows = [
      charge("2026-08-24", 3490),
      charge("2026-09-24", 3490),
      charge("2026-10-24", 3990),
    ];
    expect(findRenewals(rows, today)).toEqual([
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

  it("reports no increase when the price never changed", () => {
    const rows = [
      charge("2026-08-25", 2190),
      charge("2026-09-24", 2190),
      charge("2026-10-24", 2190),
    ];
    const [renewal] = findRenewals(rows, today);
    expect(renewal.increase).toBe(0);
    expect(renewal.increasedOn).toBeNull();
  });

  it("needs at least three charges", () => {
    expect(findRenewals([charge("2026-09-24", 3490), charge("2026-10-24", 3490)], today)).toEqual(
      [],
    );
  });

  it("ignores weekly habits (intervals outside 28 to 31 days)", () => {
    const rows = [
      charge("2026-11-02", 1000, "Café"),
      charge("2026-11-09", 1000, "Café"),
      charge("2026-11-16", 1000, "Café"),
    ];
    expect(findRenewals(rows, today, 31)).toEqual([]);
  });

  it("stops treating it as the same subscription after a jump over 20%", () => {
    const rows = [
      charge("2026-08-24", 3000),
      charge("2026-09-24", 3000),
      charge("2026-10-24", 9000),
    ];
    expect(findRenewals(rows, today)).toEqual([]);
  });

  it("only warns within the window (default: 2 days)", () => {
    const rows = [
      charge("2026-08-27", 5990),
      charge("2026-09-27", 5990),
      charge("2026-10-27", 5990),
    ];
    expect(findRenewals(rows, today)).toEqual([]); // renews in 4 days
    expect(findRenewals(rows, today, 4)).toHaveLength(1);
  });

  it("ignores money in and charges dated after today", () => {
    const rows = [
      { date: "2026-08-05", merchant: "Salário", amount: 445000 },
      { date: "2026-09-05", merchant: "Salário", amount: 445000 },
      { date: "2026-10-05", merchant: "Salário", amount: 445000 },
      charge("2026-08-24", 3490),
      charge("2026-09-24", 3490),
      charge("2026-10-24", 3490),
      charge("2026-11-24", 3490), // scheduled, not charged yet
    ];
    expect(findRenewals(rows, today).map((r) => r.merchant)).toEqual(["StreamFlix"]);
  });

  it("lists the soonest renewal first", () => {
    const rows = [
      charge("2026-08-25", 2190, "SomPlay"),
      charge("2026-09-25", 2190, "SomPlay"),
      charge("2026-10-25", 2190, "SomPlay"),
      charge("2026-08-24", 3490),
      charge("2026-09-24", 3490),
      charge("2026-10-24", 3490),
    ];
    expect(findRenewals(rows, today).map((r) => r.merchant)).toEqual(["StreamFlix", "SomPlay"]);
  });
});
