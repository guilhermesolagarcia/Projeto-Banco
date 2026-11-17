/**
 * Marina's month: the single example every landing section tells.
 * Dates and day counts are derived from TODAY and PAYDAY, so the page can't contradict itself.
 * UTC everywhere, so server and browser render the same text.
 */
const DAY_MS = 86_400_000;

export const TODAY = new Date(Date.UTC(2026, 10, 23)); // Monday, November 23
export const PAYDAY = new Date(Date.UTC(2026, 11, 5)); // December 5

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

export function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / DAY_MS);
}

export function formatDate(date: Date, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", ...options }).format(date);
}

export const PAYDAY_DAY = PAYDAY.getUTCDate();
export const DAYS_TO_PAYDAY = daysBetween(TODAY, PAYDAY);

/** Rule 1 inputs, in cents: 4.218,90 − 2.958,90 − 54,00 × 12 = 612,00. */
export const ACCOUNT = { balance: 421890, scheduled: 295890, dailySpending: 5400 };

/** Rule 3: streaming renews tomorrow, R$ 5 more than last month. */
export const RENEWAL = { date: addDays(TODAY, 1), oldPrice: 3490, newPrice: 3990 };
