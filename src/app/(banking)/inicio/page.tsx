import type { Metadata } from "next";
import { BankingHeader } from "@/features/banking/banking-header";
import { DashboardLoader } from "@/features/banking/dashboard-loader";

export const metadata: Metadata = { title: "Início · Âmbar" };

export default function DashboardPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <BankingHeader current="/inicio" />
      <main className="shell flex-1 pt-6 pb-24 md:pt-10">
        <DashboardLoader />
      </main>
    </div>
  );
}
