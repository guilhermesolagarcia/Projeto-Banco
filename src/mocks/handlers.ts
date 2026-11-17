import { delay, http, HttpResponse } from "msw";
import { DASHBOARD } from "@/features/banking/dashboard-data";

/*
 * The fake bank API. Runs inside the browser's Service Worker, so the app fetches
 * exactly as it would from a real server; turning MSW off is all a real API would need.
 */
export const handlers = [
  http.get("/api/painel", async ({ request }) => {
    // A real network takes a moment; this keeps the loading state honest.
    await delay(700);
    // `/inicio?simular=erro` shows the error state on purpose (for demos and tests).
    if (new URL(request.url).searchParams.get("simular") === "erro") {
      return new HttpResponse(null, { status: 500 });
    }
    return HttpResponse.json(DASHBOARD);
  }),
];
