"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { hasSession, subscribeToSession } from "@/features/auth/session";

/*
 * Every banking route needs the demo session. The server can't read localStorage, so the
 * session is "unknown" (null) there and nothing renders until the browser answers.
 */
export default function BankingLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const signedIn = useSyncExternalStore(subscribeToSession, hasSession, () => null);

  useEffect(() => {
    if (signedIn === false) router.replace("/login");
  }, [signedIn, router]);

  return signedIn ? children : null;
}
