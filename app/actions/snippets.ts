"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import {
  formStateFromValidation,
  parseSnippetFormData,
  type SnippetFormState,
} from "@/lib/snippet-schema";

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  return session.user.id;
}

export async function createSnippet(
  _prevState: SnippetFormState,
  formData: FormData,
): Promise<SnippetFormState> {
  const userId = await requireUserId();
  const parsed = parseSnippetFormData(formData);

  if (!parsed.success) {
    return formStateFromValidation(parsed, formData);
  }

  await prisma.snippet.create({
    data: {
      ...parsed.data,
      authorId: userId,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateSnippet(
  snippetId: string,
  _prevState: SnippetFormState,
  formData: FormData,
): Promise<SnippetFormState> {
  const userId = await requireUserId();
  const parsed = parseSnippetFormData(formData);

  if (!parsed.success) {
    return formStateFromValidation(parsed, formData);
  }

  const existing = await prisma.snippet.findFirst({
    where: { id: snippetId, authorId: userId },
    select: { id: true },
  });

  if (!existing) {
    return { message: "You can only edit your own snippets." };
  }

  await prisma.snippet.update({
    where: { id: snippetId },
    data: parsed.data,
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteSnippet(snippetId: string) {
  const userId = await requireUserId();

  const existing = await prisma.snippet.findFirst({
    where: { id: snippetId, authorId: userId },
    select: { id: true },
  });

  if (!existing) {
    return;
  }

  await prisma.snippet.delete({
    where: { id: snippetId },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
}
