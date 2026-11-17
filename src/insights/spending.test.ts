import { describe, expect, it } from "vitest";
import {
  addDays,
  averageDailySpending,
  compareWithLastMonth,
  daysBetween,
  samePointLastMonth,
} from "./spending";

describe("date helpers", () => {
  it("adds days across month and year ends", () => {
    expect(addDays("2026-11-30", 1)).toBe("2026-12-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("counts whole days between dates", () => {
    expect(daysBetween("2026-11-23", "2026-12-05")).toBe(12);
    expect(daysBetween("2026-12-05", "2026-11-23")).toBe(-12);
  });

  it("finds the same point of last month, across the year and into shorter months", () => {
    expect(samePointLastMonth("2026-11-23")).toEqual({ start: "2026-10-01", end: "2026-10-23" });
    expect(samePointLastMonth("2027-01-15")).toEqual({ start: "2026-12-01", end: "2026-12-15" });
    expect(samePointLastMonth("2026-03-31")).toEqual({ start: "2026-02-01", end: "2026-02-28" });
  });
});

describe("Rule 1 input · averageDailySpending", () => {
  const rows = [
    { date: "2026-11-23", category: "mercado", amount: -3000 },
    { date: "2026-11-22", category: "delivery", amount: -3000 },
    { date: "2026-11-21", category: "moradia", amount: -180000 }, // fixed bill: not day-to-day
    { date: "2026-11-20", category: "salario", amount: 445000 }, // money in: ignored
    { date: "2026-11-20", category: "mercado", amount: -999999 }, // outside a 3-day window
  ];

  it("averages only day-to-day spending, inside the window, today included", () => {
    expect(averageDailySpending(rows, "2026-11-23", ["mercado", "delivery"], 3)).toBe(2000);
  });

  it("is zero with nothing spent", () => {
    expect(averageDailySpending([], "2026-11-23", ["mercado"], 60)).toBe(0);
  });
});

describe("Rule 2 · compareWithLastMonth", () => {
  const today = "2026-11-23";

  it("returns the biggest rise worth mentioning", () => {
    const rows = [
      { date: "2026-10-05", category: "delivery", amount: -26000 },
      { date: "2026-11-05", category: "delivery", amount: -38000 }, // +120, +46%
      { date: "2026-10-06", category: "lazer", amount: -10000 },
      { date: "2026-11-06", category: "lazer", amount: -17000 }, // +70, +70%: smaller
    ];
    expect(compareWithLastMonth(rows, today, ["delivery", "lazer"])).toEqual({
      category: "delivery",
      before: 26000,
      now: 38000,
      difference: 12000,
    });
  });

  it("stays quiet under R$ 50 or under 20%", () => {
    const rows = [
      { date: "2026-10-05", category: "lazer", amount: -10000 },
      { date: "2026-11-05", category: "lazer", amount: -14000 }, // +40: under R$ 50
      { date: "2026-10-06", category: "mercado", amount: -100000 },
      { date: "2026-11-06", category: "mercado", amount: -110000 }, // +100 but only +10%
    ];
    expect(compareWithLastMonth(rows, today, ["lazer", "mercado"])).toBeNull();
  });

  it("compares the same point of the month, not the whole last month", () => {
    const rows = [
      { date: "2026-10-28", category: "delivery", amount: -50000 }, // after Oct 23: not counted
      { date: "2026-11-05", category: "delivery", amount: -10000 },
    ];
    expect(compareWithLastMonth(rows, today, ["delivery"])).toEqual({
      category: "delivery",
      before: 0,
      now: 10000,
      difference: 10000,
    });
  });

  it("does not mention a drop", () => {
    const rows = [
      { date: "2026-10-05", category: "delivery", amount: -38000 },
      { date: "2026-11-05", category: "delivery", amount: -26000 },
    ];
    expect(compareWithLastMonth(rows, today, ["delivery"])).toBeNull();
  });
});
