/*
 * The sun's ring, scaled up into slow orbits behind the hero cards.
 * Decorative only; it stops completely under prefers-reduced-motion.
 */
export function Orbits({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 640"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none animate-orbit ${className ?? ""}`}
    >
      <g fill="none" stroke="var(--color-amber)" strokeLinecap="round">
        <circle cx="320" cy="320" r="306" strokeOpacity="0.35" strokeDasharray="300 160 40 160" />
        <circle cx="320" cy="320" r="228" strokeOpacity="0.22" strokeDasharray="2 10" />
      </g>
      <circle cx="320" cy="14" r="6" fill="var(--color-amber)" />
      <circle cx="548" cy="320" r="3.5" fill="var(--color-amber)" fillOpacity="0.7" />
    </svg>
  );
}
