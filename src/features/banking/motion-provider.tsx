"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { SPRING } from "./motion";

// The animation features download after the page is up, not before it.
const loadFeatures = () => import("./motion-features").then((module) => module.default);

/*
 * reducedMotion="user": with prefers-reduced-motion, Motion drops movement (position, size,
 * layout) and keeps opacity, so things still fade in and out instead of jumping.
 * strict: only the light `m` component is allowed, never the full `motion` one.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={SPRING}>
      <LazyMotion features={loadFeatures} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
