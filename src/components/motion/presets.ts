/*
 * Âmbar's motion language, in one place (like the color tokens).
 * Springs, because they start from where things are and can be interrupted.
 * bounce: 0 (critically damped): nothing the person threw, so nothing overshoots.
 * Shared by the landing and the logged-in area, so the whole product moves the same way.
 */
import type { Transition, Variants } from "motion/react";

/** Default for UI: calm, no overshoot. */
export const SPRING: Transition = { type: "spring", bounce: 0, visualDuration: 0.4 };

/** A touch quicker, for small things that follow a click (the "+" turning, a pill sliding). */
export const SNAP: Transition = { type: "spring", bounce: 0, visualDuration: 0.28 };

/** A surface arriving as a material: opacity, blur and a short rise, together. */
export const MATERIALIZE: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
  shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: SPRING },
};

/** Parent that lets its children materialize one after the other. */
export const STAGGER: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.07 } },
};
