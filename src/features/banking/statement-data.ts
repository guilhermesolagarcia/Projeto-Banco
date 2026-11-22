import { addDays, compareWithLastMonth, samePointLastMonth } from "@/insights/spending";
import { TODAY, TRANSACTIONS, VARIABLE_CATEGORIES, type Transaction } from "@/mocks/marina";
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

/*
 * Rule 2 in the middle of the list: the comparison sits right after the latest purchase
 * of the category that rose, where the person would notice it anyway.
 */
function insightFor(transactions: readonly Transaction[]) {
  const comparison = compareWithLastMonth(transactions, TODAY, VARIABLE_CATEGORIES);
  if (!comparison) return null;
  const monthPrefix = TODAY.slice(0, 7);
  const lastPeriod = samePointLastMonth(TODAY);
  const ofCategory = transactions.filter((t) => t.category === comparison.category);
  const thisMonth = ofCategory.filter((t) => t.date.startsWith(monthPrefix));
  const lastMonth = ofCategory.filter(
    (t) => t.date >= lastPeriod.start && t.date <= lastPeriod.end,
  );
  return {
    ...comparison,
    anchorId: thisMonth[0]?.id,
    countNow: thisMonth.length,
    countBefore: lastMonth.length,
  };
}

export type StatementInsight = NonNullable<ReturnType<typeof insightFor>>;

/** The JSON shape of GET /api/extrato. */
export type StatementData = { months: MonthGroup[]; insight: StatementInsight | null };

/** The statement of any list of transactions: Marina's history plus the demo actions. */
export function buildStatement(transactions: readonly Transaction[]): StatementData {
  return { months: groupStatement(transactions), insight: insightFor(transactions) };
}

export const STATEMENT_DATA: StatementData = buildStatement(TRANSACTIONS);
