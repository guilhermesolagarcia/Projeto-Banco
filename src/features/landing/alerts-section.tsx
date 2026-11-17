type Alert = {
  kind: string;
  title: string;
  body: string;
  how: string;
  /** "signal" is a neutral insight; "attention" asks the person to act. */
  tone: "signal" | "attention";
  offset: string;
};

// Illustrative examples of the three insight rules (doc de design, section 2.1).
const ALERTS: readonly Alert[] = [
  {
    kind: "Projeção",
    title: "Dá para chegar até dia 5 com folga.",
    body: "Sobram R$ 612,00 depois das contas e do seu ritmo de gastos.",
    how: "Saldo − contas agendadas − gasto médio por dia × dias até o salário.",
    tone: "signal",
    offset: "md:translate-y-0",
  },
  {
    kind: "Comparação",
    title: "R$ 120 a mais com delivery.",
    body: "Comparado ao mesmo ponto do mês passado. O resto está parecido.",
    how: "Mesmo período nos dois meses, para a comparação ser justa.",
    tone: "signal",
    offset: "md:translate-y-10",
  },
  {
    kind: "Renovação",
    title: "Streaming renova amanhã: R$ 39,90.",
    body: "Subiu R$ 5 desde o mês passado. Se não usa mais, dá tempo de cancelar.",
    how: "Cobranças que se repetem a cada ~30 dias, com valor parecido.",
    tone: "attention",
    offset: "md:translate-y-20",
  },
];

function BellIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path
        d="M10 3a4.5 4.5 0 0 0-4.5 4.5c0 3.5-1.5 5-1.5 5h12s-1.5-1.5-1.5-5A4.5 4.5 0 0 0 10 3Z"
        strokeLinejoin="round"
      />
      <path d="M8.5 15.5a1.5 1.5 0 0 0 3 0" strokeLinecap="round" />
    </svg>
  );
}

export function AlertsSection() {
  return (
    <section id="avisos" aria-labelledby="avisos-title" className="bg-paper">
      <div className="shell py-24 md:pt-32 md:pb-44">
        <div className="reveal grid gap-6 md:grid-cols-2 md:items-end md:gap-16">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-ink-muted uppercase">
              <span aria-hidden="true" className="size-2 rounded-full bg-amber-signal" />
              Avisos
            </p>
            <h2
              id="avisos-title"
              className="mt-4 text-4xl leading-[1.02] font-semibold tracking-[-0.035em] sm:text-5xl lg:text-6xl"
            >
              Ele te avisa antes, não depois.
            </h2>
          </div>
          <p className="max-w-lg text-lg leading-relaxed text-ink-muted">
            Três tipos de aviso, calculados a partir das suas transações. Poucos, no momento certo e
            sempre com a conta à mostra.
          </p>
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
          {ALERTS.map((alert) => (
            <li key={alert.kind} className={`reveal ${alert.offset}`}>
              <article className="flex h-full flex-col rounded-card bg-white p-6 shadow-[0_1px_0_rgb(22_18_14/0.04),0_20px_50px_-30px_rgb(120_60_0/0.35)]">
                <header className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 font-medium text-ink-muted">
                    {alert.tone === "attention" ? (
                      <span className="text-attention">
                        <BellIcon />
                      </span>
                    ) : (
                      <span aria-hidden="true" className="size-2 rounded-full bg-amber-signal" />
                    )}
                    {alert.kind}
                  </span>
                  <span className="text-ink-muted">Âmbar · agora</span>
                </header>
                <h3 className="mt-5 text-xl leading-snug font-semibold tracking-tight">
                  {alert.title}
                </h3>
                <p className="mt-2 mb-6 text-ink-muted">{alert.body}</p>
                <p className="mt-auto border-t border-ink/10 pt-4 text-sm text-ink-muted">
                  <span className="font-medium text-ink">Como sabemos: </span>
                  {alert.how}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
