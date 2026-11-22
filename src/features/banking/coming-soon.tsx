/** A destination that exists in the navigation before its phase is built: calm, honest, no dead buttons. */
export function ComingSoon({ title, children }: { title: string; children: string }) {
  return (
    <>
      <h1 className="text-5xl leading-[0.98] font-semibold tracking-[-0.045em] sm:text-6xl">
        {title}
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">{children}</p>
    </>
  );
}
