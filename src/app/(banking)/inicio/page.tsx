"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { endSession } from "@/features/auth/session";

// Phase 2 placeholder behind the session guard. The real dashboard arrives in Phase 3.
export default function HomePage() {
  const router = useRouter();

  function signOut() {
    endSession();
    router.replace("/login");
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="shell flex items-center justify-between py-5">
        <Link href="/" aria-label="Âmbar, página inicial" className="rounded-md">
          <Logo />
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="rounded-pill px-3 py-2 text-sm text-ink-muted hover:text-ink"
        >
          Sair
        </button>
      </header>
      <main className="shell flex flex-1 flex-col justify-center gap-4 pb-24">
        <h1 className="animate-rise text-5xl leading-[0.98] font-semibold tracking-[-0.045em] sm:text-6xl">
          Olá, Marina.
        </h1>
        <p className="max-w-md animate-rise text-lg leading-relaxed text-ink-muted [animation-delay:120ms]">
          Você entrou na conta demo. O painel com a sua projeção, os avisos e o extrato chega na
          próxima fase.
        </p>
      </main>
    </div>
  );
}
