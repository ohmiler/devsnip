import Link from "next/link";
import { Trash2 } from "lucide-react";
import { deleteSnippet } from "@/app/actions/snippets";
import { Button } from "@/components/ui/button";

type DashboardSnippet = {
  id: string;
  title: string;
  language: string;
  createdAt: Date;
  _count: {
    likes: number;
    bookmarks: number;
  };
};

export function SnippetManagementList({
  snippets,
}: {
  snippets: DashboardSnippet[];
}) {
  if (snippets.length === 0) {
    return (
      <section className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
          No snippets yet
        </h2>
        <p className="mt-3 text-sm text-zinc-600">
          Create your first public code snippet.
        </p>
        <Button asChild className="mt-6 bg-zinc-950 text-white hover:bg-zinc-800">
          <Link href="/snippets/new">Create snippet</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      {snippets.map((snippet) => (
        <div
          key={snippet.id}
          className="flex flex-col gap-4 border-b border-zinc-100 p-5 last:border-b-0 sm:flex-row sm:items-center"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm text-zinc-500">{snippet.language}</p>
            <h2 className="truncate text-lg font-semibold tracking-tight text-zinc-950">
              {snippet.title}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {snippet._count.likes} likes / {snippet._count.bookmarks}{" "}
              bookmarks
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/snippets/${snippet.id}/edit`}>Edit</Link>
            </Button>
            <form action={deleteSnippet.bind(null, snippet.id)}>
              <Button type="submit" variant="outline" className="gap-2 text-zinc-700">
                <Trash2 className="size-4" />
                Delete
              </Button>
            </form>
          </div>
        </div>
      ))}
    </section>
  );
}
