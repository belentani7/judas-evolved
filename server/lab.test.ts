/* Style direction: Dark Cosmic Luxury — tests cover safe, explicit provider states for the creative laboratory. */
import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("lab provider contracts", () => {
  it("reports local and image providers as optional", async () => {
    const result = await appRouter.createCaller(createContext()).lab.status();
    expect(result.roles).toContain("The Muse");
    expect(typeof result.localModel).toBe("boolean");
    expect(typeof result.imageProvider).toBe("boolean");
  });

  it("returns a safe local preview when the endpoint is not configured", async () => {
    const result = await appRouter.createCaller(createContext()).lab.runRole({ role: "The Oracle", input: "A red door in an empty house" });
    expect(result.configured).toBe(false);
    expect(result.message).toContain("LOCAL_MODEL_BASE_URL");
  });

  it("returns a safe image adapter state when the provider is not configured", async () => {
    const result = await appRouter.createCaller(createContext()).lab.generateImage({ prompt: "A ruby constellation over obsidian glass" });
    expect(result.configured).toBe(false);
    expect(result.message).toContain("IMAGE_PROVIDER_BASE_URL");
  });
});
