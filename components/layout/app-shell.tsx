import { type Session } from "next-auth";
import { RightPanel } from "@/components/layout/right-panel";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";

export function AppShell({
  children,
  session,
  query,
}: {
  children: React.ReactNode;
  session: Session | null;
  query?: string;
}) {
  return (
    <div className="min-h-screen bg-zinc-100">
      <TopBar session={session} query={query} />
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Sidebar />
        <main className="min-w-0 flex-1">{children}</main>
        <RightPanel session={session} />
      </div>
    </div>
  );
}
