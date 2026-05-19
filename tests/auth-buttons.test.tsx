import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SignInButton } from "@/components/auth/auth-buttons";

vi.mock("@/auth", () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

describe("SignInButton", () => {
  it("links visitors to the sign-in page", () => {
    render(<SignInButton />);

    expect(screen.getByRole("link", { name: "Sign In" })).toHaveAttribute(
      "href",
      "/signin",
    );
    expect(
      screen.queryByRole("button", { name: /sign in with github/i }),
    ).not.toBeInTheDocument();
  });
});
