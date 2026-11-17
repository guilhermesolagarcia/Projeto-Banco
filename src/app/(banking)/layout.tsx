import type { ReactNode } from "react";
import { SessionGuard } from "@/features/auth/session-guard";
import { BankingHeader } from "@/features/banking/banking-header";
import { MotionProvider } from "@/features/banking/motion-provider";
import { QueryProvider } from "@/features/banking/query-provider";

/*
 * Every banking route: demo session, data through TanStack Query, motion through Motion.
 * The header lives here, so it stays mounted while the person moves between screens.
 */
export default function BankingLayout({ children }: { children: ReactNode }) {
  return (
    <SessionGuard>
      <QueryProvider>
        <MotionProvider>
          <div className="flex min-h-dvh flex-col">
            <BankingHeader />
            <main className="shell isolate flex-1 pt-6 pb-24 md:pt-10">{children}</main>
          </div>
        </MotionProvider>
      </QueryProvider>
    </SessionGuard>
  );
}
