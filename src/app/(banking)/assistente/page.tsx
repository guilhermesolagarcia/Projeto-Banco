import type { Metadata } from "next";
import { ComingSoon } from "@/features/banking/coming-soon";

export const metadata: Metadata = { title: "Assistente · Âmbar" };

export default function AssistantPage() {
  return (
    <ComingSoon title="Assistente">
      Perguntas sobre o seu dinheiro, respondidas com as suas contas. Chega na Fase 10.
    </ComingSoon>
  );
}
