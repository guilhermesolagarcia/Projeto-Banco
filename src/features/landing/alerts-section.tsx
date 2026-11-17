import type { ReactNode } from "react";
import { Money } from "@/components/money";
import { Disclosure } from "@/components/motion/disclosure";
import { projectUntilPayday } from "@/insights/projection";
import {
  ACCOUNT,
  COMPARISON,
  DAYS_TO_PAYDAY,
  PAYDAY_DAY,
  RENEWAL,
  TODAY,
  formatDate,
} from "./example";
import { InViewItem, InViewList, RiseBar } from "./in-view";

// Rule 1: already explored in the simulator, so here it is just the short alert.
const projection = projectUntilPayday({ ...ACCOUNT, daysLeft: DAYS_TO_PAYDAY });

// Rule 2: same point of the month, last month vs. this month.
const { before: LAST_MONTH, now: THIS_MONTH } = COMPARISON;
const TODAY_DAY = TODAY.getUTCDate();

// Rule 3: the charge repeats every month; the history is how we know it is a subscription.
const { oldPrice: OLD_PRICE, newPrice: NEW_PRICE } = RENEWAL;
// The price went up at the last charge (October); tomorrow's amount is the prediction.
const monthsBefore = (back: number) =>
  new Date(
    Date.UTC(
      RENEWAL.date.getUTCFullYear(),
      RENEWAL.date.getUTCMonth() - back,
      RENEWAL.date.getUTCDate(),
    ),
  );
const monthLabel = (back: number) =>
  formatDate(monthsBefore(back), { month: "short" }).replace(".", "");
const RISE_MONTH = formatDate(monthsBefore(1), { month: "long" });
type Charge = { month: string; cents: number; kind: "past" | "rise" | "next" };
const HISTORY: Charge[] = [
  { month: monthLabel(3), cents: OLD_PRICE, kind: "past" },
  { month: monthLabel(2), cents: OLD_PRICE, kind: "past" },
  { month: monthLabel(1), cents: NEW_PRICE, kind: "rise" },
  { month: "amanhã", cents: NEW_PRICE, kind: "next" },
];
const BAR: Record<Charge["kind"], string> = {
  past: "bg-ink/10",
  rise: "bg-attention",
  next: "border-2 border-dashed border-attention/60",
};

const pct = (part: number, whole: number) => `${(part / whole) * 100}%`;

const TILE =
  "flex min-w-0 flex-col rounded-[2rem] bg-white p-6 sm:p-7 shadow-[0_1px_0_rgb(22_18_14/0.04),0_30px_60px_-40px_rgb(120_60_0/0.4)] md:p-9";

function Kind({ children, attention }: { children: ReactNode; attention?: boolean }) {
  return (
    <p className="flex items-center gap-2 text-sm font-medium text-ink-muted">
      {attention ? (
        <span className="text-attention">
          <BellIcon />
        </span>
      ) : (
        <span aria-hidden="true" className="size-2 rounded-full bg-amber-signal" />
      )}
      {children}
    </p>
  );
}

/** "How we know", one click away: the math is always available, never in the way. */
function How({ children }: { children: ReactNode }) {
  return (
    <Disclosure label="Como sabemos?" className="mt-auto border-t border-ink/10 pt-4 text-sm">
      <p className="text-ink-muted">{children}</p>
    </Disclosure>
  );
}

function BellIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path
        d="M10 3a4.5 4.5 0 0 0-4.5 4.5c0 3.5-1.5 5-1.5 5h12s-1.5-1.5-1.5-5A4.5 4.5 0 0 0 10 3Z"
        strokeLinejoin="round"
      />
      <path d="M8.5 15.5a1.5 1.5 0 0 0 3 0" strokeLinecap="round" />
    </svg>
  );
}

export function AlertsSection() {
  return (
    <section id="avisos" aria-labelledby="avisos-title" className="bg-paper">
      <div className="shell py-24 md:pt-32 md:pb-36">
        <div className="reveal grid gap-6 md:grid-cols-2 md:items-end md:gap-16">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-ink-muted uppercase">
              <span aria-hidden="true" className="size-2 rounded-full bg-amber-signal" />
              Avisos
            </p>
            <h2
              id="avisos-title"
              className="mt-4 text-4xl leading-[1.02] font-semibold tracking-[-0.035em] sm:text-5xl lg:text-6xl"
            >
              Ele te avisa antes, não depois.
            </h2>
          </div>
          <p className="max-w-lg text-lg leading-relaxed text-ink-muted">
            Três tipos de aviso, calculados a partir das suas transações. Poucos, no momento certo e
            sempre com a conta à mostra.
          </p>
        </div>

        <InViewList className="mt-14 grid gap-5 md:grid-cols-5 md:gap-6">
          {/* Rule 3 · Renewal: the big tile, because it is the one that asks for action */}
          <InViewItem className={`${TILE} md:col-span-3 md:row-span-2`}>
            <Kind attention>Renovação</Kind>
            <h3 className="mt-6 text-2xl leading-snug font-semibold tracking-tight md:text-3xl">
              {RENEWAL.merchant} renova amanhã.
            </h3>
            <p className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="text-6xl leading-none font-semibold tracking-[-0.045em] sm:text-7xl">
                <Money cents={NEW_PRICE} />
              </span>
              <span className="text-ink-muted">
                <Money cents={NEW_PRICE - OLD_PRICE} className="font-medium text-attention" /> mais
                caro desde {RISE_MONTH}
              </span>
            </p>

            <ol
              aria-label="Cobranças dos últimos meses"
              className="mt-10 mb-10 flex items-end gap-1.5 sm:gap-3"
            >
              {HISTORY.map((charge, index) => (
                <li
                  key={charge.month}
                  className="flex min-w-0 flex-1 flex-col items-center gap-2 text-xs sm:text-sm"
                >
                  <span className={charge.kind === "past" ? "text-ink-muted" : "font-medium"}>
                    <Money cents={charge.cents} />
                  </span>
                  <RiseBar
                    delay={0.25 + index * 0.08}
                    className={`w-8 rounded-lg sm:w-10 ${BAR[charge.kind]}`}
                    style={{ height: `${(charge.cents / NEW_PRICE) * 6}rem` }}
                  />
                  <span className="block text-ink-muted first-letter:uppercase">
                    {charge.kind === "next" ? "amanhã (previsto)" : charge.month}
                  </span>
                </li>
              ))}
            </ol>

            <How>
              A mesma cobrança a cada ~30 dias, e cada uma até 20% diferente da anterior. A próxima
              é prevista pelo intervalo médio. Se não usa mais, dá tempo de cancelar.
            </How>
          </InViewItem>

          {/* Rule 2 · Comparison */}
          <InViewItem className={`${TILE} md:col-span-2`}>
            <Kind>Comparação</Kind>
            <h3 className="mt-6 text-xl font-semibold tracking-tight">
              <Money cents={COMPARISON.difference} /> a mais com {COMPARISON.label}.
            </h3>
            <dl className="mt-8 mb-8 space-y-4 text-sm">
              <div>
                <div className="flex justify-between text-ink-muted">
                  <dt>Mês passado, até dia {TODAY_DAY}</dt>
                  <dd>
                    <Money cents={LAST_MONTH} />
                  </dd>
                </div>
                <div
                  aria-hidden="true"
                  className="reveal-grow mt-2 h-2.5 origin-left rounded-pill bg-ink/15"
                  style={{ width: pct(LAST_MONTH, THIS_MONTH) }}
                />
              </div>
              <div>
                <div className="flex justify-between font-medium">
                  <dt>Este mês, até dia {TODAY_DAY}</dt>
                  <dd>
                    <Money cents={THIS_MONTH} />
                  </dd>
                </div>
                <div
                  aria-hidden="true"
                  className="reveal-grow mt-2 h-2.5 origin-left rounded-pill bg-amber"
                />
              </div>
            </dl>
            <How>O mesmo período nos dois meses, para a comparação ser justa.</How>
          </InViewItem>

          {/* Rule 1 · Projection: short here, the simulator above already lets you play with it */}
          <InViewItem className={`${TILE} md:col-span-2`}>
            <Kind>Projeção</Kind>
            <h3 className="mt-6 text-xl font-semibold tracking-tight">
              Dá para chegar até dia {PAYDAY_DAY} com folga.
            </h3>
            <p className="mt-6 mb-8 flex items-baseline gap-3">
              <span className="text-3xl font-semibold tracking-tight">
                <Money cents={projection.leftover} />
              </span>
              <span className="text-sm text-ink-muted">sobram no dia do salário</span>
            </p>
            <How>
              A mesma conta do simulador: saldo − contas agendadas − gasto médio por dia × dias até
              o salário.
            </How>
          </InViewItem>
        </InViewList>
      </div>
    </section>
  );
}
