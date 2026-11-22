import type { Metadata } from "next";
import Link from "next/link";
import { SignOutButton } from "@/features/auth/sign-out-button";
import { NavIcon } from "@/features/banking/nav-icons";
import { NAV_ITEMS } from "@/features/banking/nav-items";

export const metadata: Metadata = { title: "Mais · Âmbar" };

// Everything the phone's bottom bar has no room for.
const ITEMS = NAV_ITEMS.filter((item) => !item.inBottomBar);

const HINTS: Record<string, string> = {
  "/extrato": "Tudo que entrou e saiu, mês a mês",
  "/beneficios": "Cashback com Mango, ZOD, Nexo e Drago's",
  "/assistente": "Pergunte sobre o seu dinheiro",
};

const LIST = "mt-6 rounded-[2rem] bg-white px-5 py-1.5 shadow-[0_1px_0_rgb(22_18_14/0.04)]";
const ROW = "flex w-full items-center gap-3.5 rounded-xl py-4 text-left";

export default function MorePage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-5xl leading-[0.98] font-semibold tracking-[-0.045em] sm:text-6xl">
        Mais
      </h1>

      <ul className={LIST}>
        {ITEMS.map((item) => (
          <li key={item.href} className="border-t border-ink/10 first:border-t-0">
            <Link href={item.href} className={ROW}>
              <NavIcon name={item.icon} className="size-6 text-ink-muted" />
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{item.label}</span>
                {HINTS[item.href] && (
                  <span className="mt-0.5 block text-sm text-ink-muted">{HINTS[item.href]}</span>
                )}
              </span>
              <NavIcon name="chevron" className="size-[18px] text-ink-muted" />
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-8 px-1 text-sm font-medium text-ink-muted">Demonstração</h2>
      <ul className={`${LIST} mt-2.5`}>
        <li>
          <SignOutButton className={ROW}>
            <NavIcon name="out" className="size-6 text-ink-muted" />
            <span className="font-medium">Sair</span>
          </SignOutButton>
        </li>
      </ul>
    </div>
  );
}
