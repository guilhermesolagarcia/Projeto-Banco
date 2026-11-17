/*
 * Spending segments of the statement: fixed bills in one block, day-to-day by category.
 * Fixed order and fixed color per segment (never by rank), so a category looks the same
 * in every month. The order keeps similar colors apart (validated, see globals.css).
 * Light on purpose (types only from the data): the browser-side filter imports it.
 */
import type { Category } from "@/mocks/marina";

export const SEGMENTS = [
  { key: "fixas", label: "Contas fixas" },
  { key: "lazer", label: "Lazer" },
  { key: "transporte", label: "Transporte" },
  { key: "mercado", label: "Mercado" },
  { key: "saude", label: "Saúde" },
  { key: "delivery", label: "Delivery" },
] as const;
export type SegmentKey = (typeof SEGMENTS)[number]["key"];

/** Day-to-day categories keep their own segment; everything else is a fixed bill. */
const DAY_TO_DAY: Partial<Record<Category, SegmentKey>> = {
  lazer: "lazer",
  transporte: "transporte",
  mercado: "mercado",
  saude: "saude",
  delivery: "delivery",
};
export const segmentOf = (category: Category): SegmentKey => DAY_TO_DAY[category] ?? "fixas";

// One color per segment, always the same (tokens in globals.css). Written out for Tailwind.
export const SEGMENT_COLOR: Record<SegmentKey, string> = {
  fixas: "bg-cat-fixas",
  lazer: "bg-cat-lazer",
  transporte: "bg-cat-transporte",
  mercado: "bg-cat-mercado",
  saude: "bg-cat-saude",
  delivery: "bg-cat-delivery",
};
