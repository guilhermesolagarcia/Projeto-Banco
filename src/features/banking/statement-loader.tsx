"use client";

import dynamic from "next/dynamic";
import { StatementSkeleton } from "./statement-skeleton";

// Same reason as the dashboard loader: MSW only exists in the browser.
export const StatementLoader = dynamic(
  () => import("./statement-client").then((m) => m.StatementClient),
  { ssr: false, loading: () => <StatementSkeleton /> },
);
