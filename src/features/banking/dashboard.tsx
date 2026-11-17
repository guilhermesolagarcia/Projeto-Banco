"use client";

import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Money } from "@/components/money";
import { fetchDashboard } from "./api";
import type { DashboardData } from "./dashboard-data";
import { CARD, DashboardSkeleton } from "./dashboard-skeleton";
import { CATEGORY_LABEL, formatDay } from "./format";

export function Dashboard() {
  const { data, isPending, isError, refetch, isFetching } = useQuery({
    queryKey: ["painel"],
    queryFn: fetchDashboard,
  });

  if (isPending) return <DashboardSkeleton />;
  if (isError) return <DashboardError onRetry={() => refetch()} retrying={isFetching} />;
  return <DashboardView data={data} />;
}

/* ---------- Error: calm, says what happened and what to do ---------- */

function DashboardError({ onRetry, retrying }: { onRetry: () => void; retrying: boolean }) {
  return (
    <div role="alert" className={`${CARD} mt-4 max-w-xl`}>
      <h1 className="text-3xl leading-tight font-semibold tracking-tight">
        Não conseguimos carregar sua conta agora.
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-ink-muted">
        Seu dinheiro está no mesmo lugar. Deve ser a conexão: tente de novo em instantes.
      </p>
      <button
        type="button"
        onClick={onRetry}
        disabled={retrying}
        className="mt-8 rounded-pill bg-ink px-6 py-3.5 font-medium text-paper transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
      >
        {retrying ? "Tentando…" : "Tentar de novo"}
      </button>
    </div>
  );
}

/* ---------- Ready ---------- */

function when(daysUntil: number): string {
  if (daysUntil === 0) return "hoje";
  if (daysUntil === 1) return "amanhã";
  return `em ${daysUntil} dias`;
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

function Alert({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <li className="flex gap-3 border-t border-ink/10 py-4 first:border-t-0 first:pt-0 last:pb-0">
      <span className="mt-1 shrink-0">{icon}</span>
      <div>
        <p className="font-semibold tracking-tight">{title}</p>
        <p className="mt-1 text-sm text-ink-muted">{children}</p>
      </div>
    </li>
  );
}

function DashboardView({ data }: { data: DashboardData }) {
  const { projection, renewals, comparison } = data;
  const paydayDay = formatDay(data.payday, { day: "numeric" });
  const title = {
    comfortable: `Dá para chegar até dia ${paydayDay} com folga.`,
    tight: `Dá para chegar até dia ${paydayDay}, mas no limite.`,
    short: `Vai faltar antes do dia ${paydayDay}.`,
  }[projection.status];

  return (
    <>
      <p className="animate-rise text-ink-muted first-letter:uppercase">
        {formatDay(data.today, { weekday: "long", day: "numeric", month: "long" })}
      </p>
      <h1 className="mt-2 animate-rise text-5xl leading-[0.98] font-semibold tracking-[-0.045em] [animation-delay:80ms] sm:text-6xl">
        Olá, Marina.
      </h1>

      <div className="mt-10 grid gap-5 md:grid-cols-5 md:gap-6">
        {/* Rule 1 · Projection: the headline of the account */}
        <section
          aria-labelledby="projection-title"
          className={`${CARD} animate-card-in [animation-delay:150ms] md:col-span-3 md:row-span-2`}
        >
          <p className="flex items-center gap-2 text-sm font-medium text-ink-muted">
            <span aria-hidden="true" className="size-2 rounded-full bg-amber-signal" />
            Até o salário, dia {paydayDay} · daqui a {data.daysLeft} dias
          </p>
          <h2
            id="projection-title"
            className="mt-5 text-xl font-semibold tracking-tight md:text-2xl"
          >
            {title}
          </h2>
          <p className="mt-6 flex flex-wrap items-baseline gap-x-3">
            <span className="text-6xl leading-none font-semibold tracking-[-0.045em] sm:text-7xl">
              <Money cents={Math.abs(projection.leftover)} />
            </span>
            <span className="text-ink-muted">
              {projection.status === "short" ? "faltando" : "de folga"}
            </span>
          </p>
          {projection.status === "short" && (
            <p className="mt-3 text-ink-muted">
              Dá para ajustar gastando <Money cents={projection.dailyCut} /> a menos por dia.
            </p>
          )}
          <div aria-hidden="true" className="mt-8 h-2 rounded-pill bg-paper">
            <div
              className="h-full origin-left animate-grow-x rounded-pill bg-amber [animation-delay:600ms]"
              style={{ width: `${Math.round(projection.share * 100)}%` }}
            />
          </div>

          <details className="group/how mt-8 border-t border-ink/10 pt-4">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium [&::-webkit-details-marker]:hidden">
              Como calculamos isso?
              <span
                aria-hidden="true"
                className="grid size-6 place-items-center rounded-full bg-ink/[0.06] leading-none transition-[rotate] duration-300 ease-calm group-open/how:rotate-45"
              >
                +
              </span>
            </summary>
            <dl className="mt-4 space-y-2 text-sm tabular-nums">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Saldo hoje</dt>
                <dd>
                  <Money cents={data.balance} />
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">− Contas agendadas até o salário</dt>
                <dd>
                  <Money cents={data.scheduled} />
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">
                  − <Money cents={data.dailySpending} /> por dia × {data.daysLeft} dias
                </dt>
                <dd>
                  <Money cents={data.dailySpending * data.daysLeft} />
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-ink/10 pt-2 font-semibold">
                <dt>{projection.leftover < 0 ? "Falta" : "Sobra"}</dt>
                <dd>
                  <Money cents={Math.abs(projection.leftover)} />
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-sm text-ink-muted">
              O gasto por dia é a média dos seus gastos do dia a dia nos últimos 60 dias.
            </p>
          </details>
        </section>

        {/* Balance */}
        <section
          aria-labelledby="balance-title"
          className="relative animate-card-in overflow-hidden rounded-[2rem] bg-ink p-7 text-on-dark [animation-delay:250ms] md:col-span-2 md:p-9"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_0%,rgb(242_140_40/0.42),transparent_55%)]"
          />
          <h2 id="balance-title" className="relative text-sm text-on-dark-muted">
            Saldo disponível
          </h2>
          <p className="relative mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            <Money cents={data.balance} />
          </p>
        </section>

        {/* Alerts: only what the rules found today */}
        <section
          aria-labelledby="alerts-title"
          className={`${CARD} animate-card-in [animation-delay:350ms] md:col-span-2`}
        >
          <h2 id="alerts-title" className="text-sm font-medium text-ink-muted">
            Avisos
          </h2>
          <ul className="mt-4">
            {renewals.map((renewal) => (
              <Alert
                key={renewal.merchant}
                icon={
                  <span className="text-attention">
                    <BellIcon />
                  </span>
                }
                title={
                  <>
                    {renewal.merchant} renova {when(renewal.daysUntil)}:{" "}
                    <Money cents={renewal.amount} />.
                  </>
                }
              >
                {renewal.increasedOn ? (
                  <>
                    <Money cents={renewal.increase} /> mais caro desde{" "}
                    {formatDay(renewal.increasedOn, { month: "long" })}. Se não usa mais, dá tempo
                    de cancelar.
                  </>
                ) : (
                  "Se não usa mais, dá tempo de cancelar."
                )}
              </Alert>
            ))}
            {comparison && (
              <Alert
                icon={
                  <span
                    aria-hidden="true"
                    className="mt-1 block size-2 rounded-full bg-amber-signal"
                  />
                }
                title={
                  <>
                    <Money cents={comparison.difference} /> a mais com{" "}
                    {CATEGORY_LABEL[comparison.category].toLowerCase()}.
                  </>
                }
              >
                Mesmo ponto do mês passado: <Money cents={comparison.before} />. Este mês:{" "}
                <Money cents={comparison.now} />.
              </Alert>
            )}
            {renewals.length === 0 && !comparison && (
              <li className="text-ink-muted">Nada pedindo atenção agora. Tudo tranquilo.</li>
            )}
          </ul>
        </section>
      </div>

      {/* Recent transactions */}
      <section aria-labelledby="recent-title" className={`${CARD} mt-5 md:mt-6`}>
        <h2 id="recent-title" className="text-sm font-medium text-ink-muted">
          Últimas transações
        </h2>
        <ul className="mt-2">
          {data.recent.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between gap-4 border-t border-ink/10 py-4 first:border-t-0"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{t.merchant}</p>
                <p className="text-sm text-ink-muted">
                  {CATEGORY_LABEL[t.category]} ·{" "}
                  {formatDay(t.date, { day: "numeric", month: "short" })}
                </p>
              </div>
              <p
                className={`shrink-0 font-medium tabular-nums ${t.amount > 0 ? "text-positive" : ""}`}
              >
                {t.amount > 0 ? "+ " : "− "}
                <Money cents={Math.abs(t.amount)} />
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
