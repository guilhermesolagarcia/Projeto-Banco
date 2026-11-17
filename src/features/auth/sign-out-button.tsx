"use client";

import { useRouter } from "next/navigation";
import { endSession } from "./session";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        endSession();
        router.replace("/login");
      }}
      className="rounded-pill px-3 py-2 text-sm text-ink-muted hover:text-ink"
    >
      Sair
    </button>
  );
}
