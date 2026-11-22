"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { endSession } from "./session";

export function SignOutButton({
  className = "rounded-pill px-3 py-2 text-sm text-ink-muted hover:text-ink",
  children = "Sair",
}: {
  className?: string;
  children?: ReactNode;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        endSession();
        router.replace("/login");
      }}
      className={className}
    >
      {children}
    </button>
  );
}
