import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { LoginForm } from "@/features/auth/login-form";
import { Orbits } from "@/features/landing/orbits";

export const metadata: Metadata = { title: "Entrar · Âmbar" };

export default function LoginPage() {
  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(242_140_40/0.22),transparent)]"
      />
      <Orbits className="absolute top-1/2 left-1/2 -z-10 size-[44rem] -translate-x-1/2 -translate-y-1/2 opacity-50" />

      <header className="shell flex items-center justify-between py-5">
        <Link href="/" aria-label="Âmbar, página inicial" className="rounded-md">
          <Logo />
        </Link>
        <Link href="/" className="rounded-pill px-3 py-2 text-sm text-ink-muted hover:text-ink">
          Voltar ao início
        </Link>
      </header>

      <main className="shell flex flex-1 items-center justify-center pb-16">
        <div className="w-full max-w-md animate-card-in rounded-[2rem] bg-white/80 p-7 shadow-[0_1px_0_rgb(22_18_14/0.04),0_40px_80px_-40px_rgb(120_60_0/0.45)] backdrop-blur-xl sm:p-10">
          <h1 className="text-4xl leading-[1.02] font-semibold tracking-[-0.035em]">
            Entre na conta da Marina.
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-ink-muted">
            É uma conta de demonstração. Já deixamos tudo preenchido: é só entrar.
          </p>

          <LoginForm />

          <p className="mt-6 flex items-start gap-2 text-sm text-ink-muted">
            <span
              aria-hidden="true"
              className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-signal"
            />
            Nada aqui é real. Nenhum dado sai do seu navegador.
          </p>
        </div>
      </main>
    </div>
  );
}
