/**
 * Marina's month as the landing tells it. Nothing here is typed by hand: every number comes
 * from the insight rules running over her data (src/mocks/marina.ts), the same as the dashboard.
 * Server-only on purpose: client components get these values through props.
 * UTC everywhere, so server and browser render the same text.
 */
import { CATEGORY_LABEL, DASHBOARD } from "@/features/banking/dashboard-data";

const DAY_MS = 86_400_000;
const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

export function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / DAY_MS);
}

export function formatDate(date: Date, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", ...options }).format(date);
}

export const TODAY = toDate(DASHBOARD.today);
export const PAYDAY = toDate(DASHBOARD.payday);
export const PAYDAY_DAY = PAYDAY.getUTCDate();
export const DAYS_TO_PAYDAY = DASHBOARD.daysLeft;

/** Rule 1 inputs, in cents. */
export const ACCOUNT = {
  balance: DASHBOARD.balance,
  scheduled: DASHBOARD.scheduled,
  dailySpending: DASHBOARD.dailySpending,
};

// The landing's story needs one renewal and one comparison; check:insights guarantees both.
const renewal = DASHBOARD.renewals[0];
const comparison = DASHBOARD.comparison;
if (!renewal || !comparison) throw new Error("Marina's data no longer tells the landing story.");

/** Rule 3: the subscription that renews next, and its price before the rise. */
export const RENEWAL = {
  merchant: renewal.merchant,
  date: toDate(renewal.nextDate),
  oldPrice: renewal.amount - renewal.increase,
  newPrice: renewal.amount,
};

/** Rule 2: the biggest rise at the same point of last month. */
export const COMPARISON = {
  ...comparison,
  label: CATEGORY_LABEL[comparison.category].toLowerCase(),
};
