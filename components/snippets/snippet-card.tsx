import Link from "next/link";
import { SocialActions } from "@/components/snippets/social-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { type SnippetFeedItem } from "@/lib/snippets";

function displayName(snippet: SnippetFeedItem) {
  return snippet.author.name ?? snippet.author.email ?? "Developer";
}

function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

export function SnippetCard({ snippet }: { snippet: SnippetFeedItem }) {
  const name = displayName(snippet);
  const snippetHref = `/snippets/${snippet.id}`;

  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <Link
        href={snippetHref}
        className="block rounded-md outline-none transition hover:opacity-90 focus-visible:ring-3 focus-visible:ring-zinc-300"
      >
        <header className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={snippet.author.image ?? undefined} alt={name} />
            <AvatarFallback>{initials(name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
                {snippet.title}
              </h2>
              <Badge variant="outline" className="border-zinc-300">
                {snippet.language}
              </Badge>
            </div>
            <p className="text-sm text-zinc-500">by {name}</p>
          </div>
        </header>
        {snippet.caption ? (
          <p className="mt-4 text-sm leading-6 text-zinc-700">
            {snippet.caption}
          </p>
        ) : null}
        <pre className="mt-4 max-h-[420px] overflow-auto rounded-lg border border-zinc-200 bg-zinc-950 p-4 text-sm leading-6 text-zinc-50">
          <code>{snippet.code}</code>
        </pre>
      </Link>
      <footer className="mt-4 border-t border-zinc-100 pt-3">
        <SocialActions
          snippetId={snippet.id}
          liked={snippet.likedByViewer}
          bookmarked={snippet.bookmarkedByViewer}
          likeCount={snippet._count.likes}
          bookmarkCount={snippet._count.bookmarks}
        />
      </footer>
    </article>
  );
}
