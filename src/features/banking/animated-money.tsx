"use client";

import { animate, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useEffect } from "react";
import { formatMoney } from "@/components/money";

/*
 * Counts up to the value once, when the data arrives. The running number is hidden from
 * screen readers, which read only the final value. With reduced motion it just shows it.
 */
export function AnimatedMoney({ cents }: { cents: number }) {
  const reduce = useReducedMotion();
  const value = useMotionValue(reduce ? cents : 0);
  const text = useTransform(value, (v) => formatMoney(Math.round(v)));

  useEffect(() => {
    if (reduce) {
      value.set(cents);
      return;
    }
    // Ease-out: fast at first, settling on the real number. Interrupted if the value changes.
    const controls = animate(value, cents, { duration: 0.9, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [cents, reduce, value]);

  return (
    <span className="tabular-nums">
      <m.span aria-hidden="true">{text}</m.span>
      <span className="sr-only">{formatMoney(cents)}</span>
    </span>
  );
}
