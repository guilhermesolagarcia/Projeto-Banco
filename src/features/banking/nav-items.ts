import type { NavIconName } from "./nav-icons";

export type NavItem = {
  href: string;
  label: string;
  icon: NavIconName;
  /** The phone's bottom bar has room for exactly five. */
  inBottomBar: boolean;
  /** "more": secondary places, below the separator on desktop. */
  group: "main" | "more";
};

/*
 * Every destination of the logged-in area, in one list: the phone's bottom bar,
 * the desktop sidebar and the "Mais" page all read from here, so they never disagree.
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/inicio", label: "Início", icon: "home", inBottomBar: true, group: "main" },
  { href: "/extrato", label: "Extrato", icon: "list", inBottomBar: false, group: "main" },
  { href: "/pix", label: "Pix", icon: "pix", inBottomBar: true, group: "main" },
  { href: "/cartao", label: "Cartão", icon: "card", inBottomBar: true, group: "main" },
  { href: "/planejar", label: "Planejar", icon: "plan", inBottomBar: true, group: "main" },
  { href: "/beneficios", label: "Benefícios", icon: "gift", inBottomBar: false, group: "more" },
  { href: "/assistente", label: "Assistente", icon: "chat", inBottomBar: false, group: "more" },
  {
    href: "/configuracoes",
    label: "Configurações",
    icon: "sliders",
    inBottomBar: false,
    group: "more",
  },
  // Phone only: on desktop the sidebar already shows everything "Mais" holds.
  { href: "/mais", label: "Mais", icon: "more", inBottomBar: true, group: "main" },
];

/** "/pix/enviar" is still Pix; "/pixel" is not. */
export function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
