import type { Category } from "@/mocks/marina";

export const CATEGORY_LABEL: Record<Category, string> = {
  salario: "Salário",
  moradia: "Moradia",
  educacao: "Educação",
  contas: "Contas",
  assinaturas: "Assinaturas",
  mercado: "Mercado",
  delivery: "Delivery",
  transporte: "Transporte",
  lazer: "Lazer",
  saude: "Saúde",
};

/** "YYYY-MM-DD" → text in pt-BR, read as a calendar day (UTC) so server and browser agree. */
export function formatDay(iso: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", ...options }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}
