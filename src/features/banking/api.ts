import type { DashboardData } from "./dashboard-data";
import type { StatementData } from "./statement-data";

async function getJson<T>(path: string): Promise<T> {
  // The fake API lives in the browser; it starts once, the first time any data is needed.
  const { mockingReady } = await import("@/mocks/browser");
  await mockingReady;
  // Forward `?simular=erro` from the page, so the error state can be shown on purpose.
  const response = await fetch(`${path}${window.location.search}`);
  if (!response.ok) {
    console.error(`[Âmbar] GET ${path} → ${response.status}`);
    throw new Error(`GET ${path} → ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const fetchDashboard = () => getJson<DashboardData>("/api/painel");
export const fetchStatement = () => getJson<StatementData>("/api/extrato");
