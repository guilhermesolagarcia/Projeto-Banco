import { Money } from "@/components/money";
import { projectUntilPayday } from "@/insights/projection";
import { ACCOUNT, DAYS_TO_PAYDAY, PAYDAY_DAY } from "./example";

// Same example as the clarity simulator, computed by the same Rule 1 function.
const example = projectUntilPayday({ ...ACCOUNT, daysLeft: DAYS_TO_PAYDAY });

export function ProjectionPreview() {
  return (
    <div
      aria-hidden="true"
      className="w-full rounded-card bg-white p-5 text-ink shadow-[0_24px_60px_-28px_rgb(120_60_0/0.45)]"
    >
      <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-ink-muted uppercase">
        <span className="size-1.5 rounded-full bg-amber-signal" />
        Até o próximo salário
      </p>
      <p className="mt-3 text-lg leading-snug font-semibold tracking-tight">
        Dá para chegar até dia {PAYDAY_DAY} com folga.
      </p>
      <div className="mt-4 h-1.5 rounded-pill bg-paper">
        <div
          className="h-full origin-left animate-grow-x rounded-pill bg-amber [animation-delay:1100ms]"
          style={{ width: `${Math.round(example.share * 100)}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-ink-muted">
        Sobram <Money cents={example.leftover} className="font-medium text-ink" /> de folga
      </p>
    </div>
  );
}
