import type { Metadata } from "next";
import { DashboardLoader } from "@/features/banking/dashboard-loader";

export const metadata: Metadata = { title: "Início · Âmbar" };

export default function DashboardPage() {
  return <DashboardLoader />;
}
