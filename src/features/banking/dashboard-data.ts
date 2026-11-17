import { projectUntilPayday } from "@/insights/projection";
import { findRenewals } from "@/insights/recurring";
import { averageDailySpending, compareWithLastMonth, daysBetween } from "@/insights/spending";
import {
  OPENING_BALANCE,
  PAYDAY,
  SCHEDULED,
  TODAY,
  TRANSACTIONS,
  VARIABLE_CATEGORIES,
} from "@/mocks/marina";

/*
 * Everything the dashboard shows, computed by the insight rules from Marina's data.
 * Served by the fake API (src/mocks/handlers.ts) and read by the landing on the server.
 */
const balance = OPENING_BALANCE + TRANSACTIONS.reduce((sum, t) => sum + t.amount, 0);
const scheduled = SCHEDULED.reduce((sum, s) => sum + s.amount, 0);
const dailySpending = averageDailySpending(TRANSACTIONS, TODAY, VARIABLE_CATEGORIES);
const daysLeft = daysBetween(TODAY, PAYDAY);

export const DASHBOARD = {
  today: TODAY,
  payday: PAYDAY,
  balance,
  scheduled,
  dailySpending,
  daysLeft,
  projection: projectUntilPayday({ balance, scheduled, dailySpending, daysLeft }),
  comparison: compareWithLastMonth(TRANSACTIONS, TODAY, VARIABLE_CATEGORIES),
  renewals: findRenewals(TRANSACTIONS, TODAY),
  recent: TRANSACTIONS.slice(0, 6),
};

/** The JSON shape of GET /api/painel. */
export type DashboardData = typeof DASHBOARD;
