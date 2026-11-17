"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useId, useState, type ReactNode } from "react";
import { SNAP, SPRING } from "./presets";

/*
 * Every "show more" box in Âmbar (how we calculated it, FAQ answers) opens the same way:
 * a button with aria-expanded controlling a region, height and opacity on a spring.
 * Click again mid-animation and it reverses from where it is.
 */
const STYLE = {
  sm: {
    button: "font-medium",
    icon: "size-6",
    open: "",
    body: "pt-3",
  },
  lg: {
    button: "py-6 text-xl font-semibold tracking-tight md:text-2xl",
    icon: "size-8 text-lg font-normal",
    open: "bg-amber",
    body: "pb-7",
  },
} as const;

type DisclosureProps = {
  label: ReactNode;
  children: ReactNode;
  size?: keyof typeof STYLE;
  /** Wrap the button in an h3, for lists of questions (the accessible accordion pattern). */
  heading?: boolean;
  className?: string;
};

export function Disclosure({
  label,
  children,
  size = "sm",
  heading = false,
  className,
}: DisclosureProps) {
  const [open, setOpen] = useState(false);
  const regionId = useId();
  const buttonId = useId();
  const style = STYLE[size];

  const button = (
    <button
      id={buttonId}
      type="button"
      aria-expanded={open}
      aria-controls={regionId}
      onClick={() => setOpen((value) => !value)}
      className={`flex w-full items-center justify-between gap-6 rounded-md text-left ${style.button}`}
    >
      {label}
      <m.span
        aria-hidden="true"
        animate={{ rotate: open ? 45 : 0 }}
        transition={SNAP}
        className={`grid shrink-0 place-items-center rounded-full leading-none transition-colors duration-300 ${style.icon} ${open && style.open ? style.open : "bg-ink/[0.06]"}`}
      >
        +
      </m.span>
    </button>
  );

  return (
    <div className={className}>
      {heading ? <h3>{button}</h3> : button}
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={regionId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={SPRING}
            className="overflow-hidden"
          >
            <div className={style.body}>{children}</div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
