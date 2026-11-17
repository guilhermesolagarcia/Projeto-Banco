import { describe, expect, it } from "vitest";
import { projectUntilPayday } from "./projection";

describe("Rule 1 · projectUntilPayday", () => {
  it("computes the landing example: 4.218,90 − 2.958,90 − 54,00 × 12 = 612,00", () => {
    const result = projectUntilPayday({
      balance: 421890,
      scheduled: 295890,
      dailySpending: 5400,
      daysLeft: 12,
    });
    expect(result).toMatchObject({ leftover: 61200, status: "comfortable", dailyCut: 0 });
    // 612,00 of the 1.260,00 free after bills: about 49%.
    expect(result.share).toBeCloseTo(0.4857, 4);
  });

  it("is tight when what is left is under 10% of a month of spending", () => {
    // 5.400 × 30 × 10% = 16.200 is the comfort line; 100.000 − 5.400 × 16 = 13.600.
    const result = projectUntilPayday({
      balance: 100000,
      scheduled: 0,
      dailySpending: 5400,
      daysLeft: 16,
    });
    expect(result.status).toBe("tight");
    expect(result.leftover).toBe(13600);
  });

  it("is comfortable exactly on the comfort line", () => {
    const result = projectUntilPayday({
      balance: 16200 + 5400,
      scheduled: 0,
      dailySpending: 5400,
      daysLeft: 1,
    });
    expect(result.status).toBe("comfortable");
  });

  it("says how much to cut per day when money runs short, rounded up", () => {
    // 10.000 − 5.000 × 3 = −5.000 → 1.666,67 per day → 1.667: never under-advise.
    const result = projectUntilPayday({
      balance: 10000,
      scheduled: 0,
      dailySpending: 5000,
      daysLeft: 3,
    });
    expect(result).toEqual({ leftover: -5000, status: "short", share: 0, dailyCut: 1667 });
  });

  it("treats zero or fractional days as at least one whole day", () => {
    const base = { balance: 1000, scheduled: 0, dailySpending: 100 };
    expect(projectUntilPayday({ ...base, daysLeft: 0 }).leftover).toBe(900);
    expect(projectUntilPayday({ ...base, daysLeft: 2.9 }).leftover).toBe(800);
  });

  it("has no share left when the bills already take everything", () => {
    const result = projectUntilPayday({
      balance: 1000,
      scheduled: 2000,
      dailySpending: 0,
      daysLeft: 5,
    });
    expect(result.share).toBe(0);
    expect(result.status).toBe("short");
  });
});
