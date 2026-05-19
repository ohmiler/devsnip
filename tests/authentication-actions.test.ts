import { beforeEach, describe, expect, it, vi } from "vitest";

const signIn = vi.fn();
const userFindUnique = vi.fn();
const userCreate = vi.fn();

vi.mock("@/auth", () => ({
  signIn,
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findUnique: userFindUnique,
      create: userCreate,
    },
  },
}));

function formData(entries: Record<string, string>) {
  const data = new FormData();

  for (const [key, value] of Object.entries(entries)) {
    data.set(key, value);
  }

  return data;
}

describe("authentication actions", () => {
  beforeEach(() => {
    signIn.mockReset();
    userFindUnique.mockReset();
    userCreate.mockReset();
  });

  it("creates a user with a password hash and signs them in", async () => {
    userFindUnique.mockResolvedValue(null);
    userCreate.mockResolvedValue({
      id: "user_123",
      email: "ada@example.com",
    });

    const { registerWithCredentials } = await import(
      "@/app/actions/authentication"
    );

    const result = await registerWithCredentials(
      {},
      formData({
        name: "Ada Lovelace",
        email: "Ada@Example.com",
        password: "Password123",
      }),
    );

    expect(result).toEqual({});
    expect(userCreate).toHaveBeenCalledWith({
      data: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        emailVerified: expect.any(Date),
        passwordHash: expect.stringMatching(/^scrypt:/),
      },
    });
    expect(signIn).toHaveBeenCalledWith("credentials", {
      email: "ada@example.com",
      password: "Password123",
      redirectTo: "/",
    });
  });

  it("rejects duplicate registration email addresses", async () => {
    userFindUnique.mockResolvedValue({ id: "existing_user" });

    const { registerWithCredentials } = await import(
      "@/app/actions/authentication"
    );

    const result = await registerWithCredentials(
      {},
      formData({
        name: "Ada Lovelace",
        email: "ada@example.com",
        password: "Password123",
      }),
    );

    expect(result.message).toBe("An account with this email already exists.");
    expect(userCreate).not.toHaveBeenCalled();
    expect(signIn).not.toHaveBeenCalled();
  });
});
