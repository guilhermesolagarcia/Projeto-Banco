import type { ReactNode } from "react";
import { Money } from "@/components/money";
import { projectUntilPayday } from "@/insights/projection";
import {
  ACCOUNT,
  DAYS_TO_PAYDAY as DAYS_LEFT,
  PAYDAY_DAY,
  RENEWAL,
  TODAY,
  formatDate,
} from "./example";

// Rule 1 runs for real here, with Marina's example (./example).
const { balance: BALANCE, scheduled: SCHEDULED, dailySpending: DAILY } = ACCOUNT;
const projection = projectUntilPayday({ ...ACCOUNT, daysLeft: DAYS_LEFT });
const SPENDING = DAILY * DAYS_LEFT;
const TODAY_DAY = TODAY.getUTCDate();

// Rule 2: same point of the month, last month vs. this month (delivery).
const LAST_MONTH = 26000;
const THIS_MONTH = 38000;

// Rule 3: a recurring charge whose price went up.
const { oldPrice: OLD_PRICE, newPrice: NEW_PRICE } = RENEWAL;
const RENEWAL_MONTH = formatDate(RENEWAL.date, { month: "short" }).replace(".", "");

const pct = (part: number, whole: number) => `${(part / whole) * 100}%`;

const TILE =
  "reveal flex flex-col rounded-[2rem] bg-white p-7 shadow-[0_1px_0_rgb(22_18_14/0.04),0_30px_60px_-40px_rgb(120_60_0/0.4)] md:p-9";

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
    <details className="group/how mt-auto border-t border-ink/10 pt-4 text-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-ink [&::-webkit-details-marker]:hidden">
        Como sabemos?
        <span
          aria-hidden="true"
          className="grid size-6 place-items-center rounded-full bg-ink/[0.06] text-base leading-none transition-[rotate] duration-300 ease-calm group-open/how:rotate-45"
        >
          +
        </span>
      </summary>
      <p className="mt-2 text-ink-muted">{children}</p>
    </details>
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

        <ul className="mt-14 grid gap-5 md:grid-cols-5 md:gap-6">
          {/* Rule 1 · Projection: the big tile */}
          <li className={`${TILE} md:col-span-3 md:row-span-2`}>
            <Kind>Projeção</Kind>
            <h3 className="mt-6 text-xl font-semibold tracking-tight md:text-2xl">
              Dá para chegar até dia {PAYDAY_DAY} com folga.
            </h3>
            <p className="mt-8 text-6xl leading-none font-semibold tracking-[-0.045em] sm:text-7xl">
              <Money cents={projection.leftover} />
            </p>
            <p className="mt-3 text-ink-muted">sobram no dia do salário</p>

            <div className="mt-10 mb-10">
              <div
                aria-hidden="true"
                className="reveal-grow flex h-4 origin-left gap-1 overflow-hidden rounded-pill"
              >
                <span className="bg-ink/15" style={{ width: pct(SCHEDULED, BALANCE) }} />
                <span className="bg-ink/35" style={{ width: pct(SPENDING, BALANCE) }} />
                <span className="bg-amber" style={{ width: pct(projection.leftover, BALANCE) }} />
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <dt className="flex items-center gap-1.5 text-ink-muted">
                    <span aria-hidden="true" className="size-2 rounded-full bg-ink/15" />
                    Contas
                  </dt>
                  <dd className="mt-1 font-medium">
                    <Money cents={SCHEDULED} />
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-ink-muted">
                    <span aria-hidden="true" className="size-2 rounded-full bg-ink/35" />
                    Gastos
                  </dt>
                  <dd className="mt-1 font-medium">
                    <Money cents={SPENDING} />
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-ink-muted">
                    <span aria-hidden="true" className="size-2 rounded-full bg-amber" />
                    Sobra
                  </dt>
                  <dd className="mt-1 font-medium">
                    <Money cents={projection.leftover} />
                  </dd>
                </div>
              </dl>
            </div>

            <How>
              Saldo de <Money cents={BALANCE} /> − contas agendadas − gasto médio de{" "}
              <Money cents={DAILY} /> por dia × {DAYS_LEFT} dias até o salário.
            </How>
          </li>

          {/* Rule 2 · Comparison */}
          <li className={`${TILE} md:col-span-2`}>
            <Kind>Comparação</Kind>
            <h3 className="mt-6 text-xl font-semibold tracking-tight">
              <Money cents={THIS_MONTH - LAST_MONTH} /> a mais com delivery.
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
          </li>

          {/* Rule 3 · Renewal: the one that asks for action */}
          <li className={`${TILE} md:col-span-2`}>
            <Kind attention>Renovação</Kind>
            <div className="mt-6 flex items-start gap-5">
              <div
                aria-hidden="true"
                className="w-16 shrink-0 overflow-hidden rounded-2xl text-center shadow-[inset_0_0_0_1px_rgb(22_18_14/0.08)]"
              >
                <p className="bg-attention py-1 text-[0.65rem] font-semibold tracking-wider text-white uppercase">
                  {RENEWAL_MONTH}
                </p>
                <p className="py-1.5 text-2xl font-semibold tabular-nums">
                  {RENEWAL.date.getUTCDate()}
                </p>
              </div>
              <h3 className="text-xl leading-snug font-semibold tracking-tight">
                Streaming renova amanhã.
              </h3>
            </div>
            <p className="mt-6 mb-8 flex items-baseline gap-3">
              <s className="text-ink-muted">
                <Money cents={OLD_PRICE} />
              </s>
              <span className="text-3xl font-semibold tracking-tight">
                <Money cents={NEW_PRICE} />
              </span>
              <span className="text-sm text-ink-muted">
                subiu <Money cents={NEW_PRICE - OLD_PRICE} />
              </span>
            </p>
            <How>
              Cobranças que se repetem a cada ~30 dias, com valor parecido. Se não usa mais, dá
              tempo de cancelar.
            </How>
          </li>
        </ul>
      </div>
    </section>
  );
}
