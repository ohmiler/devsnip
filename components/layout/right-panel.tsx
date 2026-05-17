import Link from "next/link";
import { type Session } from "next-auth";
import { Button } from "@/components/ui/button";

export function RightPanel({ session }: { session: Session | null }) {
  return (
    <aside className="hidden w-80 shrink-0 xl:block">
      <div className="sticky top-24 space-y-6">
        <section className="rounded-lg border border-zinc-200 bg-white p-5">
          <p className="text-sm font-medium text-zinc-500">Workspace</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">
            Developer snippets
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Browse reusable ideas, save references, and manage your public code
            posts.
          </p>
          <Button
            asChild
            className="mt-5 w-full bg-zinc-950 text-white hover:bg-zinc-800"
          >
            <Link href={session?.user ? "/snippets/new" : "/signin"}>
              Create snippet
            </Link>
          </Button>
        </section>
        <section className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold uppercase text-zinc-500">
            MVP Languages
          </h2>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {["TypeScript", "JavaScript", "Python", "Go", "SQL", "Bash"].map(
              (language) => (
                <span
                  key={language}
                  className="rounded-full border border-zinc-200 px-3 py-1 text-zinc-700"
                >
                  {language}
                </span>
              ),
            )}
          </div>
        </section>
      </div>
    </aside>
  );
}
