"use client";

import * as m from "motion/react-m";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, Sun } from "@/components/logo";
import { SignOutButton } from "@/features/auth/sign-out-button";
import { SNAP } from "@/components/motion/presets";

const LINKS = [
  { href: "/inicio", label: "Início" },
  { href: "/extrato", label: "Extrato" },
] as const;

/*
 * Lives in the banking layout, so it stays mounted across pages: the highlight is one element
 * (layoutId) that slides from the old item to the new one instead of blinking.
 */
export function BankingHeader() {
  const pathname = usePathname();
  return (
    <header className="shell flex items-center justify-between gap-2 py-5">
      <Link href="/" aria-label="Âmbar, página inicial" className="rounded-md">
        {/* Under 360px the word does not fit next to the nav: the sun alone (the link keeps its name). */}
        <Logo className="hidden min-[360px]:inline-flex" />
        <Sun size={34} className="text-amber-signal min-[360px]:hidden" />
      </Link>
      <nav aria-label="Conta" className="flex items-center gap-1">
        {LINKS.map((link) => {
          const current = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={current ? "page" : undefined}
              className="relative isolate rounded-pill px-3 py-2 text-sm text-ink-muted transition-colors hover:text-ink aria-[current=page]:font-medium aria-[current=page]:text-ink"
            >
              {current && (
                <m.span
                  layoutId="nav-pill"
                  transition={SNAP}
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 rounded-pill bg-ink/[0.07]"
                />
              )}
              {link.label}
            </Link>
          );
        })}
        <SignOutButton />
      </nav>
    </header>
  );
}
