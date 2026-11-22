import type { Metadata } from "next";
import { ComingSoon } from "@/features/banking/coming-soon";

export const metadata: Metadata = { title: "Benefícios · Âmbar" };

export default function BenefitsPage() {
  return (
    <ComingSoon title="Benefícios">
      {"Cashback com Mango, ZOD, Nexo e Drago's. Chega na Fase 9."}
    </ComingSoon>
  );
}
