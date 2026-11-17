"use client";

import dynamic from "next/dynamic";
import { DashboardSkeleton } from "./dashboard-skeleton";

/*
 * The dashboard reads its data from the fake API (MSW), which only exists in the browser:
 * `msw/browser` refuses to load on the server. So the server renders the skeleton,
 * and the real dashboard (with MSW) is loaded in the browser only.
 */
export const DashboardLoader = dynamic(() => import("./dashboard").then((m) => m.Dashboard), {
  ssr: false,
  loading: () => <DashboardSkeleton />,
});
