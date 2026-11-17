import type { ReactNode } from "react";
import { SessionGuard } from "@/features/auth/session-guard";
import { QueryProvider } from "@/features/banking/query-provider";

// Every banking route needs the demo session and reads data through TanStack Query.
export default function BankingLayout({ children }: { children: ReactNode }) {
  return (
    <SessionGuard>
      <QueryProvider>{children}</QueryProvider>
    </SessionGuard>
  );
}
