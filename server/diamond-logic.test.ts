import { describe, expect, it } from "vitest";
import { applyDiamondAnswer } from "../shared/diamondLogic";

describe("diamond memory scoring", () => {
  it("applies one answer per diamond only once", () => {
    const first = applyDiamondAnswer({ MEMORY: 0 }, {}, 0, "MEMORY", 0);
    const second = applyDiamondAnswer(first.memory, first.answered, 0, "MEMORY", 1);
    expect(first.applied).toBe(true);
    expect(first.memory.MEMORY).toBe(26);
    expect(second.applied).toBe(false);
    expect(second.memory.MEMORY).toBe(26);
  });
});
