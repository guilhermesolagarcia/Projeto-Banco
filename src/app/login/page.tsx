import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";

export const metadata: Metadata = { title: "Entrar · Âmbar" };

// Phase 1 placeholder: the real demo login arrives in Phase 2.
export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-5 px-4 py-16">
      <Logo />
      <h1 className="text-3xl font-semibold tracking-tight">A conta demo chega em breve.</h1>
      <p className="text-ink-muted">
        Estamos preparando o Internet Banking do Âmbar. Por enquanto, explore a página inicial.
      </p>
      <Link href="/" className="font-medium underline underline-offset-4">
        Voltar para o início
      </Link>
    </main>
  );
}
