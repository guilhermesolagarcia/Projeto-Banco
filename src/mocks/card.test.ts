import { describe, expect, it } from "vitest";
import { billTotal, CARD } from "./card";
import { PAYDAY } from "./marina";

describe("CARD", () => {
  it("is due on day 10, after payday, so the dashboard projection (until Dec 5) stays R$ 612,00", () => {
    expect(CARD.dueDay).toBe(10);
    expect(`2026-12-${String(CARD.dueDay).padStart(2, "0")}` > PAYDAY).toBe(true);
  });

  it("holds purchases as positive cents", () => {
    expect(CARD.purchases.every((p) => p.amount > 0)).toBe(true);
  });

  it("bills every purchase of the cycle that closes on day 30 (an installment counts its own value)", () => {
    const november = CARD.purchases.filter((p) => p.date >= "2026-11-01" && p.date <= "2026-11-30");
    expect(CARD.closingDay).toBe(30);
    expect(billTotal(CARD, "2026-11-30")).toBe(november.reduce((sum, p) => sum + p.amount, 0));
  });

  it("leaves out purchases from another cycle", () => {
    const card = {
      ...CARD,
      purchases: [
        { id: "x1", date: "2026-10-30", merchant: "A", category: "lazer" as const, amount: 100 },
        { id: "x2", date: "2026-10-31", merchant: "B", category: "lazer" as const, amount: 200 },
        { id: "x3", date: "2026-12-01", merchant: "C", category: "lazer" as const, amount: 400 },
      ],
    };
    // Cycle Oct 31 – Nov 30: only the purchase made after October's closing.
    expect(billTotal(card, "2026-11-30")).toBe(200);
  });
});
