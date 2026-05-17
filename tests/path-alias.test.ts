import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("test path aliases", () => {
  it("resolves the app import alias", () => {
    expect(typeof Home).toBe("function");
  });
});
