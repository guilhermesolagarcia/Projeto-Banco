"use client";

import * as m from "motion/react-m";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { SNAP } from "@/components/motion/presets";
import { SignOutButton } from "@/features/auth/sign-out-button";
import { NavIcon } from "./nav-icons";
import { isActive, NAV_ITEMS, type NavItem } from "./nav-items";

// "Mais" is the phone's way to reach what the sidebar already shows.
const SIDE_ITEMS = NAV_ITEMS.filter((item) => item.href !== "/mais");
const MAIN = SIDE_ITEMS.filter((item) => item.group === "main");
const MORE = SIDE_ITEMS.filter((item) => item.group === "more");

const ROW =
  "relative isolate flex items-center gap-3 rounded-pill px-3 py-2.5 font-medium text-ink-muted transition-colors hover:text-ink";

function SideLink({ item, current }: { item: NavItem; current: boolean }) {
  return (
    <li>
      <Link
        href={item.href}
        aria-current={current ? "page" : undefined}
        className={`${ROW} aria-[current=page]:font-semibold aria-[current=page]:text-ink`}
      >
        {current && (
          <m.span
            layoutId="side-pill"
            transition={SNAP}
            aria-hidden="true"
            className="absolute inset-0 -z-10 rounded-pill bg-amber/20"
          />
        )}
        <NavIcon name={item.icon} />
        {item.label}
      </Link>
    </li>
  );
}

/* Desktop navigation: room enough to show every destination, so nothing hides behind "Mais". */
export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col bg-paper px-4 pt-7 pb-6 md:flex">
      <Link href="/" aria-label="Âmbar, página inicial" className="self-start rounded-md px-3">
        <Logo />
      </Link>
      <nav aria-label="Principal" className="mt-10">
        <ul className="space-y-0.5">
          {MAIN.map((item) => (
            <SideLink key={item.href} item={item} current={isActive(pathname, item.href)} />
          ))}
        </ul>
        <hr className="mx-3 my-4 border-ink/10" />
        <ul className="space-y-0.5">
          {MORE.map((item) => (
            <SideLink key={item.href} item={item} current={isActive(pathname, item.href)} />
          ))}
        </ul>
      </nav>
      <SignOutButton className={`${ROW} mt-auto w-full`}>
        <NavIcon name="out" />
        Sair
      </SignOutButton>
    </aside>
  );
}
