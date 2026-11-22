import type { MetadataRoute } from "next";

/*
 * Makes the Âmbar installable ("Instalar app" / "Adicionar à tela inicial"): it opens full screen
 * on the dashboard. No service worker of our own: offline is whatever the browser already cached.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Âmbar",
    short_name: "Âmbar",
    description: "Um banco fictício que explica, avisa e não julga.",
    lang: "pt-BR",
    start_url: "/inicio",
    display: "standalone",
    background_color: "#f4f0ea",
    theme_color: "#f4f0ea",
    // The same image serves both: the sun sits inside the maskable safe circle.
    // Listed per purpose because a combined "any maskable" is discouraged (and not in Next's types).
    icons: (["any", "maskable"] as const).flatMap((purpose) =>
      ["192", "512"].map((size) => ({
        src: `/app-icon/${size}`,
        sizes: `${size}x${size}`,
        type: "image/png",
        purpose,
      })),
    ),
  };
}
