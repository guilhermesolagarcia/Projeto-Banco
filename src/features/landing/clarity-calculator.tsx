"use client";

import { useId, useState } from "react";
import { formatAmount, formatMoney, parseMoneyInput } from "@/components/money";
import { projectUntilPayday, type ProjectionStatus } from "@/insights/projection";
import { ACCOUNT, DAYS_TO_PAYDAY } from "./example";

const EXAMPLE = {
  balance: ACCOUNT.balance,
  scheduled: ACCOUNT.scheduled,
  daily: ACCOUNT.dailySpending,
  days: DAYS_TO_PAYDAY,
};

const STATUS_TEXT: Record<ProjectionStatus, string> = {
  comfortable: "Dá para chegar até o salário com folga.",
  tight: "Dá para chegar, mas no limite. Vale segurar um pouco.",
  short: "Vai faltar antes do salário.",
};

type MoneyFieldProps = {
  label: string;
  prefix?: string;
  value: string;
  onChange: (value: string) => void;
};

function MoneyField({ label, prefix, value, onChange }: MoneyFieldProps) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] py-2.5">
      <label htmlFor={id} className="text-on-dark-muted">
        {label}
      </label>
      <span className="flex shrink-0 items-center gap-1.5 tabular-nums">
        {prefix && <span aria-hidden="true">{prefix}</span>}
        <span className="text-on-dark-muted">R$</span>
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={() => {
            const cents = parseMoneyInput(value);
            onChange(formatAmount(cents ?? 0));
          }}
          className="w-28 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-right tabular-nums transition-colors hover:border-white/20 focus:border-amber"
        />
      </span>
    </div>
  );
}

export function ClarityCalculator() {
  const daysId = useId();
  const [balance, setBalance] = useState(formatAmount(EXAMPLE.balance));
  const [scheduled, setScheduled] = useState(formatAmount(EXAMPLE.scheduled));
  const [daily, setDaily] = useState(formatAmount(EXAMPLE.daily));
  const [days, setDays] = useState(String(EXAMPLE.days));

  const daysLeft = Math.min(31, Math.max(1, Number.parseInt(days, 10) || 1));
  const result = projectUntilPayday({
    balance: parseMoneyInput(balance) ?? 0,
    scheduled: parseMoneyInput(scheduled) ?? 0,
    dailySpending: parseMoneyInput(daily) ?? 0,
    daysLeft,
  });

  const isShort = result.status === "short";
  const [whole, cents] = formatMoney(Math.abs(result.leftover)).split(",");

  function reset() {
    setBalance(formatAmount(EXAMPLE.balance));
    setScheduled(formatAmount(EXAMPLE.scheduled));
    setDaily(formatAmount(EXAMPLE.daily));
    setDays(String(EXAMPLE.days));
  }

  return (
    <div className="rounded-[1.75rem] border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-md sm:p-8">
      <p className="text-sm text-on-dark-muted">
        Até o próximo salário, daqui a {daysLeft} {daysLeft === 1 ? "dia" : "dias"}
      </p>
      <p className="mt-2 flex flex-wrap items-baseline gap-x-3">
        <span className="text-5xl font-semibold tracking-[-0.05em] tabular-nums sm:text-7xl">
          {whole}
          <span className="text-on-dark-muted">,{cents}</span>
        </span>
        <span className="text-on-dark-muted">{isShort ? "faltando" : "de folga"}</span>
      </p>

      <div className="mt-6 h-1.5 rounded-pill bg-white/10">
        <div
          className="h-full origin-left rounded-pill bg-amber shadow-[0_0_18px_rgb(242_140_40/0.7)] transition-[width] duration-500 ease-[var(--ease-calm)]"
          style={{ width: `${Math.round(result.share * 100)}%` }}
        />
      </div>

      <div aria-live="polite" className="mt-3">
        <p className="flex items-start gap-2 font-medium">
          {isShort && (
            <span
              aria-hidden="true"
              className="mt-2 size-2 shrink-0 rounded-full bg-attention-on-dark"
            />
          )}
          {STATUS_TEXT[result.status]}
        </p>
        {isShort && (
          <p className="mt-1 text-on-dark-muted">
            Dá para ajustar gastando{" "}
            <span className="text-on-dark tabular-nums">{formatMoney(result.dailyCut)}</span> a
            menos por dia. Sem drama: dá tempo.
          </p>
        )}
      </div>

      <div className="mt-8 border-t border-white/10 pt-6">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-sm font-semibold">Faça a sua conta</p>
          <button
            type="button"
            onClick={reset}
            className="rounded-md text-sm text-on-dark-muted underline-offset-4 hover:text-on-dark hover:underline"
          >
            Voltar ao exemplo
          </button>
        </div>
        <div className="mt-3 text-[0.9375rem]">
          <MoneyField label="Saldo hoje" value={balance} onChange={setBalance} />
          <MoneyField
            label="Contas agendadas até o salário"
            prefix="−"
            value={scheduled}
            onChange={setScheduled}
          />
          <MoneyField
            label="Seu gasto médio por dia"
            prefix="−"
            value={daily}
            onChange={setDaily}
          />
          <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] py-2.5">
            <label htmlFor={daysId} className="text-on-dark-muted">
              × dias até o salário
            </label>
            <input
              id={daysId}
              type="number"
              min={1}
              max={31}
              value={days}
              onChange={(event) => setDays(event.target.value)}
              onBlur={() => setDays(String(daysLeft))}
              className="w-20 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-right tabular-nums transition-colors hover:border-white/20 focus:border-amber"
            />
          </div>
          <div className="flex justify-between gap-4 pt-3 font-semibold">
            <span>{isShort ? "Falta até o salário" : "Sobra até o salário"}</span>
            <span
              className={`tabular-nums ${isShort ? "text-attention-on-dark" : "text-amber-on-dark"}`}
            >
              = {formatMoney(Math.abs(result.leftover))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
