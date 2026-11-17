import type { ReactNode } from "react";
import { SessionGuard } from "@/features/auth/session-guard";

// Every banking route needs the demo session.
export default function BankingLayout({ children }: { children: ReactNode }) {
  return <SessionGuard>{children}</SessionGuard>;
}
