import { describe, expect, it } from "vitest";
import { isActive, NAV_ITEMS } from "./nav-items";

describe("NAV_ITEMS", () => {
  it("puts exactly five places in the phone's bottom bar, in order", () => {
    expect(NAV_ITEMS.filter((i) => i.inBottomBar).map((i) => i.label)).toEqual([
      "Início",
      "Pix",
      "Cartão",
      "Planejar",
      "Mais",
    ]);
  });
});

describe("isActive", () => {
  it("marks the destination on its own page", () => {
    expect(isActive("/inicio", "/inicio")).toBe(true);
  });

  it("keeps the destination marked on a sub-page", () => {
    expect(isActive("/pix/enviar", "/pix")).toBe(true);
  });

  it("does not mark a destination that only shares the first letters", () => {
    expect(isActive("/pixel", "/pix")).toBe(false);
  });
});
