import type { ReactNode } from "react";

/* 24px grid, 1.6 stroke: the same family as the dashboard bell. Drawn in docs/planejamento/fase-5-navegacao.html. */
const DOT = { fill: "currentColor", stroke: "none" } as const;

const ICONS = {
  home: <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z" />,
  pix: <path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5" />,
  card: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M3 10h18M7 15h3" />
    </>
  ),
  plan: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.6" {...DOT} />
    </>
  ),
  more: (
    <>
      <circle cx="6" cy="12" r="1.3" {...DOT} />
      <circle cx="12" cy="12" r="1.3" {...DOT} />
      <circle cx="18" cy="12" r="1.3" {...DOT} />
    </>
  ),
  list: <path d="M8 7h11M8 12h11M8 17h7M4.5 7h.01M4.5 12h.01M4.5 17h.01" />,
  gift: (
    <>
      <rect x="4" y="9" width="16" height="11" rx="1.5" />
      <path d="M3 9h18M12 9v11M12 9c-1.5-4-6-4-5.5-1.5S12 9 12 9Zm0 0c1.5-4 6-4 5.5-1.5S12 9 12 9Z" />
    </>
  ),
  chat: (
    <path d="M5 5h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-8l-4.5 3.5V17H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
  ),
  sliders: (
    <>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="17" r="2" />
    </>
  ),
  out: <path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 8l-4 4 4 4M6 12h9" />,
  chevron: <path d="m9 6 6 6-6 6" />,
} satisfies Record<string, ReactNode>;

export type NavIconName = keyof typeof ICONS;

/** Decorative: the link next to it always carries the name. */
export function NavIcon({ name, className = "size-6" }: { name: NavIconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[name]}
    </svg>
  );
}
