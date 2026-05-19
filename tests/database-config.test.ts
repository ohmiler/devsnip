import { describe, expect, it } from "vitest";
import { readDatabasePoolMax } from "@/lib/database-config";

describe("database config", () => {
  it("uses a single database connection by default", () => {
    expect(readDatabasePoolMax()).toBe(1);
  });

  it("accepts a positive integer pool size from the environment", () => {
    expect(readDatabasePoolMax("3")).toBe(3);
  });

  it("falls back to one connection for unsafe values", () => {
    expect(readDatabasePoolMax("0")).toBe(1);
    expect(readDatabasePoolMax("-4")).toBe(1);
    expect(readDatabasePoolMax("not-a-number")).toBe(1);
  });
});
