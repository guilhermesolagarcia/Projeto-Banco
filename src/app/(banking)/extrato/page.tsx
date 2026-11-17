import type { Metadata } from "next";
import { StatementLoader } from "@/features/banking/statement-loader";

export const metadata: Metadata = { title: "Extrato · Âmbar" };

export default function StatementPage() {
  return (
    <>
      <h1 className="text-5xl leading-[0.98] font-semibold tracking-[-0.045em] sm:text-6xl">
        Extrato
      </h1>
      <div className="mt-10 max-w-3xl">
        <StatementLoader />
      </div>
    </>
  );
}
