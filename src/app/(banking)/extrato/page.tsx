import type { Metadata } from "next";
import { BankingHeader } from "@/features/banking/banking-header";
import { Statement } from "@/features/banking/statement";

export const metadata: Metadata = { title: "Extrato · Âmbar" };

export default function StatementPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <BankingHeader current="/extrato" />
      <main className="shell flex-1 pt-6 pb-24 md:pt-10">
        <h1 className="text-5xl leading-[0.98] font-semibold tracking-[-0.045em] sm:text-6xl">
          Extrato
        </h1>
        <div className="mt-10 max-w-3xl">
          <Statement />
        </div>
      </main>
    </div>
  );
}
