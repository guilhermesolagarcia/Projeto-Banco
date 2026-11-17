/**
 * Rule 3 · Recurring charge about to renew.
 * Pure function: transactions in (integer cents, "YYYY-MM-DD"), plain data out. No React.
 * See docs/superpowers/specs/2026-11-16-ambar-concept-design.md, section 2.1.
 */
import { addDays, daysBetween } from "./spending.ts";

export type ChargeRow = { date: string; merchant: string; amount: number };

export type Renewal = {
  merchant: string;
  /** Predicted date of the next charge. */
  nextDate: string;
  daysUntil: number;
  /** Last amount charged, in cents (positive). */
  amount: number;
  /** How much more than the previous price, when the price went up. Otherwise 0. */
  increase: number;
  /** Date of the first charge at the current price, when it went up. */
  increasedOn: string | null;
};

const MIN_CHARGES = 3;
const MIN_INTERVAL = 28;
const MAX_INTERVAL = 31;
/** Each charge may differ from the previous one by up to 20% (a price change is still the same subscription). */
const MAX_STEP = 0.2;

function asRenewal(merchant: string, charges: readonly ChargeRow[], today: string): Renewal | null {
  if (charges.length < MIN_CHARGES) return null;

  const intervals: number[] = [];
  for (let i = 1; i < charges.length; i++) {
    const interval = daysBetween(charges[i - 1].date, charges[i].date);
    const previous = -charges[i - 1].amount;
    const current = -charges[i].amount;
    if (interval < MIN_INTERVAL || interval > MAX_INTERVAL) return null;
    if (Math.abs(current - previous) > previous * MAX_STEP) return null;
    intervals.push(interval);
  }

  const average = intervals.reduce((sum, days) => sum + days, 0) / intervals.length;
  const last = charges[charges.length - 1];
  const nextDate = addDays(last.date, Math.round(average));
  const amount = -last.amount;

  // Walk back to where the current price started.
  let start = charges.length - 1;
  while (start > 0 && -charges[start - 1].amount === amount) start--;
  const previousPrice = start > 0 ? -charges[start - 1].amount : amount;

  return {
    merchant,
    nextDate,
    daysUntil: daysBetween(today, nextDate),
    amount,
    increase: Math.max(0, amount - previousPrice),
    increasedOn: amount > previousPrice ? charges[start].date : null,
  };
}

/** Recurring charges whose next renewal is within `withinDays` days (default: 2), soonest first. */
export function findRenewals(rows: readonly ChargeRow[], today: string, withinDays = 2): Renewal[] {
  const byMerchant = new Map<string, ChargeRow[]>();
  for (const row of rows) {
    if (row.amount >= 0 || row.date > today) continue;
    const list = byMerchant.get(row.merchant) ?? [];
    list.push(row);
    byMerchant.set(row.merchant, list);
  }

  const renewals: Renewal[] = [];
  for (const [merchant, list] of byMerchant) {
    const charges = [...list].sort((a, b) => a.date.localeCompare(b.date));
    const renewal = asRenewal(merchant, charges, today);
    if (renewal && renewal.daysUntil >= 0 && renewal.daysUntil <= withinDays) {
      renewals.push(renewal);
    }
  }
  return renewals.sort((a, b) => a.daysUntil - b.daysUntil);
}
