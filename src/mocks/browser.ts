import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

/*
 * Started here, next to the worker, so the "already started?" answer can never drift from
 * the worker itself. MSW v3 throws if start() runs twice; keeping the flag in another module
 * broke after Fast Refresh reloaded that module while this worker stayed on.
 */
export const mockingReady: Promise<unknown> =
  worker.readyState === 0
    ? // MSW v3: requests without a handler (fonts, Next's own files) go to the network untouched.
      worker.start({ onUnhandledFrame: "bypass", quiet: true }).catch((error: unknown) => {
        console.error("[Âmbar] The demo API (MSW) did not start:", error);
        throw error;
      })
    : Promise.resolve();
