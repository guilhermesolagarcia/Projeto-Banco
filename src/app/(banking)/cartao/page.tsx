import type { Metadata } from "next";
import { ComingSoon } from "@/features/banking/coming-soon";

export const metadata: Metadata = { title: "Cartão · Âmbar" };

export default function CardPage() {
  return (
    <ComingSoon title="Cartão">
      A fatura explicada em três frases e um cartão virtual para cada assinatura. Chega na Fase 7.
    </ComingSoon>
  );
}
