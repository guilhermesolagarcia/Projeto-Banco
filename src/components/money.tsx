const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const plain = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formats integer cents as BRL ("R$ 4.218,90"). Money is always stored in cents. */
export function formatMoney(cents: number): string {
  return brl.format(cents / 100);
}

/** Formats integer cents without the currency symbol ("4.218,90"), for inputs. */
export function formatAmount(cents: number): string {
  return plain.format(cents / 100);
}

/**
 * Parses what a person types in a money field into integer cents.
 * Accepts "4.218,90", "4218,9", "4218" and "4218.90". Returns null when there is no number.
 */
export function parseMoneyInput(raw: string): number | null {
  const cleaned = raw.replace(/[^\d.,]/g, "");
  if (!/\d/.test(cleaned)) return null;

  let normalized: string;
  if (cleaned.includes(",")) {
    normalized = cleaned.replace(/\./g, "").replace(",", ".");
  } else {
    const lastDot = cleaned.lastIndexOf(".");
    const decimals = lastDot === -1 ? 0 : cleaned.length - lastDot - 1;
    // A single dot followed by 1–2 digits is a decimal point; otherwise dots are thousands.
    normalized =
      lastDot !== -1 && decimals <= 2 && cleaned.indexOf(".") === lastDot
        ? cleaned
        : cleaned.replace(/\./g, "");
  }

  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? Math.round(value * 100) : null;
}

type MoneyProps = { cents: number; className?: string };

export function Money({ cents, className }: MoneyProps) {
  return <span className={`tabular-nums ${className ?? ""}`}>{formatMoney(cents)}</span>;
}
