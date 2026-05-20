import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
  signIn: vi.fn(),
}));

vi.mock("@/app/actions/authentication", () => ({
  signInWithCredentials: vi.fn(),
}));

describe("SignInPage", () => {
  it("renders a production email sign-in form and a registration link", async () => {
    const { default: SignInPage } = await import("@/app/signin/page");

    render(await SignInPage());

    expect(screen.getByLabelText(/email/i)).toHaveAttribute("name", "email");
    expect(screen.getByLabelText(/password/i)).toHaveAttribute(
      "name",
      "password",
    );
    expect(screen.getByLabelText(/email/i)).not.toBeRequired();
    expect(screen.getByLabelText(/password/i)).not.toBeRequired();
    expect(screen.getByRole("form", { name: /sign in/i })).toHaveAttribute(
      "novalidate",
    );
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /create an account/i }),
    ).toHaveAttribute("href", "/register");
    expect(
      screen.getByRole("button", { name: /continue with github/i }),
    ).toBeInTheDocument();
  });
});
