import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders a child element when asChild is used", () => {
    render(
      <Button asChild>
        <a href="#new-snippet">New snippet</a>
      </Button>,
    );

    expect(screen.getByRole("link", { name: "New snippet" })).toHaveAttribute(
      "href",
      "#new-snippet",
    );
    expect(
      screen.queryByRole("button", { name: "New snippet" }),
    ).not.toBeInTheDocument();
  });
});
