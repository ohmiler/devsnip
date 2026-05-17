import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { updateSnippet } from "@/app/actions/snippets";
import { AppShell } from "@/components/layout/app-shell";
import { SnippetForm } from "@/components/snippets/snippet-form";
import { getSnippetForEdit } from "@/lib/snippets";

export const dynamic = "force-dynamic";

type EditSnippetPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditSnippetPage({
  params,
}: EditSnippetPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const { id } = await params;
  const snippet = await getSnippetForEdit(id, session.user.id);

  if (!snippet) {
    notFound();
  }

  const action = updateSnippet.bind(null, snippet.id);

  return (
    <AppShell session={session}>
      <div className="mb-5">
        <p className="text-sm font-medium text-zinc-500">Edit snippet</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
          {snippet.title}
        </h1>
      </div>
      <SnippetForm
        action={action}
        submitLabel="Save changes"
        defaultValues={{
          title: snippet.title,
          caption: snippet.caption,
          language: snippet.language,
          code: snippet.code,
        }}
      />
    </AppShell>
  );
}
