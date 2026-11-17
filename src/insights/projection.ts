/**
 * Rule 1 · Projection until the next payday.
 * Pure function: integer cents in, plain data out. No React, no formatting.
 * See docs/superpowers/specs/2026-11-16-ambar-concept-design.md, section 2.1.
 */

export type ProjectionInput = {
  /** Current balance, in cents. */
  balance: number;
  /** Bills already scheduled until payday, in cents. */
  scheduled: number;
  /** Average variable spending per day, in cents. */
  dailySpending: number;
  /** Days left until payday (at least 1). */
  daysLeft: number;
};

export type ProjectionStatus = "comfortable" | "tight" | "short";

export type Projection = {
  /** What is left on payday, in cents. Negative means money runs out. */
  leftover: number;
  status: ProjectionStatus;
  /** Share of the free money (balance − scheduled) still there on payday, 0 to 1. */
  share: number;
  /** When short: how much less to spend per day to make it, in cents. Otherwise 0. */
  dailyCut: number;
};

/** "Comfortable" means at least 10% of a month of daily spending is left over. */
const COMFORT_RATIO = 0.1;
const DAYS_IN_MONTH = 30;

export function projectUntilPayday({
  balance,
  scheduled,
  dailySpending,
  daysLeft,
}: ProjectionInput): Projection {
  const days = Math.max(1, Math.floor(daysLeft));
  const free = balance - scheduled;
  const leftover = free - dailySpending * days;

  const comfortLine = dailySpending * DAYS_IN_MONTH * COMFORT_RATIO;
  const status: ProjectionStatus =
    leftover < 0 ? "short" : leftover >= comfortLine ? "comfortable" : "tight";

  const share = free > 0 ? Math.min(1, Math.max(0, leftover / free)) : 0;
  const dailyCut = leftover < 0 ? Math.ceil(-leftover / days) : 0;

  return { leftover, status, share, dailyCut };
}
