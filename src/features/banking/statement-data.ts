import { addDays, samePointLastMonth } from "@/insights/spending";
import { TODAY, TRANSACTIONS, type Transaction } from "@/mocks/marina";
import { DASHBOARD } from "./dashboard-data";
import { formatDay } from "./format";
import { SEGMENTS, segmentOf, type SegmentKey } from "./segments";

export type DayGroup = { date: string; label: string; total: number; items: Transaction[] };
export type MonthGroup = {
  key: string;
  label: string;
  income: number;
  spent: number;
  segments: { key: SegmentKey; label: string; spent: number }[];
  days: DayGroup[];
};

function dayLabel(date: string): string {
  if (date === TODAY) return "Hoje";
  if (date === addDays(TODAY, -1)) return "Ontem";
  return formatDay(date, { weekday: "long", day: "numeric", month: "short" });
}

/** Newest first, grouped by month and then by day. */
function groupStatement(rows: readonly Transaction[]): MonthGroup[] {
  const months = new Map<string, MonthGroup>();
  for (const t of rows) {
    const key = t.date.slice(0, 7);
    let month = months.get(key);
    if (!month) {
      month = {
        key,
        label: formatDay(`${key}-01`, { month: "long", year: "numeric" }),
        income: 0,
        spent: 0,
        segments: SEGMENTS.map((s) => ({ ...s, spent: 0 })),
        days: [],
      };
      months.set(key, month);
    }
    if (t.amount > 0) month.income += t.amount;
    else {
      month.spent -= t.amount;
      const segment = month.segments.find((s) => s.key === segmentOf(t.category));
      if (segment) segment.spent -= t.amount;
    }
    let day = month.days.at(-1);
    if (!day || day.date !== t.date) {
      day = { date: t.date, label: dayLabel(t.date), total: 0, items: [] };
      month.days.push(day);
    }
    day.total += t.amount;
    day.items.push(t);
  }
  return [...months.values()];
}

export const STATEMENT = groupStatement(TRANSACTIONS);

/*
 * Rule 2 in the middle of the list: the comparison sits right after the latest purchase
 * of the category that rose, where the person would notice it anyway.
 */
const comparison = DASHBOARD.comparison;
const monthPrefix = TODAY.slice(0, 7);
const thisMonth = comparison
  ? TRANSACTIONS.filter((t) => t.category === comparison.category && t.date.startsWith(monthPrefix))
  : [];
const lastPeriod = samePointLastMonth(TODAY);
const lastMonth = comparison
  ? TRANSACTIONS.filter(
      (t) =>
        t.category === comparison.category &&
        t.date >= lastPeriod.start &&
        t.date <= lastPeriod.end,
    )
  : [];

export const INSIGHT = comparison
  ? {
      ...comparison,
      anchorId: thisMonth[0]?.id,
      countNow: thisMonth.length,
      countBefore: lastMonth.length,
    }
  : null;

export type StatementInsight = NonNullable<typeof INSIGHT>;

/** The JSON shape of GET /api/extrato. */
export type StatementData = { months: MonthGroup[]; insight: StatementInsight | null };
export const STATEMENT_DATA: StatementData = { months: STATEMENT, insight: INSIGHT };
