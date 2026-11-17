import type { DashboardData } from "./dashboard-data";

let mocking: Promise<unknown> | null = null;

/** Starts the fake API once, the first time any banking data is needed. */
function startMocking(): Promise<unknown> {
  mocking ??= import("@/mocks/browser").then(({ worker }) =>
    // MSW v3: requests without a handler (fonts, Next's own files) go to the network untouched.
    worker.start({ onUnhandledFrame: "bypass", quiet: true }),
  );
  return mocking;
}

export async function fetchDashboard(): Promise<DashboardData> {
  await startMocking();
  // Forward `?simular=erro` from the page, so the error state can be shown on purpose.
  const response = await fetch(`/api/painel${window.location.search}`);
  if (!response.ok) throw new Error(`GET /api/painel → ${response.status}`);
  return response.json() as Promise<DashboardData>;
}
