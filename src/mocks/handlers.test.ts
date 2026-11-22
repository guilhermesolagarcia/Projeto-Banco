// @vitest-environment jsdom
import { setupServer } from "msw/node";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { DashboardData } from "@/features/banking/dashboard-data";
import { handlers } from "./handlers";

const server = setupServer(...handlers);
beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
afterAll(() => server.close());
beforeEach(() => localStorage.clear());

const url = (path: string) => new URL(path, location.href).href;
const balance = async () =>
  ((await (await fetch(url("/api/painel"))).json()) as DashboardData).balance;
const post = (path: string, body?: unknown) =>
  fetch(url(path), { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) });

describe("the stateful demo API", () => {
  it("a sent Pix lowers the balance, and starting over brings it back", async () => {
    expect(await balance()).toBe(421890);

    const sent = await post("/api/demo/acoes", {
      type: "pix-out",
      date: "2026-11-23",
      contactId: "c1",
      amount: 5000,
    });
    expect(sent.ok).toBe(true);
    expect(await balance()).toBe(421890 - 5000);

    await post("/api/demo/recomecar");
    expect(await balance()).toBe(421890);
  }, 15_000);

  it("undo takes back the last action", async () => {
    await post("/api/demo/acoes", {
      type: "pix-out",
      date: "2026-11-23",
      contactId: "c2",
      amount: 1000,
    });
    await post("/api/demo/desfazer");
    expect(await balance()).toBe(421890);
  }, 15_000);

  it("refuses an action with the wrong shape", async () => {
    const response = await post("/api/demo/acoes", { type: "pix-out", amount: -5 });
    expect(response.status).toBe(400);
  }, 15_000);
});
