import Link from "next/link";
import { Logo } from "@/components/logo";
import { SignOutButton } from "@/features/auth/sign-out-button";

const LINKS = [
  { href: "/inicio", label: "Início" },
  { href: "/extrato", label: "Extrato" },
] as const;

/** Where am I, where can I go, how do I leave: logo, two screens, sign out. */
export function BankingHeader({ current }: { current: (typeof LINKS)[number]["href"] }) {
  return (
    <header className="shell flex items-center justify-between gap-4 py-5">
      <Link href="/" aria-label="Âmbar, página inicial" className="rounded-md">
        <Logo />
      </Link>
      <nav aria-label="Conta" className="flex items-center gap-1">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={link.href === current ? "page" : undefined}
            className="rounded-pill px-3 py-2 text-sm text-ink-muted hover:text-ink aria-[current=page]:bg-ink/[0.06] aria-[current=page]:font-medium aria-[current=page]:text-ink"
          >
            {link.label}
          </Link>
        ))}
        <SignOutButton />
      </nav>
    </header>
  );
}
