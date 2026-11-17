/** Shared card surface for the banking screens. */
export const CARD =
  "rounded-[2rem] bg-white p-7 shadow-[0_1px_0_rgb(22_18_14/0.04),0_30px_60px_-40px_rgb(120_60_0/0.4)] md:p-9";

/* ---------- Loading: the same grid, quiet blocks, so nothing jumps when data arrives ---------- */

function Block({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-ink/[0.06] ${className}`} />;
}

export function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Carregando sua conta">
      <Block className="h-5 w-56" />
      <Block className="mt-3 h-14 w-72" />
      <div className="mt-10 grid gap-5 md:grid-cols-5 md:gap-6">
        <div className={`${CARD} md:col-span-3 md:row-span-2`}>
          <Block className="h-5 w-64" />
          <Block className="mt-6 h-7 w-80 max-w-full" />
          <Block className="mt-6 h-16 w-60" />
          <Block className="mt-8 h-2 w-full" />
        </div>
        <div className="rounded-[2rem] bg-ink/[0.08] p-7 md:col-span-2 md:p-9">
          <Block className="h-4 w-32" />
          <Block className="mt-3 h-12 w-52" />
        </div>
        <div className={`${CARD} md:col-span-2`}>
          <Block className="h-4 w-20" />
          <Block className="mt-5 h-12 w-full" />
          <Block className="mt-4 h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
