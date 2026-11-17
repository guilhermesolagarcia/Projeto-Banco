import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Disclosure } from "./disclosure";

describe("Disclosure", () => {
  it("is a button that opens a labelled region", async () => {
    const user = userEvent.setup();
    render(<Disclosure label="Como sabemos?">A mesma cobrança a cada ~30 dias.</Disclosure>);

    const button = screen.getByRole("button", { name: "Como sabemos?" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", { name: "Como sabemos?" })).toHaveTextContent(
      "A mesma cobrança a cada ~30 dias.",
    );
  });

  it("works from the keyboard", async () => {
    const user = userEvent.setup();
    render(<Disclosure label="É um banco de verdade?">Não.</Disclosure>);
    await user.tab();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("can be a heading, for lists of questions", () => {
    render(
      <Disclosure label="É um banco de verdade?" heading>
        Não.
      </Disclosure>,
    );
    expect(
      screen.getByRole("heading", { level: 3, name: "É um banco de verdade?" }),
    ).toBeInTheDocument();
  });
});
