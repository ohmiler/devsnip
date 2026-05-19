import { render, screen } from "@testing-library/react";
import { notFound } from "next/navigation";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/lib/snippets", () => ({
  getSnippetById: vi.fn().mockResolvedValue({
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
  }),
}));

vi.mock("@/components/snippets/social-actions", () => ({
  SocialActions: () => <div aria-label="social actions" />,
}));

vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/navigation")>();

  return {
    ...actual,
    notFound: vi.fn(),
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
    }),
  };
});

describe("snippet detail route", () => {
  it("renders a public snippet detail page", async () => {
    const { default: SnippetDetailPage } = await import(
      "@/app/snippets/[id]/page"
    );

    render(
      await SnippetDetailPage({
        params: Promise.resolve({ id: "snippet_123" }),
      }),
    );

    expect(
      screen.getByRole("heading", { name: /readable python join/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("names.join(', ')")).toBeInTheDocument();
    expect(notFound).not.toHaveBeenCalled();
  });
});
