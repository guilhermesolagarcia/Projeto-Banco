import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { formatMoney } from "@/components/money";
import { ClarityCalculator } from "./clarity-calculator";

// Intl puts a no-break space after "R$"; Testing Library compares text with plain spaces.
const money = (cents: number) => formatMoney(cents).replace(/\s/g, " ");

const EXAMPLE = { balance: 421890, scheduled: 295890, daily: 5400, days: 12 };

function setup() {
  const user = userEvent.setup();
  render(<ClarityCalculator example={EXAMPLE} />);
  return { user, balance: screen.getByLabelText("Saldo hoje") };
}

describe("ClarityCalculator (landing simulator)", () => {
  it("starts on Marina's example: comfortable, R$ 612,00 left", () => {
    setup();
    expect(screen.getByText("Dá para chegar até o salário com folga.")).toBeInTheDocument();
    expect(screen.getByText(`= ${money(61200)}`)).toBeInTheDocument();
  });

  it("redoes the math as you type: a lower balance runs short, with a daily cut", async () => {
    const { user, balance } = setup();
    await user.clear(balance);
    await user.type(balance, "1000");

    // 1.000,00 − 2.958,90 − 54,00 × 12 = −2.606,90 → cut ⌈2.606,90 ÷ 12⌉ = 217,25 per day.
    expect(screen.getByText("Vai faltar antes do salário.")).toBeInTheDocument();
    expect(screen.getByText("Falta até o salário")).toBeInTheDocument();
    expect(screen.getByText(`= ${money(260690)}`)).toBeInTheDocument();
    expect(screen.getByText(money(21725))).toBeInTheDocument();
  });

  it("does not let a minus sign or letters into a money field", async () => {
    const { user, balance } = setup();
    await user.clear(balance);
    await user.type(balance, "-5a0b0");
    expect(balance).toHaveValue("500");
  });

  it("goes back to the example", async () => {
    const { user, balance } = setup();
    await user.clear(balance);
    await user.type(balance, "1");
    await user.click(screen.getByRole("button", { name: "Voltar ao exemplo" }));
    expect(balance).toHaveValue("4.218,90");
    expect(screen.getByText("Dá para chegar até o salário com folga.")).toBeInTheDocument();
  });
});
