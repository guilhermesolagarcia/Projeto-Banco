import Link from "next/link";
import { Sun } from "@/components/logo";
import { PAYDAY_DAY } from "./example";

/*
 * The page ends on its promise, with the sun large and still behind one clear action.
 * The only section with an amber background; deep amber so white text passes AA.
 */
export function ClosingSection() {
  return (
    <section
      aria-labelledby="fechamento-title"
      className="relative isolate overflow-hidden bg-amber-deep text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2"
      >
        <Sun size={680} className="text-amber-ember" />
      </div>

      <div className="shell reveal py-32 text-center md:py-48">
        <h2
          id="fechamento-title"
          className="mx-auto max-w-3xl text-5xl leading-[0.98] font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl"
        >
          Chegue no dia {PAYDAY_DAY} sem susto.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed">
          Veja o Âmbar funcionando com uma conta demo. Sem cadastro e sem coletar nenhum dado.
        </p>
        <Link
          href="/login"
          className="mt-10 inline-flex rounded-pill bg-white px-7 py-4 text-lg font-medium text-ink transition-[opacity,transform] duration-200 hover:opacity-90 focus-visible:outline-white active:scale-[0.98]"
        >
          Experimentar com conta demo
        </Link>
      </div>
    </section>
  );
}
