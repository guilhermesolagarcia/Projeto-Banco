import { delay, http, HttpResponse } from "msw";
import { buildDashboard } from "@/features/banking/dashboard-data";
import { buildStatement } from "@/features/banking/statement-data";
import {
  applyAction,
  isDemoAction,
  loadDemoState,
  resetDemo,
  saveDemoState,
  transactionsFor,
  undoLast,
} from "./demo-state";

/*
 * The fake bank API. Runs inside the browser's Service Worker, so the app fetches
 * exactly as it would from a real server; turning MSW off is all a real API would need.
 * The handlers run in the page, so they read the demo state (localStorage) on every request:
 * a sent Pix shows up in the balance and the statement, and survives a reload.
 */
// Only what HttpResponse.json accepts: data that can become JSON.
type Json = Parameters<typeof HttpResponse.json>[0];

function respond(body: () => Json) {
  return async ({ request }: { request: Request }) => {
    // A real network takes a moment; this keeps the loading state honest.
    await delay(700);
    // `?simular=erro` on the page shows the error state on purpose (for demos and tests).
    if (new URL(request.url).searchParams.get("simular") === "erro") {
      return new HttpResponse(null, { status: 500 });
    }
    return HttpResponse.json(body());
  };
}

const current = () => transactionsFor(loadDemoState());

export const handlers = [
  http.get(
    "/api/painel",
    respond(() => buildDashboard(current())),
  ),
  http.get(
    "/api/extrato",
    respond(() => buildStatement(current())),
  ),

  /** Body: a DemoAction without its id. */
  http.post("/api/demo/acoes", async ({ request }) => {
    const body: unknown = await request.json().catch(() => null);
    // Not crypto.randomUUID(): it is missing on plain http (a phone on the dev server's network IP).
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const action = { ...(body as object), id };
    if (!isDemoAction(action)) return new HttpResponse(null, { status: 400 });
    const state = applyAction(loadDemoState(), action);
    saveDemoState(state);
    return HttpResponse.json(state);
  }),
  http.post("/api/demo/desfazer", () => {
    const state = undoLast(loadDemoState());
    saveDemoState(state);
    return HttpResponse.json(state);
  }),
  http.post("/api/demo/recomecar", () => HttpResponse.json(resetDemo())),
];
