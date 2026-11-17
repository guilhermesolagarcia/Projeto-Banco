/**
 * Fake session for the demo. There is no server, so there is no real security:
 * the "session" is a flag in localStorage. See SPEC.md, module auth.
 */

/** The only account that signs in. Shown on purpose on the login screen. */
export const DEMO_ACCOUNT = { email: "marina@ambar.demo", password: "ambar-demo" };

const KEY = "ambar.session";

export function isDemoAccount(email: string, password: string): boolean {
  return email.trim().toLowerCase() === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password;
}

// Storage can throw (private mode, blocked site data): treat that as "no session".
export function hasSession(): boolean {
  try {
    return localStorage.getItem(KEY) === "demo";
  } catch {
    return false;
  }
}

export function startSession(): void {
  try {
    localStorage.setItem(KEY, "demo");
  } catch {
    // Nothing to do: the guard will send the person back to the login.
  }
}

export function endSession(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Already gone, or storage is blocked.
  }
}

/** Lets React re-read the session when another tab signs in or out. */
export function subscribeToSession(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}
