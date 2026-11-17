import { ClarityCalculator } from "./clarity-calculator";
import { Orbits } from "./orbits";

export function ClaritySection() {
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
          <p className="mt-6 max-w-md text-on-dark-muted">
            <span className="font-medium text-on-dark">Experimente:</span> mude os números da conta
            e veja a conta se refazer.
          </p>
        </div>

        <div className="reveal">
          <ClarityCalculator />
        </div>
      </div>
    </section>
  );
}
