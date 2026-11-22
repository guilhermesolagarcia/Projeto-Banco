import type { Metadata } from "next";
import { ComingSoon } from "@/features/banking/coming-soon";

export const metadata: Metadata = { title: "Pix · Âmbar" };

export default function PixPage() {
  return (
    <ComingSoon title="Pix">
      Mandar e receber na hora, com o saldo depois do envio sempre à vista. Chega na Fase 6.
    </ComingSoon>
  );
}
