import { Money } from "@/components/money";

// Illustrative numbers for the landing only; real insights are computed in the banking module.
export function BalancePreview() {
  return (
    <figure
      aria-label="Exemplo do aplicativo Âmbar"
      className="relative overflow-hidden rounded-card bg-ink p-5 text-on-dark shadow-[0_30px_70px_-30px_rgb(22_18_14/0.6)] sm:p-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_0%,rgb(242_140_40/0.42),transparent_55%)]"
      />
      <div className="relative">
        <p className="text-sm text-on-dark-muted">Saldo disponível</p>
        <p className="mt-1 text-4xl font-semibold tracking-tight">
          <Money cents={421890} />
        </p>
        <figcaption className="mt-5 flex gap-3 rounded-2xl bg-white/[0.06] p-3.5 text-[0.9375rem] leading-snug">
          <span
            aria-hidden="true"
            className="mt-1.5 size-2 shrink-0 rounded-full bg-amber-on-dark"
          />
          <span>
            Streaming renova amanhã: <Money cents={3990} />.{" "}
            <span className="text-on-dark-muted">Subiu R$&nbsp;5 desde o mês passado.</span>
          </span>
        </figcaption>
      </div>
    </figure>
  );
}
