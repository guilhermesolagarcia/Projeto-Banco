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
  type Transaction,
} from "@/mocks/marina";

/*
 * Everything the dashboard shows, computed by the insight rules from a list of transactions:
 * Marina's history plus whatever the visitor did in the demo (src/mocks/demo-state.ts).
 * Served by the fake API (src/mocks/handlers.ts).
 */
export function buildDashboard(transactions: readonly Transaction[]) {
  const balance = OPENING_BALANCE + transactions.reduce((sum, t) => sum + t.amount, 0);
  const scheduled = SCHEDULED.reduce((sum, s) => sum + s.amount, 0);
  const dailySpending = averageDailySpending(transactions, TODAY, VARIABLE_CATEGORIES);
  const daysLeft = daysBetween(TODAY, PAYDAY);
  return {
    today: TODAY,
    payday: PAYDAY,
    balance,
    scheduled,
    dailySpending,
    daysLeft,
    projection: projectUntilPayday({ balance, scheduled, dailySpending, daysLeft }),
    comparison: compareWithLastMonth(transactions, TODAY, VARIABLE_CATEGORIES),
    renewals: findRenewals(transactions, TODAY),
    recent: transactions.slice(0, 6),
  };
}

/** Marina's untouched history: what the landing shows, on the server. */
export const DASHBOARD = buildDashboard(TRANSACTIONS);

/** The JSON shape of GET /api/painel. */
export type DashboardData = ReturnType<typeof buildDashboard>;
