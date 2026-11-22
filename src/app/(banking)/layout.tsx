import Link from "next/link";
import type { ReactNode } from "react";
import { Logo, Sun } from "@/components/logo";
import { SessionGuard } from "@/features/auth/session-guard";
import { MotionProvider } from "@/components/motion/provider";
import { BottomBar } from "@/features/banking/bottom-bar";
import { QueryProvider } from "@/features/banking/query-provider";
import { Sidebar } from "@/features/banking/sidebar";

/*
 * Every banking route: demo session, data through TanStack Query, motion through Motion.
 * The navigation lives here, so it stays mounted and its highlight slides between pages.
 * Phone: logo on top, bar at the bottom. Desktop: the sidebar. The padding keeps the end of
 * every page clear of the bottom bar, and the content clear of the sidebar.
 */
export default function BankingLayout({ children }: { children: ReactNode }) {
  return (
    <SessionGuard>
      <QueryProvider>
        <MotionProvider>
          <Sidebar />
          {/* The sidebar's edge is drawn here: this column grows with the page, the fixed sidebar does not. */}
          <div className="flex min-h-dvh flex-col md:ml-64 md:border-l md:border-ink/10">
            <header className="shell py-5 md:hidden">
              <Link href="/" aria-label="Âmbar, página inicial" className="inline-flex rounded-md">
                <Logo className="hidden min-[360px]:inline-flex" />
                <Sun size={34} className="text-amber-signal min-[360px]:hidden" />
              </Link>
            </header>
            <main className="shell isolate flex-1 pt-6 pb-28 md:pt-16 md:pb-24">{children}</main>
          </div>
          <BottomBar />
        </MotionProvider>
      </QueryProvider>
    </SessionGuard>
  );
}
