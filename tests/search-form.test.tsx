import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SearchForm } from "@/components/layout/search-form";

const replace = vi.fn();
const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
    replace,
  }),
}));

describe("SearchForm", () => {
  beforeEach(() => {
    replace.mockClear();
    push.mockClear();
    vi.useFakeTimers();
  });

  it("updates the feed query as the user types", async () => {
    render(<SearchForm />);

    fireEvent.change(screen.getByRole("searchbox", { name: /search/i }), {
      target: { value: "Python" },
    });

    await act(async () => {
      vi.advanceTimersByTime(350);
    });

    expect(replace).toHaveBeenCalledWith("/?q=Python", { scroll: false });
  });

  it("submits the current search query to the feed URL", () => {
    render(<SearchForm />);

    fireEvent.change(screen.getByRole("searchbox", { name: /search/i }), {
      target: { value: "NoMatch" },
    });
    fireEvent.submit(screen.getByRole("search"));

    expect(push).toHaveBeenCalledWith("/?q=NoMatch");
  });
});
