import Link from "next/link";
import { Sun } from "@/components/logo";
import { SiteHeader } from "@/features/landing/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="shell flex flex-1 flex-col items-start justify-center gap-6 py-20">
        <Sun size={72} className="text-amber" />
        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
          Essa página não existe.
        </h1>
        <p className="max-w-md text-lg text-ink-muted">
          Tudo bem, acontece. O link pode ter mudado ou ter sido digitado diferente.
        </p>
        <Link
          href="/"
          className="inline-flex rounded-pill bg-ink px-6 py-3.5 font-medium text-paper transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98]"
        >
          Voltar para o início
        </Link>
      </main>
    </>
  );
}
