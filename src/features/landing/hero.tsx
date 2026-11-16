import Link from "next/link";
import { BalancePreview } from "./balance-preview";
import { ProjectionPreview } from "./projection-preview";

/*
 * Grid areas keep the reading order right on every screen:
 * mobile shows text → example card → button, so the concept is seen before the action;
 * desktop gives the cards their own column, lit by the amber glow.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative mx-auto grid w-full max-w-6xl gap-8 px-4 pt-8 pb-16 [grid-template-areas:'text'_'card'_'cta'] sm:px-8 lg:min-h-[calc(100svh-5.5rem)] lg:grid-cols-[1.05fr_1fr] lg:content-center lg:gap-x-12 lg:pt-4 lg:pb-24 lg:[grid-template-areas:'text_card'_'cta_card']"
    >
      <div className="[grid-area:text] lg:self-end">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-ink-muted uppercase">
          <span aria-hidden="true" className="size-2 rounded-full bg-amber-signal" />
          Conta digital
        </p>
        <h1
          id="hero-title"
          className="mt-4 text-[2.75rem] leading-[0.98] font-semibold tracking-[-0.04em] sm:text-6xl lg:mt-6 lg:text-[5.25rem]"
        >
          Sem susto no
          <br />
          fim do mês.
        </h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-muted lg:mt-7 lg:text-xl">
          Um banco que te avisa antes, em português claro, quando algo no seu dinheiro merece
          atenção.
        </p>
      </div>

      <div className="relative [grid-area:card] lg:flex lg:h-full lg:min-h-[30rem] lg:items-center lg:justify-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-10 -inset-y-16 hidden bg-[radial-gradient(ellipse_55%_50%_at_55%_50%,rgb(242_140_40/0.38),rgb(242_140_40/0.1)_45%,transparent_72%)] lg:block"
        />
        <div className="relative mx-auto w-full max-w-sm lg:max-w-[26rem] lg:translate-x-6 lg:-translate-y-8 lg:rotate-[-2deg]">
          <BalancePreview />
        </div>
        <div className="absolute bottom-6 left-0 hidden rotate-[2.5deg] lg:block xl:-left-6">
          <ProjectionPreview />
        </div>
      </div>

      <div className="[grid-area:cta] lg:self-start lg:pt-2">
        <Link
          href="/login"
          className="inline-flex w-full justify-center rounded-pill bg-ink px-4 py-3.5 font-medium text-paper transition-opacity hover:opacity-85 sm:w-auto sm:px-6 lg:px-7 lg:py-4 lg:text-lg"
        >
          Experimentar com conta demo
        </Link>
        <p className="mt-3 text-center text-sm text-ink-muted sm:text-left">
          Conta gratuita · Sem tarifa de manutenção
        </p>
      </div>
    </section>
  );
}
