import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BottomBar } from "./bottom-bar";

let pathname = "/pix";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

describe("BottomBar", () => {
  beforeEach(() => {
    pathname = "/pix";
  });

  it("shows the five places and marks the current one", () => {
    render(<BottomBar />);
    expect(screen.getByRole("navigation", { name: "Principal" })).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(5);
    expect(screen.getByRole("link", { name: "Pix" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Início" })).not.toHaveAttribute("aria-current");
  });

  it("marks Mais on a page that lives inside it, like the statement", () => {
    pathname = "/extrato";
    render(<BottomBar />);
    expect(screen.getByRole("link", { name: "Mais" })).toHaveAttribute("aria-current", "page");
  });
});
