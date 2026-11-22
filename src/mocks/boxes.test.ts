import { describe, expect, it } from "vitest";
import { BOXES } from "./boxes";
import { TODAY } from "./marina";

describe("BOXES", () => {
  it("never hold more than the goal, and every goal is still ahead", () => {
    expect(BOXES.length).toBeGreaterThan(0);
    expect(BOXES.every((b) => b.saved <= b.goal && b.goalDate > TODAY)).toBe(true);
  });
});
