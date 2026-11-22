/**
 * Marina's Âmbar credit card. It is new: every purchase is in the November cycle, so the first
 * bill is due on Dec 10. That keeps the account history as it is (no bill paid on Nov 10) and the
 * landing's numbers unchanged: card purchases leave the account only when the bill is paid,
 * and Dec 10 is after payday (Dec 5), outside the projection.
 */
import type { Category } from "./marina";

export type CardPurchase = {
  id: string;
  date: string;
  merchant: string;
  category: Category;
  /** Cents, positive. For an installment, the value of this installment only. */
  amount: number;
  installment?: { current: number; total: number };
};

export const CARD = {
  last4: "4821",
  limit: 350000,
  closingDay: 30,
  dueDay: 10 as const,
  purchases: [
    { id: "c1", date: "2026-11-03", merchant: "ZOD Energy", category: "mercado", amount: 1290 },
    { id: "c2", date: "2026-11-08", merchant: "Drago's Tattoo", category: "lazer", amount: 38000 },
    {
      id: "c3",
      date: "2026-11-12",
      merchant: "Nexo · headset",
      category: "lazer",
      amount: 13330,
      installment: { current: 1, total: 3 },
    },
    { id: "c4", date: "2026-11-17", merchant: "ZOD Energy", category: "mercado", amount: 1290 },
    { id: "c5", date: "2026-11-21", merchant: "Cine Arte", category: "lazer", amount: 6400 },
  ] satisfies CardPurchase[] as CardPurchase[],
};

/** The closing date of the month before `cycleEnd` (day clamped to short months). */
function previousClosing(cycleEnd: string, closingDay: number): string {
  const [year, month] = cycleEnd.split("-").map(Number);
  // Day 0 of a month is the last day of the month before it.
  const lastDay = new Date(Date.UTC(year, month - 1, 0));
  const day = Math.min(closingDay, lastDay.getUTCDate());
  return `${lastDay.getUTCFullYear()}-${String(lastDay.getUTCMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Sum of the cycle that closes on `cycleEnd`: purchases after the previous closing, up to it. */
export function billTotal(card: typeof CARD, cycleEnd: string): number {
  const start = previousClosing(cycleEnd, card.closingDay);
  return card.purchases
    .filter((p) => p.date > start && p.date <= cycleEnd)
    .reduce((sum, p) => sum + p.amount, 0);
}
