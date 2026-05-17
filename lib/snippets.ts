import "server-only";
import prisma from "@/lib/prisma";

export type SnippetFeedItem = Awaited<ReturnType<typeof getFeedSnippets>>[number];

function normalizeQuery(query?: string) {
  return query?.trim().slice(0, 80) ?? "";
}

export async function getFeedSnippets({
  query,
  viewerId,
}: {
  query?: string;
  viewerId?: string;
}) {
  const q = normalizeQuery(query);

  const snippets = await prisma.snippet.findMany({
    where: q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { caption: { contains: q, mode: "insensitive" } },
            { language: { contains: q, mode: "insensitive" } },
            { author: { name: { contains: q, mode: "insensitive" } } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 40,
    include: {
      author: {
        select: { id: true, name: true, image: true, email: true },
      },
      likes: viewerId
        ? { where: { userId: viewerId }, select: { id: true } }
        : false,
      bookmarks: viewerId
        ? { where: { userId: viewerId }, select: { id: true } }
        : false,
      _count: {
        select: { likes: true, bookmarks: true },
      },
    },
  });

  return snippets.map((snippet) => ({
    ...snippet,
    likedByViewer: viewerId ? snippet.likes.length > 0 : false,
    bookmarkedByViewer: viewerId ? snippet.bookmarks.length > 0 : false,
  }));
}

export async function getSnippetForEdit(snippetId: string, userId: string) {
  return prisma.snippet.findFirst({
    where: { id: snippetId, authorId: userId },
  });
}

export async function getDashboardData(userId: string) {
  const [snippets, snippetCount, likesReceived, bookmarksReceived] =
    await Promise.all([
      prisma.snippet.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { likes: true, bookmarks: true } },
        },
      }),
      prisma.snippet.count({ where: { authorId: userId } }),
      prisma.like.count({ where: { snippet: { authorId: userId } } }),
      prisma.bookmark.count({ where: { snippet: { authorId: userId } } }),
    ]);

  return {
    snippets,
    stats: {
      snippetCount,
      likesReceived,
      bookmarksReceived,
    },
  };
}

export async function getBookmarkedSnippets(userId: string) {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      snippet: {
        include: {
          author: { select: { id: true, name: true, image: true, email: true } },
          likes: { where: { userId } },
          bookmarks: { where: { userId } },
          _count: { select: { likes: true, bookmarks: true } },
        },
      },
    },
  });

  return bookmarks.map((bookmark) => ({
    ...bookmark.snippet,
    likedByViewer: bookmark.snippet.likes.length > 0,
    bookmarkedByViewer: bookmark.snippet.bookmarks.length > 0,
  }));
}
