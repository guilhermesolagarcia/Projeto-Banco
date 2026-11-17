import { ResinCard } from "@/components/resin-card";
import { Orbits } from "./orbits";

export function CardSection() {
  return (
    <section
      id="cartao"
      aria-labelledby="cartao-title"
      className="relative isolate overflow-hidden bg-resin text-on-dark"
    >
      <div className="shell grid gap-16 pt-24 pb-28 *:min-w-0 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-16 md:py-32">
        <div className="relative order-2 flex justify-center md:order-1">
          <Orbits className="absolute top-1/2 left-1/2 -z-10 size-[34rem] -translate-x-1/2 -translate-y-1/2 opacity-70 md:size-[44rem]" />
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -z-10 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(242_140_40/0.35),transparent_65%)]"
          />
          <div className="w-full max-w-[19rem] animate-float sm:max-w-[24rem] md:max-w-[28rem]">
            <div className="rotate-[-7deg] transition-transform duration-700 ease-[var(--ease-calm)] hover:rotate-[-2deg]">
              <ResinCard />
            </div>
          </div>
        </div>

        <div className="reveal order-1 md:order-2">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-on-dark-muted uppercase">
            <span aria-hidden="true" className="size-2 rounded-full bg-amber" />
            Cartão
          </p>
          <h2
            id="cartao-title"
            className="mt-4 text-4xl leading-[1.02] font-semibold tracking-[-0.035em] sm:text-5xl lg:text-6xl"
          >
            Um cartão que parece luz.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-on-dark-muted">
            Feito de âmbar: translúcido, quente e sem anuidade. Cada compra aparece no app na mesma
            hora, explicada do jeito que você entende.
          </p>
          <p className="mt-8 flex items-center gap-2 text-sm text-on-dark-muted">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-amber-on-dark" />
            Em breve: personalize o seu em 3D
          </p>
        </div>
      </div>
    </section>
  );
}
