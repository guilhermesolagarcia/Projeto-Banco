/*
 * The statement: list by day (A), with a month summary on top (from B).
 * Rule 2 (category comparison) sits in the middle of the list, right after the purchase
 * that confirms it, where the person would notice it anyway.
 */
import { Money } from "@/components/money";
import type { Transaction } from "@/mocks/marina";
import { CARD } from "./dashboard-skeleton";
import { CATEGORY_LABEL } from "./format";
import {
  INSIGHT,
  STATEMENT,
  type DayGroup,
  type MonthGroup,
  type SegmentKey,
} from "./statement-data";

function Amount({ cents, className = "" }: { cents: number; className?: string }) {
  // Money in is green; money out stays ink. Spending is not an error.
  return (
    <span className={`shrink-0 tabular-nums ${cents > 0 ? "text-positive" : ""} ${className}`}>
      {cents > 0 ? "+ " : "− "}
      <Money cents={Math.abs(cents)} />
    </span>
  );
}

function Row({ t }: { t: Transaction }) {
  return (
    <div className="flex items-center gap-4 py-3.5">
      <span
        aria-hidden="true"
        className={`grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold ${t.amount > 0 ? "bg-positive/10 text-positive" : "bg-ink/[0.06] text-ink-muted"}`}
      >
        {t.merchant.charAt(0)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{t.merchant}</p>
        <p className="text-sm text-ink-muted">{CATEGORY_LABEL[t.category]}</p>
      </div>
      <Amount cents={t.amount} className="font-medium" />
    </div>
  );
}

function InsightNote() {
  if (!INSIGHT) return null;
  return (
    <div role="note" className="rounded-2xl border border-amber-signal/25 bg-amber/[0.07] p-4">
      <p className="flex items-center gap-2 text-sm font-medium text-ink-muted">
        <span aria-hidden="true" className="size-2 rounded-full bg-amber-signal" />
        Comparação
      </p>
      <p className="mt-2 font-semibold tracking-tight">
        <Money cents={INSIGHT.difference} /> a mais com{" "}
        {CATEGORY_LABEL[INSIGHT.category].toLowerCase()} este mês.
      </p>
      <p className="mt-1 text-sm text-ink-muted">
        Até hoje: <Money cents={INSIGHT.now} /> em {INSIGHT.countNow} pedidos. No mesmo ponto do mês
        passado: <Money cents={INSIGHT.before} /> em {INSIGHT.countBefore}.
      </p>
    </div>
  );
}

// One color per segment, always the same (tokens in globals.css). Written out for Tailwind.
const SEGMENT_COLOR: Record<SegmentKey, string> = {
  fixas: "bg-cat-fixas",
  lazer: "bg-cat-lazer",
  transporte: "bg-cat-transporte",
  mercado: "bg-cat-mercado",
  saude: "bg-cat-saude",
  delivery: "bg-cat-delivery",
};

function MonthSummary({ month, current }: { month: MonthGroup; current: boolean }) {
  const segments = month.segments.filter((s) => s.spent > 0);
  return (
    <div className={`${CARD} grid gap-8 md:grid-cols-[1fr_15rem] md:items-center`}>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight first-letter:uppercase">
          {month.label}
          {current && <span className="ml-2 text-base font-normal text-ink-muted">até hoje</span>}
        </h2>
        <dl className="mt-7 grid grid-cols-2 gap-6">
          <div>
            <dt className="text-sm text-ink-muted">Entrou</dt>
            <dd className="mt-1 text-2xl font-semibold text-positive tabular-nums">
              <Money cents={month.income} />
            </dd>
          </div>
          <div>
            <dt className="text-sm text-ink-muted">Saiu</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              <Money cents={month.spent} />
            </dd>
          </div>
        </dl>
        {/* The bar is decorative for screen readers: the legend next to it writes every value. */}
        <div aria-hidden="true" className="mt-8 flex h-4 gap-1">
          {segments.map((s) => (
            <span
              key={s.key}
              title={s.label}
              className={`min-w-1.5 rounded-pill ${SEGMENT_COLOR[s.key]}`}
              style={{ width: `${(s.spent / month.spent) * 100}%` }}
            />
          ))}
        </div>
      </div>

      {/* Legend in its own box, beside the bar on wide screens, below it on phones. */}
      <ul
        aria-label="Para onde foi o dinheiro"
        className="space-y-3 rounded-2xl bg-paper p-5 text-sm"
      >
        {segments.map((s) => (
          <li key={s.key} className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className={`size-2.5 shrink-0 rounded-full ${SEGMENT_COLOR[s.key]}`}
            />
            <span className="text-ink-muted">{s.label}</span>
            <span className="ml-auto pl-4 tabular-nums">
              <Money cents={s.spent} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Day({ day }: { day: DayGroup }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 px-1 text-sm">
        <h3 className="font-semibold first-letter:uppercase">{day.label}</h3>
        <Amount cents={day.total} className="text-ink-muted" />
      </div>
      <ul className="mt-2 rounded-[1.75rem] bg-white px-5 py-1 shadow-[0_1px_0_rgb(22_18_14/0.04),0_20px_50px_-36px_rgb(120_60_0/0.4)]">
        {day.items.map((t) => (
          <li key={t.id} className="border-t border-ink/10 first:border-t-0">
            <Row t={t} />
            {t.id === INSIGHT?.anchorId && (
              <div className="pb-4">
                <InsightNote />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Statement() {
  return (
    <div className="space-y-14">
      {STATEMENT.map((month, index) => (
        <section key={month.key} aria-label={month.label} className="space-y-6">
          <MonthSummary month={month} current={index === 0} />
          {month.days.map((day) => (
            <Day key={day.date} day={day} />
          ))}
        </section>
      ))}
    </div>
  );
}
