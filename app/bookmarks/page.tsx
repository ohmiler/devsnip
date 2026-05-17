import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppShell } from "@/components/layout/app-shell";
import { SnippetCard } from "@/components/snippets/snippet-card";
import { SnippetListEmpty } from "@/components/snippets/snippet-list-empty";
import { getBookmarkedSnippets } from "@/lib/snippets";

export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const snippets = await getBookmarkedSnippets(session.user.id);

  return (
    <AppShell session={session}>
      <div className="mb-5">
        <p className="text-sm font-medium text-zinc-500">Bookmarks</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
          Saved snippets
        </h1>
      </div>
      <div className="space-y-5">
        {snippets.length > 0 ? (
          snippets.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))
        ) : (
          <SnippetListEmpty />
        )}
      </div>
    </AppShell>
  );
}
