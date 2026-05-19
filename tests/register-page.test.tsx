import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/app/actions/authentication", () => ({
  registerWithCredentials: vi.fn(),
}));

describe("RegisterPage", () => {
  it("renders the email/password registration form", async () => {
    const { default: RegisterPage } = await import("@/app/register/page");

    render(await RegisterPage());

    expect(screen.getByLabelText(/name/i)).toHaveAttribute("name", "name");
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("name", "email");
    expect(screen.getByLabelText(/^password$/i)).toHaveAttribute(
      "name",
      "password",
    );
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute(
      "href",
      "/signin",
    );
  });
});
