import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createSnippet } from "@/app/actions/snippets";
import { AppShell } from "@/components/layout/app-shell";
import { SnippetForm } from "@/components/snippets/snippet-form";

export const dynamic = "force-dynamic";

export default async function NewSnippetPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <AppShell session={session}>
      <div className="mb-5">
        <p className="text-sm font-medium text-zinc-500">New snippet</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
          Create a code post
        </h1>
      </div>
      <SnippetForm action={createSnippet} submitLabel="Publish snippet" />
    </AppShell>
  );
}
