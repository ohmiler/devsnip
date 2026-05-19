import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/password";

describe("password hashing", () => {
  it("verifies the original password and rejects another password", async () => {
    const hash = await hashPassword("Correct Horse 123");

    expect(hash).toMatch(/^scrypt:/);
    await expect(verifyPassword("Correct Horse 123", hash)).resolves.toBe(
      true,
    );
    await expect(verifyPassword("wrong-password", hash)).resolves.toBe(false);
  });
});
