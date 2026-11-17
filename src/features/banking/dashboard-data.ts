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
  type Category,
} from "@/mocks/marina";

/*
 * Everything the dashboard shows, computed by the insight rules from Marina's data.
 * Step 4 of Phase 3 moves this behind MSW + TanStack Query; the shape stays the same.
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

export const CATEGORY_LABEL: Record<Category, string> = {
  salario: "Salário",
  moradia: "Moradia",
  educacao: "Educação",
  contas: "Contas",
  assinaturas: "Assinaturas",
  mercado: "Mercado",
  delivery: "Delivery",
  transporte: "Transporte",
  lazer: "Lazer",
  saude: "Saúde",
};

/** "YYYY-MM-DD" → text in pt-BR, read as a calendar day (UTC) so server and browser agree. */
export function formatDay(iso: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", ...options }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}
