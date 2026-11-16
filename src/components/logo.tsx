// Source of truth for the shapes: docs/brand/ambar-logo.html
const LONG_RAY =
  "M46.6 27 C44 22.5, 52.5 19.5, 49.2 14.5 C46.5 10.5, 52 8, 49.8 3.5 C49.6 2.6, 50 1.5, 50 1 C51.2 2.5, 53.5 5.5, 52.4 8.5 C51 12, 56 14.5, 53.2 19.5 C51.8 22.5, 55 24.5, 53.4 27 Q50 28.5 46.6 27 Z";
const SHORT_RAY =
  "M47 27 C45 23.5, 52 21, 49.4 17 C47.8 14.5, 50 12, 50 10 C51.5 12, 53.2 14.5, 52.2 17 C51 20, 55 23.5, 53 27 Q50 28.2 47 27 Z";

const EIGHT = [0, 45, 90, 135, 180, 225, 270, 315];

type SunProps = {
  /** "full" above 32px, "compact" at 32px or less. */
  variant?: "full" | "compact";
  size?: number;
  className?: string;
  /** Pass a label only when the sun stands alone; next to the word it is decorative. */
  label?: string;
};

export function Sun({ variant = "full", size = 32, className, label }: SunProps) {
  const compact = variant === "compact";
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <circle cx="50" cy="50" r="13" />
      <circle
        cx="50"
        cy="50"
        r="18"
        fill="none"
        stroke="currentColor"
        strokeWidth={compact ? 2.4 : 1.6}
      />
      <g
        stroke={compact ? "currentColor" : undefined}
        strokeWidth={compact ? 0.9 : undefined}
        strokeLinejoin="round"
      >
        {EIGHT.map((deg) => (
          <path key={`l${deg}`} d={LONG_RAY} transform={`rotate(${deg} 50 50)`} />
        ))}
        {!compact &&
          EIGHT.map((deg) => (
            <path key={`s${deg}`} d={SHORT_RAY} transform={`rotate(${deg + 22.5} 50 50)`} />
          ))}
      </g>
    </svg>
  );
}

type LogoProps = { className?: string };

/** Sun + wordmark. The sun is decorative here; the word carries the name. */
export function Logo({ className }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <Sun size={34} className="text-amber-signal" />
      <span className="text-xl font-semibold tracking-tight">Âmbar</span>
    </span>
  );
}
