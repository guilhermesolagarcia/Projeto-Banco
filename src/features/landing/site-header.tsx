import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-8">
      <Link href="/" aria-label="Âmbar, página inicial" className="rounded-md">
        <Logo />
      </Link>
      <nav aria-label="Principal">
        <ul className="flex items-center gap-1 text-sm sm:gap-2">
          <li className="hidden sm:block">
            <a href="#clareza" className="rounded-pill px-3 py-2 text-ink-muted hover:text-ink">
              Conta
            </a>
          </li>
          <li className="hidden sm:block">
            <a href="#cartao" className="rounded-pill px-3 py-2 text-ink-muted hover:text-ink">
              Cartão
            </a>
          </li>
          <li>
            <Link
              href="/login"
              className="ml-1 inline-flex rounded-pill bg-ink px-4 py-2 font-medium text-paper transition-opacity hover:opacity-85"
            >
              Entrar
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
