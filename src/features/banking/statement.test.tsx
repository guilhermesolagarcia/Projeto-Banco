import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Statement } from "./statement";
import { STATEMENT_DATA, type StatementData } from "./statement-data";

function setup(data: StatementData = STATEMENT_DATA) {
  const user = userEvent.setup();
  render(<Statement data={data} />);
  return { user };
}

/** The polite live region that tells screen readers what the filter left on screen. */
const announcement = () => screen.getByText(/transaç(ão|ões) .*em \w+\.$/);

describe("Statement", () => {
  it("opens on the current month, with the comparison in the middle of the list", () => {
    setup();
    expect(screen.getByRole("radio", { name: "novembro" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Tudo" })).toBeChecked();
    expect(screen.getByRole("note")).toHaveTextContent("a mais com delivery este mês");
  });

  it("filters by segment: Delivery leaves the 7 orders of November", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("radio", { name: "Delivery" }));

    expect(screen.getAllByText("Rango Delivery")).toHaveLength(7);
    expect(screen.queryByText("Mercado Bom Preço")).not.toBeInTheDocument();
    expect(announcement()).toHaveTextContent("7 transações de delivery em novembro.");
    // The comparison is about delivery, so it stays.
    expect(screen.getByRole("note")).toBeInTheDocument();
  });

  it("hides the comparison where it does not belong", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("radio", { name: "Lazer" }));
    expect(screen.queryByRole("note")).not.toBeInTheDocument();
  });

  it("switches months, and the comparison only exists for this month", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("radio", { name: "outubro" }));
    expect(screen.getByRole("heading", { level: 2, name: /outubro/ })).toBeInTheDocument();
    expect(screen.queryByRole("note")).not.toBeInTheDocument();
  });

  it("shows money in only under Tudo", async () => {
    const { user } = setup();
    expect(screen.getAllByText("Salário").length).toBeGreaterThan(0);
    await user.click(screen.getByRole("radio", { name: "Contas fixas" }));
    expect(screen.queryByText("Salário")).not.toBeInTheDocument();
  });

  it("says so, calmly, when a filter leaves nothing", async () => {
    // A month with only the salary: no spending in any segment.
    const november = STATEMENT_DATA.months[0];
    const salaryOnly = november.days
      .map((day) => ({ ...day, items: day.items.filter((t) => t.amount > 0) }))
      .filter((day) => day.items.length > 0);
    const { user } = setup({ months: [{ ...november, days: salaryOnly }], insight: null });

    await user.click(screen.getByRole("radio", { name: "Saúde" }));
    expect(screen.getByText("Nenhum gasto de saúde em novembro.")).toBeInTheDocument();
  });

  it("writes every segment value in the legend (the bar is decorative)", () => {
    setup();
    const legend = screen.getByRole("list", { name: "Para onde foi o dinheiro" });
    expect(within(legend).getByText("Delivery")).toBeInTheDocument();
    expect(within(legend).getByText("Contas fixas")).toBeInTheDocument();
  });
});
