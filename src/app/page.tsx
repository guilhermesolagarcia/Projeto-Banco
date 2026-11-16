import { Logo } from "@/components/logo";

// Placeholder until the landing sections are built, one at a time.
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-10 sm:px-8">
      <Logo />
      <h1 className="text-5xl font-semibold tracking-tight">Sem susto no fim do mês.</h1>
      <p className="text-ink-muted">A landing está sendo construída seção por seção.</p>
    </main>
  );
}
