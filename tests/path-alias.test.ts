import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("test path aliases", () => {
  it("resolves the app import alias", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });
});
