/**
 * What the visitor did in the demo (a sent Pix, for now), kept in localStorage so a reload
 * keeps it. Marina's history never changes: the API adds these actions on top of it.
 * Anything unreadable (blocked storage, broken JSON, another version) opens the demo fresh.
 */
import { TRANSACTIONS, type Transaction } from "./marina";
import { PIX_CONTACTS } from "./pix";

export type DemoAction = {
  id: string;
  type: "pix-out";
  date: string;
  contactId: string;
  /** Cents, positive: the value sent. */
  amount: number;
};
export type DemoState = { version: 1; actions: DemoAction[] };

const KEY = "ambar.demo";
const fresh = (): DemoState => ({ version: 1, actions: [] });

export function isDemoAction(value: unknown): value is DemoAction {
  if (typeof value !== "object" || value === null) return false;
  const a = value as Record<string, unknown>;
  return (
    typeof a.id === "string" &&
    a.type === "pix-out" &&
    typeof a.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(a.date) &&
    typeof a.contactId === "string" &&
    Number.isInteger(a.amount) &&
    (a.amount as number) > 0
  );
}

export function loadDemoState(): DemoState {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (typeof parsed !== "object" || parsed === null) return fresh();
    const { version, actions } = parsed as Record<string, unknown>;
    if (version !== 1 || !Array.isArray(actions) || !actions.every(isDemoAction)) return fresh();
    return { version, actions };
  } catch {
    return fresh();
  }
}

export function saveDemoState(state: DemoState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage blocked (private window, full): the demo still works, it just won't survive a reload.
  }
}

export const applyAction = (state: DemoState, action: DemoAction): DemoState => ({
  ...state,
  actions: [...state.actions, action],
});

export const undoLast = (state: DemoState): DemoState => ({
  ...state,
  actions: state.actions.slice(0, -1),
});

export function resetDemo(): DemoState {
  const state = fresh();
  saveDemoState(state);
  return state;
}

function toTransaction(action: DemoAction): Transaction {
  const contact = PIX_CONTACTS.find((c) => c.id === action.contactId);
  return {
    id: action.id,
    date: action.date,
    description: `PIX ENVIADO ${contact?.name.toUpperCase() ?? ""}`.trim(),
    merchant: contact ? `Pix para ${contact.name}` : "Pix enviado",
    category: "transferencias",
    amount: -action.amount,
  };
}

/** Marina's history plus the demo actions, newest first (a new action leads its own day). */
export function transactionsFor(state: DemoState): Transaction[] {
  const added = state.actions.map(toTransaction).reverse();
  // Stable sort: on the same day, the demo actions (listed first) stay on top.
  return [...added, ...TRANSACTIONS].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
  );
}
