"use client";

import * as m from "motion/react-m";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SNAP } from "@/components/motion/presets";
import { NavIcon } from "./nav-icons";
import { isActive, NAV_ITEMS } from "./nav-items";

const BAR_ITEMS = NAV_ITEMS.filter((item) => item.inBottomBar);

/*
 * Phone navigation: five places within thumb reach. Frosted, so the page reads as
 * continuing underneath; the bottom padding clears the iPhone home indicator.
 * A page that is not in the bar (the statement, for example) lives inside "Mais", so Mais lights up.
 */
export function BottomBar() {
  const pathname = usePathname();
  const inBar = BAR_ITEMS.some((item) => isActive(pathname, item.href));

  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/10 bg-paper/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <ul className="grid grid-cols-5 px-1 pt-2">
        {BAR_ITEMS.map((item) => {
          const current = isActive(pathname, item.href) || (!inBar && item.href === "/mais");
          return (
            <li key={item.href} className="min-w-0">
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                className="flex flex-col items-center gap-1 rounded-xl pt-1 pb-2 text-xs font-medium text-ink-muted aria-[current=page]:font-semibold aria-[current=page]:text-ink"
              >
                <span className="relative isolate grid h-8 w-12 place-items-center min-[360px]:w-14">
                  {current && (
                    <m.span
                      layoutId="bottom-pill"
                      transition={SNAP}
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 rounded-pill bg-amber/20"
                    />
                  )}
                  <NavIcon name={item.icon} />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
