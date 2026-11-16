import Link from "next/link";
import { BalancePreview } from "./balance-preview";
import { Orbits } from "./orbits";
import { ProjectionPreview } from "./projection-preview";

const PILLARS = [
  { title: "Explica", text: "Seus gastos em português claro, sem jargão de banco." },
  { title: "Avisa", text: "Contas e renovações antes de acontecerem, não depois." },
  { title: "Não julga", text: "Saldo baixo vira um próximo passo, nunca uma bronca." },
] as const;

/*
 * Grid areas keep the reading order right on every screen:
 * mobile shows text → example card → button, so the concept is seen before the action;
 * desktop gives the cards their own column, lit by the amber glow and the sun's orbits.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 pt-8 pb-12 [grid-template-areas:'text'_'card'_'cta'] sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-x-10 lg:px-10 lg:pt-14 lg:pb-16 lg:[grid-template-areas:'text_card'_'cta_card']">
        <div className="[grid-area:text] lg:self-end">
          <p className="flex animate-rise items-center gap-2 text-xs font-semibold tracking-[0.08em] text-ink-muted uppercase">
            <span aria-hidden="true" className="size-2 rounded-full bg-amber-signal" />
            Conta digital
          </p>
          <h1
            id="hero-title"
            className="mt-4 animate-rise text-[2.75rem] leading-[0.96] font-semibold tracking-[-0.045em] [animation-delay:80ms] sm:text-6xl lg:mt-6 lg:text-[5.75rem] xl:text-[6.5rem]"
          >
            Sem susto no
            <br />
            fim do mês.
          </h1>
          <p className="mt-5 max-w-md animate-rise text-lg leading-relaxed text-ink-muted [animation-delay:180ms] lg:mt-7 lg:text-xl">
            Um banco que te avisa antes, em português claro, quando algo no seu dinheiro merece
            atenção.
          </p>
        </div>

        <div className="relative [grid-area:card] lg:flex lg:min-h-[34rem] lg:items-center lg:justify-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-16 -inset-y-20 hidden bg-[radial-gradient(ellipse_55%_50%_at_55%_50%,rgb(242_140_40/0.42),rgb(242_140_40/0.12)_45%,transparent_72%)] lg:block"
          />
          <Orbits className="absolute top-1/2 left-1/2 hidden size-[40rem] -translate-x-1/2 -translate-y-1/2 lg:block" />
          <div className="relative mx-auto w-full max-w-sm animate-card-in [animation-delay:250ms] lg:max-w-[27rem] lg:translate-x-8 lg:-translate-y-10">
            <div className="lg:rotate-[-2deg]">
              <BalancePreview />
            </div>
          </div>
          <div className="absolute bottom-4 left-0 hidden animate-card-in [animation-delay:550ms] lg:block xl:-left-4">
            <div className="rotate-[2.5deg]">
              <ProjectionPreview />
            </div>
          </div>
        </div>

        <div className="animate-rise [grid-area:cta] [animation-delay:300ms] lg:self-start lg:pt-2">
          <Link
            href="/login"
            className="inline-flex w-full justify-center rounded-pill bg-ink px-4 py-3.5 font-medium text-paper transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98] sm:w-auto sm:px-6 lg:px-7 lg:py-4 lg:text-lg"
          >
            Experimentar com conta demo
          </Link>
          <p className="mt-3 text-center text-sm text-ink-muted sm:text-left">
            Conta gratuita · Sem tarifa de manutenção
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-8 lg:px-10 lg:pb-20">
        <ul className="grid gap-6 border-t border-ink/10 pt-8 sm:grid-cols-3 sm:gap-10">
          {PILLARS.map((pillar, i) => (
            <li
              key={pillar.title}
              className="animate-rise"
              style={{ animationDelay: `${700 + i * 120}ms` }}
            >
              <p className="flex items-center gap-2 font-semibold tracking-tight">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-amber-signal" />
                {pillar.title}
              </p>
              <p className="mt-1.5 max-w-xs text-ink-muted">{pillar.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
