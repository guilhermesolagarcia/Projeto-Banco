import { CARD } from "./dashboard-skeleton";

function Block({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-ink/[0.06] ${className}`} />;
}

/** Same shapes as the statement (summary, then days), so nothing jumps when data arrives. */
export function StatementSkeleton() {
  return (
    <div role="status" aria-label="Carregando o extrato" className="space-y-6">
      <div className={`${CARD} grid gap-8 md:grid-cols-[1fr_17rem] md:items-center`}>
        <div>
          <Block className="h-7 w-56" />
          <Block className="mt-7 h-12 w-72 max-w-full" />
          <Block className="mt-8 h-4 w-full" />
        </div>
        <Block className="h-44" />
      </div>
      {[0, 1, 2].map((day) => (
        <div key={day}>
          <Block className="h-4 w-40" />
          <div className="mt-2 space-y-3 rounded-[1.75rem] bg-white px-5 py-4">
            <Block className="h-10 w-full" />
            <Block className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
