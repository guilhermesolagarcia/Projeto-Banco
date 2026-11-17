import { delay, http, HttpResponse } from "msw";
import { DASHBOARD } from "@/features/banking/dashboard-data";
import { STATEMENT_DATA } from "@/features/banking/statement-data";

/*
 * The fake bank API. Runs inside the browser's Service Worker, so the app fetches
 * exactly as it would from a real server; turning MSW off is all a real API would need.
 */
// Only what HttpResponse.json accepts: data that can become JSON.
function respond(body: Parameters<typeof HttpResponse.json>[0]) {
  return async ({ request }: { request: Request }) => {
    // A real network takes a moment; this keeps the loading state honest.
    await delay(700);
    // `?simular=erro` on the page shows the error state on purpose (for demos and tests).
    if (new URL(request.url).searchParams.get("simular") === "erro") {
      return new HttpResponse(null, { status: 500 });
    }
    return HttpResponse.json(body);
  };
}

export const handlers = [
  http.get("/api/painel", respond(DASHBOARD)),
  http.get("/api/extrato", respond(STATEMENT_DATA)),
];
