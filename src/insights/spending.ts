/**
 * Rule 1 input and Rule 2 · Category comparison.
 * Pure functions: transactions in (integer cents, "YYYY-MM-DD"), plain data out. No React.
 * See docs/superpowers/specs/2026-11-16-ambar-concept-design.md, section 2.1.
 */

export type SpendingRow = { date: string; category: string; amount: number };

const DAY_MS = 86_400_000;

export function addDays(iso: string, days: number): string {
  return new Date(Date.parse(iso) + days * DAY_MS).toISOString().slice(0, 10);
}

export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(to) - Date.parse(from)) / DAY_MS);
}

function spent(rows: readonly SpendingRow[], from: string, to: string, category?: string): number {
  let total = 0;
  for (const row of rows) {
    if (row.amount < 0 && row.date >= from && row.date <= to) {
      if (category === undefined || row.category === category) total -= row.amount;
    }
  }
  return total;
}

/** Rule 1: variable spending over the last `days` days (today included) ÷ `days`, in cents. */
export function averageDailySpending(
  rows: readonly SpendingRow[],
  today: string,
  categories: readonly string[],
  days = 60,
): number {
  const variable = rows.filter((row) => categories.includes(row.category));
  return Math.round(spent(variable, addDays(today, -(days - 1)), today) / days);
}

export type Comparison<C extends string = string> = {
  category: C;
  /** Spent from day 1 to today's day, last month. */
  before: number;
  /** Spent from day 1 to today, this month. */
  now: number;
  difference: number;
};

/**
 * Day 1 of last month up to the same day as today (clamped: Mar 31 → Feb 28).
 * Date.UTC handles the year turn, so January compares with December.
 */
export function samePointLastMonth(today: string): { start: string; end: string } {
  const [year, month, day] = today.split("-").map(Number);
  const start = new Date(Date.UTC(year, month - 2, 1)).toISOString().slice(0, 10);
  const lastMonthDays = new Date(Date.UTC(year, month - 1, 0)).getUTCDate();
  return { start, end: addDays(start, Math.min(day, lastMonthDays) - 1) };
}

/** Shown only when the rise is at least R$ 50 and at least 20%. */
const MIN_DIFFERENCE = 5000;
const MIN_RATIO = 0.2;

/**
 * Rule 2: compares each category with the same point of last month and returns the biggest
 * rise worth mentioning, or null when nothing changed enough.
 */
export function compareWithLastMonth<C extends string>(
  rows: readonly SpendingRow[],
  today: string,
  categories: readonly C[],
): Comparison<C> | null {
  const monthStart = today.slice(0, 8) + "01";
  const { start: lastStart, end: lastSameDay } = samePointLastMonth(today);

  let best: Comparison<C> | null = null;
  for (const category of categories) {
    const before = spent(rows, lastStart, lastSameDay, category);
    const now = spent(rows, monthStart, today, category);
    const difference = now - before;
    const worthIt = difference >= MIN_DIFFERENCE && difference >= before * MIN_RATIO;
    if (worthIt && (best === null || difference > best.difference)) {
      best = { category, before, now, difference };
    }
  }
  return best;
}
