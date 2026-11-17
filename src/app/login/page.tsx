import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Orbits } from "@/features/landing/orbits";

export const metadata: Metadata = { title: "Entrar · Âmbar" };

// Demo account, shown on purpose: there is no real auth (no server). See SPEC.md, module auth.
const DEMO = { email: "marina@ambar.demo", password: "ambar-demo" };

const FIELD =
  "mt-2 w-full rounded-2xl border border-ink/15 bg-white px-4 py-3.5 text-lg transition-colors hover:border-ink/30 focus:border-amber-signal focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-signal";

// Phase 2, step 1: the approved look. Validation (React Hook Form + Zod) and the session come next.
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

          <form className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="font-medium">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                defaultValue={DEMO.email}
                className={FIELD}
              />
            </div>
            <div>
              <label htmlFor="password" className="font-medium">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                defaultValue={DEMO.password}
                aria-describedby="password-hint"
                className={FIELD}
              />
              <p id="password-hint" className="mt-2 text-sm text-ink-muted">
                Senha da demo: <span className="font-medium text-ink">{DEMO.password}</span>
              </p>
            </div>
            {/* type="button" until the form is wired: a plain GET submit would put the password in the URL. */}
            <button
              type="button"
              className="mt-3 w-full rounded-pill bg-ink px-6 py-4 text-lg font-medium text-paper transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98]"
            >
              Entrar como Marina
            </button>
          </form>

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
