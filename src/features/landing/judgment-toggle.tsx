"use client";

import * as m from "motion/react-m";
import { useState } from "react";
import { SNAP } from "@/components/motion/presets";

const OPTIONS = [
  { id: "nj-common", label: "Banco comum" },
  { id: "nj-ambar", label: "Âmbar" },
] as const;

/*
 * Still two native radios: the scene swap is CSS (:has(#nj-ambar:checked)) and works before
 * this script loads. Motion only adds the white pill sliding to the chosen option.
 */
export function JudgmentToggle() {
  const [selected, setSelected] = useState<(typeof OPTIONS)[number]["id"]>("nj-common");

  return (
    <fieldset className="reveal relative z-10 mt-10 inline-flex rounded-pill bg-ink/[0.06] p-1">
      <legend className="sr-only">Ver a mensagem de</legend>
      {OPTIONS.map((option) => (
        <label
          key={option.id}
          className="relative isolate cursor-pointer rounded-pill px-5 py-2 text-sm font-medium text-ink-muted transition-colors duration-300 has-checked:text-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-amber-signal"
        >
          <input
            type="radio"
            name="nj-tone"
            id={option.id}
            defaultChecked={option.id === "nj-common"}
            onChange={() => setSelected(option.id)}
            className="sr-only"
          />
          {selected === option.id && (
            <m.span
              layoutId="judgment-pill"
              transition={SNAP}
              aria-hidden="true"
              className="absolute inset-0 -z-10 rounded-pill bg-white shadow-[0_1px_2px_rgb(22_18_14/0.08),0_4px_14px_-6px_rgb(22_18_14/0.2)]"
            />
          )}
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}
