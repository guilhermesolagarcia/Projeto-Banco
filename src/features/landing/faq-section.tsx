// Only the doubts that stop someone from trying the demo. Answers start with the answer.
const QUESTIONS = [
  {
    q: "É um banco de verdade?",
    a: "Não. O Âmbar é um banco fictício, um projeto de portfólio de frontend. Nenhum valor aqui é real e nada do que você fizer movimenta dinheiro.",
  },
  {
    q: "Como funciona a conta demo?",
    a: "O login já vem preenchido: é só entrar. Você vê a conta da Marina, 27 anos, salário no dia 5, com aluguel, streaming e delivery, e os avisos calculados a partir das transações dela.",
  },
  {
    q: "O que vocês fazem com meus dados?",
    a: "Nada, porque não coletamos nenhum. Não existe servidor: a conta demo vive só no seu navegador e some quando você sai.",
  },
  {
    q: "Por que tão poucos botões?",
    a: "Porque cada botão a mais é uma decisão a mais. Contamos os links da página inicial de três bancos: entre 117 e 141. A do Âmbar cabe nos dedos das mãos. A calma faz parte do produto.",
  },
] as const;

export function FaqSection() {
  return (
    <section id="perguntas" aria-labelledby="perguntas-title" className="bg-paper">
      <div className="shell grid gap-10 py-24 md:grid-cols-[2fr_3fr] md:gap-16 md:py-36">
        <div className="reveal md:sticky md:top-24 md:self-start">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-ink-muted uppercase">
            <span aria-hidden="true" className="size-2 rounded-full bg-amber-signal" />
            Perguntas
          </p>
          <h2
            id="perguntas-title"
            className="mt-4 text-4xl leading-[1.02] font-semibold tracking-[-0.035em] sm:text-5xl lg:text-6xl"
          >
            Antes de você entrar.
          </h2>
        </div>

        <ul className="border-t border-ink/10">
          {QUESTIONS.map(({ q, a }) => (
            <li key={q} className="reveal border-b border-ink/10">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-xl font-semibold tracking-tight md:text-2xl [&::-webkit-details-marker]:hidden">
                  {q}
                  <span
                    aria-hidden="true"
                    className="grid size-8 shrink-0 place-items-center rounded-full bg-ink/[0.06] text-lg leading-none font-normal transition-[rotate,background-color] duration-300 ease-calm group-open:rotate-45 group-open:bg-amber"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-xl pb-7 text-lg leading-relaxed text-ink-muted">{a}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
