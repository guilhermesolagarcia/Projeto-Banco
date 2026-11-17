import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { SignOutButton } from "@/features/auth/sign-out-button";
import { DashboardLoader } from "@/features/banking/dashboard-loader";

export const metadata: Metadata = { title: "Início · Âmbar" };

export default function DashboardPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="shell flex items-center justify-between py-5">
        <Link href="/" aria-label="Âmbar, página inicial" className="rounded-md">
          <Logo />
        </Link>
        <SignOutButton />
      </header>
      <main className="shell flex-1 pt-6 pb-24 md:pt-10">
        <DashboardLoader />
      </main>
    </div>
  );
}
