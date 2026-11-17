import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "./login-form";
import { DEMO_ACCOUNT, hasSession, startSession } from "./session";

// The router is Next's; here we only care where the form sends the person.
const router = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));

function setup() {
  const user = userEvent.setup();
  render(<LoginForm />);
  return {
    user,
    email: screen.getByLabelText("E-mail"),
    password: screen.getByLabelText("Senha"),
    submit: screen.getByRole("button", { name: "Entrar como Marina" }),
  };
}

describe("LoginForm", () => {
  beforeEach(() => {
    router.push.mockClear();
    router.replace.mockClear();
  });

  it("comes filled with the demo account and signs in with one click", async () => {
    const { user, email, password, submit } = setup();
    expect(email).toHaveValue(DEMO_ACCOUNT.email);
    expect(password).toHaveValue(DEMO_ACCOUNT.password);

    await user.click(submit);

    expect(hasSession()).toBe(true);
    expect(router.push).toHaveBeenCalledWith("/inicio");
  });

  it("says what is missing, marks the field and moves focus to it", async () => {
    const { user, email, submit } = setup();
    await user.clear(email);
    await user.click(submit);

    expect(
      await screen.findByText(`Falta o e-mail. O da demo é ${DEMO_ACCOUNT.email}.`),
    ).toBeInTheDocument();
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveFocus();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("explains an incomplete e-mail without blaming anyone", async () => {
    const { user, email, submit } = setup();
    await user.clear(email);
    await user.type(email, "marina");
    await user.click(submit);
    expect(
      await screen.findByText("Esse e-mail parece incompleto. Confere o @ e o final?"),
    ).toBeInTheDocument();
  });

  it("points back to the demo data when the password is not the demo one", async () => {
    const { user, password, submit } = setup();
    await user.clear(password);
    await user.type(password, "outra-senha");
    await user.click(submit);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Esses não são os dados da conta demo.",
    );
    expect(hasSession()).toBe(false);
  });

  it("skips the form when the session already exists", () => {
    startSession();
    render(<LoginForm />);
    expect(router.replace).toHaveBeenCalledWith("/inicio");
  });
});
