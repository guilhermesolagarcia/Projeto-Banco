import { AlertsSection } from "@/features/landing/alerts-section";
import { CardSection } from "@/features/landing/card-section";
import { ClaritySection } from "@/features/landing/clarity-section";
import { FaqSection } from "@/features/landing/faq-section";
import { Hero } from "@/features/landing/hero";
import { NoJudgmentSection } from "@/features/landing/no-judgment-section";
import { SiteHeader } from "@/features/landing/site-header";

export default function Home() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only rounded-pill bg-ink text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2"
      >
        Pular para o conteúdo
      </a>
      <SiteHeader />
      <main id="conteudo">
        <Hero />
        <ClaritySection />
        <AlertsSection />
        <NoJudgmentSection />
        <CardSection />
        <FaqSection />
      </main>
    </>
  );
}
