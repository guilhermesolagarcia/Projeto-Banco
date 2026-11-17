import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="bg-ink">
      <div className="shell flex flex-col gap-6 py-10 text-sm text-on-dark-muted md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
          <Logo className="text-on-dark" />
          <p className="max-w-md">
            O Âmbar é um banco fictício, projeto de portfólio. Nenhum dado é coletado e todos os
            valores são de demonstração.
          </p>
        </div>
        <a
          href="https://github.com/guilhermesolagarcia/Projeto-Banco"
          className="font-medium text-on-dark underline decoration-on-dark/30 underline-offset-4 transition-colors hover:decoration-amber-on-dark"
        >
          Código no GitHub
        </a>
      </div>
    </footer>
  );
}
