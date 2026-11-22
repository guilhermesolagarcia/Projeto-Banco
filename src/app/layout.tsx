import type { Metadata, Viewport } from "next";
import { Host_Grotesk } from "next/font/google";
import "./globals.css";

const hostGrotesk = Host_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin"],
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Âmbar · Sem susto no fim do mês",
  description:
    "Âmbar é um banco digital fictício que explica, avisa e não julga. Projeto de portfólio.",
  // Installed on the iPhone: its own name under the icon, full screen, dark status bar text.
  appleWebApp: { capable: true, title: "Âmbar", statusBarStyle: "default" },
};

// Mobile browser bar matches the paper background, so the site feels like an app.
// viewportFit "cover": the page goes under the notch, and env(safe-area-inset-*) keeps the
// bottom bar clear of the home indicator.
export const viewport: Viewport = {
  themeColor: "#f4f0ea",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${hostGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
