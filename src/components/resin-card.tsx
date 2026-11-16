import { Sun } from "./logo";

type ResinCardProps = {
  last4?: string;
  holder?: string;
  className?: string;
};

/**
 * The Âmbar card in pure CSS: translucent amber resin with the sun engraved.
 * Reused later as the 2D fallback of the Phase 5 3D card.
 */
export function ResinCard({ last4 = "4821", holder = "Marina Alves", className }: ResinCardProps) {
  return (
    <div
      role="img"
      aria-label={`Cartão Âmbar final ${last4}`}
      className={`relative aspect-[1.586] w-full overflow-hidden rounded-[1.25rem] bg-[linear-gradient(135deg,#ffc46b_0%,#f28c28_45%,#b85a0a_100%)] p-[6%] text-[#2a1604] shadow-[inset_0_1px_0_rgb(255_255_255/0.5),0_40px_90px_-25px_rgb(242_140_40/0.7)] ${className ?? ""}`}
    >
      {/* Light caught inside the resin. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgb(255_255_255/0.5),transparent_42%),radial-gradient(circle_at_85%_95%,rgb(90_35_0/0.35),transparent_50%)]"
      />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <Sun size={44} className="text-[#3a1d05] opacity-85" />
          <span className="text-sm font-medium tracking-wide opacity-70">débito e crédito</span>
        </div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-[0.12em] uppercase opacity-70">{holder}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">Âmbar</p>
          </div>
          <p className="text-lg tracking-[0.18em] tabular-nums">•••• {last4}</p>
        </div>
      </div>
    </div>
  );
}
