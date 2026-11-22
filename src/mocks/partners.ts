/**
 * The author's own fictional brands. Accents come from each brand's repository:
 * Mango: "Manga" #ff9f1c, first of its six colors (Projeto-Hardware/MARCA.md).
 * ZOD: one color per flavor; Lime Volt #B6F500, the one furthest from Mango's and Âmbar's oranges
 *   (Projeto-UX-Focus spec, landing-energetico).
 * Nexo: accent #9d4edd, light theme (Projeto-Nexo).
 * Drago's: red #c8102e (Dragos-Tattoo).
 * Categories reuse Marina's: a new one would change the statement segments and colors.
 */
import type { Category } from "./marina";

export const PARTNERS: {
  id: "mango" | "zod" | "nexo" | "dragos";
  name: string;
  accent: string;
  category: Category;
  tagline: string;
}[] = [
  {
    id: "mango",
    name: "Mango",
    accent: "#ff9f1c",
    category: "lazer",
    tagline: "MangoBook, Mangophone e Mangopad",
  },
  {
    id: "zod",
    name: "ZOD",
    accent: "#B6F500",
    category: "mercado",
    tagline: "Energético, quatro sabores",
  },
  {
    id: "nexo",
    name: "Nexo",
    accent: "#9d4edd",
    category: "lazer",
    tagline: "Periféricos e setups",
  },
  {
    id: "dragos",
    name: "Drago's Tattoo",
    accent: "#c8102e",
    category: "lazer",
    tagline: "Estúdio de tatuagem",
  },
];
