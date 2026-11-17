"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { hasSession, subscribeToSession } from "./session";

/*
 * The server can't read localStorage, so the session is "unknown" (null) there.
 * The page is always rendered (Next drops segments that render nothing) but stays hidden
 * until the browser confirms the session; without one, the person goes back to the login.
 */
export function SessionGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const signedIn = useSyncExternalStore(subscribeToSession, hasSession, () => null);

  useEffect(() => {
    if (signedIn === false) router.replace("/login");
  }, [signedIn, router]);

  return (
    <div hidden={signedIn !== true} className="contents">
      {children}
    </div>
  );
}
