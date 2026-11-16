const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** Formats integer cents as BRL. Money is always stored in cents. */
export function formatMoney(cents: number): string {
  return brl.format(cents / 100);
}

type MoneyProps = { cents: number; className?: string };

export function Money({ cents, className }: MoneyProps) {
  return <span className={`tabular-nums ${className ?? ""}`}>{formatMoney(cents)}</span>;
}
