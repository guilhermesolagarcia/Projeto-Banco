"use client";

import dynamic from "next/dynamic";

// Same reason as the dashboard loader: the button talks to MSW, which only exists in the browser.
// The placeholder keeps the row's height (never null: with Cache Components that can blank the page).
export const ResetDemoLoader = dynamic(
  () => import("./reset-demo-button").then((m) => m.ResetDemoButton),
  { ssr: false, loading: () => <div aria-hidden="true" className="h-[76px]" /> },
);
