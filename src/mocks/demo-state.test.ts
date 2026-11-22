// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import {
  applyAction,
  loadDemoState,
  resetDemo,
  saveDemoState,
  transactionsFor,
  undoLast,
  type DemoAction,
} from "./demo-state";
import { TRANSACTIONS } from "./marina";

const PIX: DemoAction = {
  id: "a1",
  type: "pix-out",
  date: "2026-11-23",
  contactId: "c1",
  amount: 5000,
};

beforeEach(() => localStorage.clear());

describe("demo state", () => {
  it("adds a sent Pix to Marina's history as money out, newest first", () => {
    const state = applyAction(resetDemo(), PIX);
    const rows = transactionsFor(state);
    expect(rows).toHaveLength(TRANSACTIONS.length + 1);
    expect(rows[0]).toMatchObject({
      amount: -5000,
      date: "2026-11-23",
      merchant: "Pix para Lucas Andrade",
    });
  });

  it("undoes the last action", () => {
    expect(undoLast(applyAction(resetDemo(), PIX)).actions).toHaveLength(0);
  });

  it("survives a reload: what was saved comes back", () => {
    const state = applyAction(resetDemo(), PIX);
    saveDemoState(state);
    expect(loadDemoState()).toEqual(state);
  });

  it("opens in the initial state when the stored text is not JSON", () => {
    localStorage.setItem("ambar.demo", "{not json");
    expect(loadDemoState()).toEqual({ version: 1, actions: [] });
  });

  it("opens in the initial state when the stored shape is from another version", () => {
    localStorage.setItem("ambar.demo", JSON.stringify({ version: 2, actions: [PIX] }));
    expect(loadDemoState()).toEqual({ version: 1, actions: [] });
    localStorage.setItem(
      "ambar.demo",
      JSON.stringify({ version: 1, actions: [{ type: "pix-out" }] }),
    );
    expect(loadDemoState()).toEqual({ version: 1, actions: [] });
  });

  it("starts over: reset clears what was stored", () => {
    saveDemoState(applyAction(resetDemo(), PIX));
    resetDemo();
    expect(loadDemoState().actions).toHaveLength(0);
  });
});
