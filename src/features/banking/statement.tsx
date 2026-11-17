"use client";

/*
 * The statement: one month at a time, filterable by segment.
 * Month summary on top, then the list by day. Rule 2 (category comparison) sits in the middle
 * of the list, right after the purchase that confirms it.
 */
import * as m from "motion/react-m";
import { useState, type ReactNode } from "react";
import { Money } from "@/components/money";
import type { Transaction } from "@/mocks/marina";
import { CARD } from "./dashboard-skeleton";
import { CATEGORY_LABEL, formatDay } from "./format";
import { MATERIALIZE, SNAP, SPRING } from "@/components/motion/presets";
import { SEGMENTS, SEGMENT_COLOR, segmentOf, type SegmentKey } from "./segments";
import type { DayGroup, MonthGroup, StatementData, StatementInsight } from "./statement-data";

type Filter = SegmentKey | "todos";

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

function InsightNote({ insight }: { insight: StatementInsight }) {
  return (
    // The one thing in the statement that asks for attention: it arrives as you reach it.
    <m.div
      role="note"
      variants={MATERIALIZE}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.6 }}
      className="rounded-2xl border border-amber-signal/25 bg-amber/[0.07] p-4"
    >
      <p className="flex items-center gap-2 text-sm font-medium text-ink-muted">
        <span aria-hidden="true" className="size-2 rounded-full bg-amber-signal" />
        Comparação
      </p>
      <p className="mt-2 font-semibold tracking-tight">
        <Money cents={insight.difference} /> a mais com{" "}
        {CATEGORY_LABEL[insight.category].toLowerCase()} este mês.
      </p>
      <p className="mt-1 text-sm text-ink-muted">
        Até hoje: <Money cents={insight.now} /> em {insight.countNow} pedidos. No mesmo ponto do mês
        passado: <Money cents={insight.before} /> em {insight.countBefore}.
      </p>
    </m.div>
  );
}

/* ---------- Filters: native radio groups (arrows move, screen readers say "2 of 4") ---------- */

function MonthOption({
  label,
  checked,
  onSelect,
}: {
  label: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <label className="relative isolate cursor-pointer rounded-pill px-4 py-2 text-sm font-medium text-ink-muted transition-colors has-checked:text-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-amber-signal">
      <input
        type="radio"
        name="statement-month"
        checked={checked}
        onChange={onSelect}
        className="sr-only"
      />
      {checked && (
        <m.span
          layoutId="month-pill"
          transition={SNAP}
          aria-hidden="true"
          className="absolute inset-0 -z-10 rounded-pill bg-white shadow-[0_1px_2px_rgb(22_18_14/0.08),0_4px_14px_-6px_rgb(22_18_14/0.2)]"
        />
      )}
      {/* first-letter only works on blocks: inline-block, so "novembro" shows as "Novembro". */}
      <span className="inline-block first-letter:uppercase">{label}</span>
    </label>
  );
}

function SegmentOption({
  label,
  dot,
  checked,
  onSelect,
}: {
  label: string;
  dot?: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <label className="relative flex shrink-0 cursor-pointer items-center gap-2 rounded-pill border border-ink/10 bg-white px-3.5 py-1.5 text-sm text-ink-muted transition-colors hover:border-ink/25 has-checked:border-ink has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-amber-signal">
      <input
        type="radio"
        name="statement-segment"
        checked={checked}
        onChange={onSelect}
        className="sr-only"
      />
      {dot && <span aria-hidden="true" className={`size-2 rounded-full ${dot}`} />}
      {label}
    </label>
  );
}

function FilterBar({ children }: { children: ReactNode }) {
  // Sticks while scrolling, as a translucent material over the list (like iOS bars).
  return (
    <div className="sticky top-0 z-20 -mx-5 space-y-3 bg-paper/80 px-5 py-3 backdrop-blur-xl sm:-mx-0 sm:rounded-b-2xl sm:px-0">
      {children}
    </div>
  );
}

/* ---------- Summary ---------- */

function MonthSummary({
  month,
  current,
  active,
}: {
  month: MonthGroup;
  current: boolean;
  active: Filter;
}) {
  const segments = month.segments.filter((s) => s.spent > 0);
  const dimmed = (key: SegmentKey) => active !== "todos" && active !== key;
  return (
    <div className={`${CARD} grid gap-8 md:grid-cols-[1fr_17rem] md:items-center`}>
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
          {segments.map((s, index) => (
            <m.span
              key={s.key}
              title={s.label}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1, opacity: dimmed(s.key) ? 0.25 : 1 }}
              // Builds once with a delay; dimming answers the filter right away.
              transition={{ scaleX: { ...SPRING, delay: 0.2 + index * 0.06 }, opacity: SNAP }}
              className={`min-w-1.5 origin-left rounded-pill ${SEGMENT_COLOR[s.key]}`}
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
          <li
            key={s.key}
            className={`flex items-center gap-2.5 transition-opacity duration-300 ${dimmed(s.key) ? "opacity-40" : ""}`}
          >
            <span
              aria-hidden="true"
              className={`size-2.5 shrink-0 rounded-full ${SEGMENT_COLOR[s.key]}`}
            />
            <span className="text-ink-muted md:whitespace-nowrap">{s.label}</span>
            <span className="ml-auto pl-4 tabular-nums">
              <Money cents={s.spent} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- List ---------- */

function Day({ day, insight }: { day: DayGroup; insight: StatementInsight | null }) {
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
            {insight && t.id === insight.anchorId && (
              <div className="pb-4">
                <InsightNote insight={insight} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function matches(t: Transaction, filter: Filter): boolean {
  // Money in only shows under "Tudo": the segments are about where the money went.
  return filter === "todos" || (t.amount < 0 && segmentOf(t.category) === filter);
}

export function Statement({ data }: { data: StatementData }) {
  const [monthKey, setMonthKey] = useState(data.months[0].key);
  const [filter, setFilter] = useState<Filter>("todos");

  const month = data.months.find((item) => item.key === monthKey) ?? data.months[0];
  const isCurrent = month.key === data.months[0].key;
  const days = month.days
    .map((day) => {
      const items = day.items.filter((t) => matches(t, filter));
      return { ...day, items, total: items.reduce((sum, t) => sum + t.amount, 0) };
    })
    .filter((day) => day.items.length > 0);
  const count = days.reduce((sum, day) => sum + day.items.length, 0);
  const insight =
    isCurrent && data.insight && (filter === "todos" || filter === segmentOf(data.insight.category))
      ? data.insight
      : null;

  const monthName = formatDay(`${month.key}-01`, { month: "long" });
  const filterLabel =
    filter === "todos" ? "" : ` de ${SEGMENTS.find((s) => s.key === filter)?.label.toLowerCase()}`;

  return (
    <div className="space-y-6">
      <FilterBar>
        {/* min-w-0: a fieldset is min-content wide by default and would push the page sideways. */}
        <fieldset className="min-w-0">
          <legend className="sr-only">Mês</legend>
          <div className="inline-flex flex-wrap rounded-pill bg-ink/[0.06] p-1">
            {data.months.map((item) => (
              <MonthOption
                key={item.key}
                label={formatDay(`${item.key}-01`, { month: "long" })}
                checked={item.key === month.key}
                onSelect={() => setMonthKey(item.key)}
              />
            ))}
          </div>
        </fieldset>
        <fieldset className="min-w-0">
          <legend className="sr-only">Categoria</legend>
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
            <SegmentOption
              label="Tudo"
              checked={filter === "todos"}
              onSelect={() => setFilter("todos")}
            />
            {SEGMENTS.map((s) => (
              <SegmentOption
                key={s.key}
                label={s.label}
                dot={SEGMENT_COLOR[s.key]}
                checked={filter === s.key}
                onSelect={() => setFilter(s.key)}
              />
            ))}
          </div>
        </fieldset>
      </FilterBar>

      <p aria-live="polite" className="sr-only">
        {count} {count === 1 ? "transação" : "transações"}
        {filterLabel} em {monthName}.
      </p>

      <MonthSummary month={month} current={isCurrent} active={filter} />

      {/* Re-keyed on every change, so the new list materializes instead of jumping. */}
      <div key={`${month.key}-${filter}`} className="space-y-6">
        {days.length === 0 ? (
          <m.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${CARD} text-ink-muted`}
          >
            Nenhum gasto{filterLabel} em {monthName}.
          </m.p>
        ) : (
          days.map((day, index) => (
            <m.div
              key={day.date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              // Only the first few stagger, so a long month never feels slow.
              transition={{ ...SPRING, delay: Math.min(index, 6) * 0.04 }}
            >
              <Day day={day} insight={insight} />
            </m.div>
          ))
        )}
      </div>
    </div>
  );
}
