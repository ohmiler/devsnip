import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SnippetListEmpty({ query }: { query?: string }) {
  return (
    <section className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
        {query ? "No snippets match your search" : "No snippets yet"}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-600">
        {query
          ? "Try a different title, language, or author."
          : "Start the feed with a useful code snippet for other developers."}
      </p>
      <Button asChild className="mt-6 bg-zinc-950 text-white hover:bg-zinc-800">
        <Link href="/snippets/new">Create snippet</Link>
      </Button>
    </section>
  );
}
