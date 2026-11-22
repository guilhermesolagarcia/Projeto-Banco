import type { Metadata } from "next";
import { ComingSoon } from "@/features/banking/coming-soon";

export const metadata: Metadata = { title: "Planejar · Âmbar" };

export default function PlanPage() {
  return (
    <ComingSoon title="Planejar">
      Caixinhas, metas e o simulador de compras grandes. Chega na Fase 8.
    </ComingSoon>
  );
}
