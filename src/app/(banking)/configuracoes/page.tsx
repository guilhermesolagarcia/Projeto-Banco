import type { Metadata } from "next";
import { ComingSoon } from "@/features/banking/coming-soon";

export const metadata: Metadata = { title: "Configurações · Âmbar" };

export default function SettingsPage() {
  return (
    <ComingSoon title="Configurações">
      Preferências da conta e dos avisos. Chega numa próxima fase.
    </ComingSoon>
  );
}
