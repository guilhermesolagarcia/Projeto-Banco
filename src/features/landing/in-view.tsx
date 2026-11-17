"use client";

/*
 * Small client pieces that only add motion when they scroll into view; the content inside
 * stays server-rendered. Once each: a page is read top to bottom, not replayed.
 */
import * as m from "motion/react-m";
import type { CSSProperties, ReactNode } from "react";
import { MATERIALIZE, SPRING, STAGGER } from "@/components/motion/presets";

const ONCE = { once: true, amount: 0.25 } as const;

/** A list whose items materialize one after the other. */
export function InViewList({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <m.ul
      initial="hidden"
      whileInView="shown"
      viewport={ONCE}
      variants={STAGGER}
      className={className}
    >
      {children}
    </m.ul>
  );
}

export function InViewItem({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <m.li variants={MATERIALIZE} className={className}>
      {children}
    </m.li>
  );
}

/** A bar that rises from its baseline, after `delay` seconds. */
export function RiseBar({
  className,
  style,
  delay = 0,
}: {
  className?: string;
  style?: CSSProperties;
  delay?: number;
}) {
  return (
    <m.span
      aria-hidden="true"
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={ONCE}
      transition={{ ...SPRING, delay }}
      className={`origin-bottom ${className ?? ""}`}
      style={style}
    />
  );
}
