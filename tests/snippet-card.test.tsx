import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SnippetCard } from "@/components/snippets/snippet-card";

vi.mock("@/components/snippets/social-actions", () => ({
  SocialActions: () => <div aria-label="social actions" />,
}));

const snippet = {
  id: "snippet_123",
  authorId: "user_123",
  title: "Readable Python join",
  caption: "Format a list of names.",
  language: "Python",
  code: "names.join(', ')",
  createdAt: new Date("2026-05-17T00:00:00.000Z"),
  updatedAt: new Date("2026-05-17T00:00:00.000Z"),
  author: {
    id: "user_123",
    name: "Ada",
    email: "ada@example.com",
    image: null,
  },
  likes: [],
  bookmarks: [],
  _count: {
    likes: 2,
    bookmarks: 1,
  },
  likedByViewer: false,
  bookmarkedByViewer: false,
};

describe("SnippetCard", () => {
  it("renders the snippet content as a real detail link", () => {
    render(<SnippetCard snippet={snippet} />);

    expect(
      screen.getByRole("link", { name: /readable python join/i }),
    ).toHaveAttribute("href", "/snippets/snippet_123");
  });
});
