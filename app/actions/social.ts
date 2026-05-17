"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  return session.user.id;
}

function revalidateSocialSurfaces() {
  revalidatePath("/");
  revalidatePath("/bookmarks");
  revalidatePath("/dashboard");
}

export async function toggleLike(snippetId: string) {
  const userId = await requireUserId();
  const existing = await prisma.like.findUnique({
    where: { userId_snippetId: { userId, snippetId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({ data: { userId, snippetId } });
  }

  revalidateSocialSurfaces();
}

export async function toggleBookmark(snippetId: string) {
  const userId = await requireUserId();
  const existing = await prisma.bookmark.findUnique({
    where: { userId_snippetId: { userId, snippetId } },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
  } else {
    await prisma.bookmark.create({ data: { userId, snippetId } });
  }

  revalidateSocialSurfaces();
}
