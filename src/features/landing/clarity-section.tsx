import { formatMoney } from "@/components/money";
import { Orbits } from "./orbits";

// Illustrative numbers that match the hero cards: 4.218,90 − 2.958,90 − 54,00 × 12 = 612,00.
const BALANCE = 421890;
const SCHEDULED = 295890;
const DAILY = 5400;
const DAYS_LEFT = 12;
const LEFTOVER = BALANCE - SCHEDULED - DAILY * DAYS_LEFT;

const STEPS = [
  { label: "Saldo hoje", value: BALANCE, sign: "" },
  { label: "Contas agendadas até dia 5", value: SCHEDULED, sign: "−" },
  {
    label: `Seu gasto médio por dia × ${DAYS_LEFT} dias`,
    value: DAILY * DAYS_LEFT,
    sign: "−",
  },
] as const;

export function ClaritySection() {
  const [whole, cents] = formatMoney(LEFTOVER).split(",");

  return (
    <section
      id="clareza"
      aria-labelledby="clareza-title"
      className="relative isolate overflow-hidden bg-graphite text-on-dark"
    >
      {/* The sun's orbits, scaled up behind the panel. */}
      <Orbits className="absolute top-1/2 right-[-18rem] -z-10 hidden size-[56rem] -translate-y-1/2 opacity-60 md:block" />
      <div className="shell grid gap-12 py-24 *:min-w-0 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-16 md:py-32">
        <div className="reveal">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-on-dark-muted uppercase">
            <span aria-hidden="true" className="size-2 rounded-full bg-amber" />
            Clareza
          </p>
          <h2
            id="clareza-title"
            className="mt-4 text-4xl leading-[1.02] font-semibold tracking-[-0.035em] sm:text-5xl lg:text-6xl"
          >
            Saiba quanto do mês o seu dinheiro aguenta.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-on-dark-muted">
            O Âmbar olha suas contas agendadas e o seu ritmo de gastos e te diz, sem planilha, se dá
            para chegar até o próximo salário. E mostra a conta, para você nunca ter que confiar às
            cegas.
          </p>
        </div>

        <div className="reveal rounded-[1.75rem] border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-md sm:p-8">
          <p className="text-sm text-on-dark-muted">Até o próximo salário, dia 5</p>
          <p className="mt-2 flex flex-wrap items-baseline gap-x-3">
            <span className="text-5xl font-semibold tracking-[-0.05em] tabular-nums sm:text-7xl">
              {whole}
              <span className="text-on-dark-muted">,{cents}</span>
            </span>
            <span className="text-on-dark-muted">de folga</span>
          </p>

          <div className="mt-6 h-1.5 rounded-pill bg-white/10">
            <div className="reveal-grow h-full w-[62%] origin-left rounded-pill bg-amber shadow-[0_0_18px_rgb(242_140_40/0.7)]" />
          </div>
          <p className="mt-3 font-medium">Dá para chegar até dia 5 com folga.</p>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-sm font-semibold">Como calculamos isso?</p>
            <dl className="mt-3 text-[0.9375rem]">
              {STEPS.map((step) => (
                <div
                  key={step.label}
                  className="flex justify-between gap-4 border-b border-white/[0.06] py-2.5"
                >
                  <dt className="text-on-dark-muted">{step.label}</dt>
                  <dd className="shrink-0 tabular-nums">
                    {step.sign && `${step.sign} `}
                    {formatMoney(step.value)}
                  </dd>
                </div>
              ))}
              <div className="flex justify-between gap-4 pt-3 font-semibold">
                <dt>Sobra até o salário</dt>
                <dd className="text-amber-on-dark tabular-nums">= {formatMoney(LEFTOVER)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
