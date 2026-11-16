import Link from "next/link";
import { BalancePreview } from "./balance-preview";

/*
 * Grid areas keep the reading order right on every screen:
 * mobile shows text → example card → button, so the concept is seen before the action;
 * desktop puts the card in its own column.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="mx-auto grid w-full max-w-6xl gap-8 px-4 pt-8 pb-16 [grid-template-areas:'text'_'card'_'cta'] sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-x-16 lg:pt-16 lg:pb-28 lg:[grid-template-areas:'text_card'_'cta_card']"
    >
      <div className="[grid-area:text] lg:self-end">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-ink-muted uppercase">
          <span aria-hidden="true" className="size-2 rounded-full bg-amber-signal" />
          Conta digital
        </p>
        <h1
          id="hero-title"
          className="mt-4 text-[2.75rem] leading-[0.98] font-semibold tracking-[-0.04em] sm:text-6xl lg:text-[4.25rem]"
        >
          Sem susto no
          <br />
          fim do mês.
        </h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-muted">
          Um banco que te avisa antes, em português claro, quando algo no seu dinheiro merece
          atenção.
        </p>
      </div>

      <div className="mx-auto w-full max-w-sm [grid-area:card] lg:max-w-md lg:rotate-[-1.5deg]">
        <BalancePreview />
      </div>

      <div className="[grid-area:cta] lg:self-start">
        <Link
          href="/login"
          className="inline-flex w-full justify-center rounded-pill bg-ink px-4 py-3.5 sm:px-6 font-medium text-paper transition-opacity hover:opacity-85 sm:w-auto"
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
