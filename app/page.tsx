import { auth } from "@/auth";
import { AppShell } from "@/components/layout/app-shell";
import { SnippetCard } from "@/components/snippets/snippet-card";
import { SnippetListEmpty } from "@/components/snippets/snippet-list-empty";
import { getFeedSnippets } from "@/lib/snippets";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

function readQuery(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const query = readQuery(params.q);
  const session = await auth();
  const snippets = await getFeedSnippets({
    query,
    viewerId: session?.user?.id,
  });

  return (
    <AppShell session={session} query={query}>
      <section className="mb-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-zinc-500">Public feed</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
          Code snippets from developers
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Share concise snippets with a title, caption, language, and readable
          code block.
        </p>
      </section>
      <div className="space-y-5">
        {snippets.length > 0 ? (
          snippets.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))
        ) : (
          <SnippetListEmpty query={query} />
        )}
      </div>
    </AppShell>
  );
}
