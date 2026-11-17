"use client";

import { useReducedMotion, useSpring, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useId, useState } from "react";
import { formatAmount, formatMoney, parseMoneyInput } from "@/components/money";
import { projectUntilPayday, type ProjectionStatus } from "@/insights/projection";

/** Marina's numbers, passed in by the server section so her dataset never ships to the browser. */
export type CalculatorExample = { balance: number; scheduled: number; daily: number; days: number };

/** Field value → cents, capped at R$ 9.999.999,99 so a pasted huge number can't break the layout. */
const MAX_CENTS = 999_999_999;
const toCents = (value: string) => Math.min(parseMoneyInput(value) ?? 0, MAX_CENTS);

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
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-b border-white/[0.06] py-2.5">
      <label htmlFor={id} className="text-on-dark-muted">
        {label}
      </label>
      <span className="ml-auto flex shrink-0 items-center gap-1.5 tabular-nums">
        {prefix && <span aria-hidden="true">{prefix}</span>}
        <span className="text-on-dark-muted">R$</span>
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          maxLength={12}
          value={value}
          // Only digits and separators: a minus or a letter can't sneak in and change the math.
          onChange={(event) => onChange(event.target.value.replace(/[^\d.,]/g, ""))}
          onBlur={() => onChange(formatAmount(toCents(value)))}
          className="w-28 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-right tabular-nums transition-colors hover:border-white/20 focus:border-amber"
        />
      </span>
    </div>
  );
}

export function ClarityCalculator({ example: EXAMPLE }: { example: CalculatorExample }) {
  const daysId = useId();
  const [balance, setBalance] = useState(formatAmount(EXAMPLE.balance));
  const [scheduled, setScheduled] = useState(formatAmount(EXAMPLE.scheduled));
  const [daily, setDaily] = useState(formatAmount(EXAMPLE.daily));
  const [days, setDays] = useState(String(EXAMPLE.days));

  const daysLeft = Math.min(31, Math.max(1, Number.parseInt(days, 10) || 1));
  const result = projectUntilPayday({
    balance: toCents(balance),
    scheduled: toCents(scheduled),
    dailySpending: toCents(daily),
    daysLeft,
  });

  const isShort = result.status === "short";
  const leftover = Math.abs(result.leftover);

  // The big number and the bar chase the new result with a spring: they roll from where they
  // are, and change course mid-way if you keep typing. Reduced motion: they just jump there.
  const reduce = useReducedMotion();
  const amount = useSpring(leftover, { bounce: 0, visualDuration: 0.5 });
  const share = useSpring(result.share, { bounce: 0, visualDuration: 0.5 });
  useEffect(() => {
    if (reduce) {
      amount.jump(leftover);
      share.jump(result.share);
    } else {
      amount.set(leftover);
      share.set(result.share);
    }
  }, [leftover, result.share, reduce, amount, share]);
  const wholeText = useTransform(amount, (v) => formatMoney(Math.round(v)).split(",")[0]);
  const centsText = useTransform(amount, (v) => `,${formatMoney(Math.round(v)).split(",")[1]}`);
  const barWidth = useTransform(share, (v) => `${Math.round(v * 100)}%`);

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
        <span className="text-5xl font-semibold tracking-[-0.05em] tabular-nums [overflow-wrap:anywhere] sm:text-7xl">
          {/* Screen readers get the final value, never the rolling digits. */}
          <span aria-hidden="true">
            <m.span>{wholeText}</m.span>
            <m.span className="text-on-dark-muted">{centsText}</m.span>
          </span>
          <span className="sr-only">{formatMoney(leftover)}</span>
        </span>
        <span className="text-on-dark-muted">{isShort ? "faltando" : "de folga"}</span>
      </p>

      <div className="mt-6 h-1.5 rounded-pill bg-white/10">
        <m.div
          className="h-full origin-left rounded-pill bg-amber shadow-[0_0_18px_rgb(242_140_40/0.7)]"
          style={{ width: barWidth }}
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
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-b border-white/[0.06] py-2.5">
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
