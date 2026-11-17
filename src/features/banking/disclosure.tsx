"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useId, useState, type ReactNode } from "react";
import { SNAP, SPRING } from "@/components/motion/presets";

/*
 * "Show the math", opening with a spring. A button with aria-expanded + a region
 * (the accessible disclosure pattern). Click again mid-animation and it reverses from
 * where it is: springs start from the current value, nothing waits for the end.
 */
export function Disclosure({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const regionId = useId();

  return (
    <div className="mt-8 border-t border-ink/10 pt-4">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={regionId}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between rounded-md text-left font-medium"
      >
        {label}
        <m.span
          aria-hidden="true"
          animate={{ rotate: open ? 45 : 0 }}
          transition={SNAP}
          className="grid size-6 place-items-center rounded-full bg-ink/[0.06] leading-none"
        >
          +
        </m.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={regionId}
            role="region"
            aria-label={label}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={SPRING}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
