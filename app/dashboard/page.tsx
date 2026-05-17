import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { SnippetManagementList } from "@/components/dashboard/snippet-management-list";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { getDashboardData } from "@/lib/snippets";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const data = await getDashboardData(session.user.id);

  return (
    <AppShell session={session}>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
            Your snippets
          </h1>
        </div>
        <Button asChild className="bg-zinc-950 text-white hover:bg-zinc-800">
          <Link href="/snippets/new">New snippet</Link>
        </Button>
      </div>
      <div className="space-y-5">
        <DashboardStats stats={data.stats} />
        <SnippetManagementList snippets={data.snippets} />
      </div>
    </AppShell>
  );
}
