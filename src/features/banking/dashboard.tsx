"use client";

import { useQuery } from "@tanstack/react-query";
import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { Money } from "@/components/money";
import { fetchDashboard } from "./api";
import type { DashboardData } from "./dashboard-data";
import { AnimatedMoney } from "./animated-money";
import { CARD, DashboardSkeleton } from "./dashboard-skeleton";
import { Disclosure } from "@/components/motion/disclosure";
import { CATEGORY_LABEL, formatDay } from "./format";
import { MATERIALIZE, SPRING, STAGGER } from "@/components/motion/presets";

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
    <m.div initial="hidden" animate="shown" variants={STAGGER}>
      <m.p variants={MATERIALIZE} className="text-ink-muted first-letter:uppercase">
        {formatDay(data.today, { weekday: "long", day: "numeric", month: "long" })}
      </m.p>
      <m.h1
        variants={MATERIALIZE}
        className="mt-2 text-5xl leading-[0.98] font-semibold tracking-[-0.045em] sm:text-6xl"
      >
        Olá, Marina.
      </m.h1>

      <m.div variants={STAGGER} className="mt-10 grid gap-5 md:grid-cols-5 md:gap-6">
        {/* Rule 1 · Projection: the headline of the account */}
        <m.section
          variants={MATERIALIZE}
          aria-labelledby="projection-title"
          // flex column: when the card stretches to the right column, the bar and the math sit at the bottom.
          className={`${CARD} flex flex-col md:col-span-3 md:row-span-2`}
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
            <span className="text-[clamp(2.5rem,12vw,4.5rem)] leading-none font-semibold tracking-[-0.045em]">
              <AnimatedMoney cents={Math.abs(projection.leftover)} />
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
          <div aria-hidden="true" className="mt-8 h-2 rounded-pill bg-paper md:mt-auto">
            <m.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ ...SPRING, delay: 0.35 }}
              className="h-full origin-left rounded-pill bg-amber"
              style={{ width: `${Math.round(projection.share * 100)}%` }}
            />
          </div>

          <Disclosure label="Como calculamos isso?" className="mt-8 border-t border-ink/10 pt-4">
            <dl className="space-y-2 text-sm tabular-nums">
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
          </Disclosure>
        </m.section>

        {/* Balance */}
        <m.section
          variants={MATERIALIZE}
          aria-labelledby="balance-title"
          className="relative min-w-0 overflow-hidden rounded-[2rem] bg-ink p-6 sm:p-7 text-on-dark md:col-span-2 md:p-9"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_0%,rgb(242_140_40/0.42),transparent_55%)]"
          />
          <h2 id="balance-title" className="relative text-sm text-on-dark-muted">
            Saldo disponível
          </h2>
          <p className="relative mt-2 text-[clamp(2rem,9vw,3rem)] font-semibold tracking-tight">
            <AnimatedMoney cents={data.balance} />
          </p>
        </m.section>

        {/* Alerts: only what the rules found today */}
        <m.section
          variants={MATERIALIZE}
          aria-labelledby="alerts-title"
          className={`${CARD} md:col-span-2`}
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
        </m.section>
      </m.div>

      {/* Recent transactions */}
      <m.section
        variants={MATERIALIZE}
        aria-labelledby="recent-title"
        className={`${CARD} mt-5 md:mt-6`}
      >
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
      </m.section>
    </m.div>
  );
}
