import type { DashboardData } from "./dashboard-data";
import type { StatementData } from "./statement-data";

let mocking: Promise<unknown> | null = null;

/** Starts the fake API once, the first time any banking data is needed. */
function startMocking(): Promise<unknown> {
  mocking ??= import("@/mocks/browser").then(({ worker }) =>
    // MSW v3: requests without a handler (fonts, Next's own files) go to the network untouched.
    worker.start({ onUnhandledFrame: "bypass", quiet: true }),
  );
  return mocking;
}

async function getJson<T>(path: string): Promise<T> {
  await startMocking();
  // Forward `?simular=erro` from the page, so the error state can be shown on purpose.
  const response = await fetch(`${path}${window.location.search}`);
  if (!response.ok) throw new Error(`GET ${path} → ${response.status}`);
  return response.json() as Promise<T>;
}

export const fetchDashboard = () => getJson<DashboardData>("/api/painel");
export const fetchStatement = () => getJson<StatementData>("/api/extrato");
