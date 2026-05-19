import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { AppShell } from "@/components/layout/app-shell";
import { SnippetCard } from "@/components/snippets/snippet-card";
import { getSnippetById } from "@/lib/snippets";

type SnippetDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SnippetDetailPage({
  params,
}: SnippetDetailPageProps) {
  const { id } = await params;
  const session = await auth();
  const snippet = await getSnippetById(id, session?.user?.id);

  if (!snippet) {
    notFound();
  }

  return (
    <AppShell session={session}>
      <div className="mb-5">
        <Link
          href="/"
          className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
        >
          Back to feed
        </Link>
      </div>
      <SnippetCard snippet={snippet} />
    </AppShell>
  );
}
