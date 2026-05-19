import Link from "next/link";
import { Code2 } from "lucide-react";
import { type Session } from "next-auth";
import { SignInButton, SignOutButton } from "@/components/auth/auth-buttons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { navItems } from "@/components/layout/sidebar";
import { SearchForm } from "@/components/layout/search-form";

function initials(name?: string | null) {
  return name?.slice(0, 2).toUpperCase() ?? "DS";
}

export function TopBar({
  session,
  query,
}: {
  session: Session | null;
  query?: string;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 text-2xl font-semibold tracking-tight"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-zinc-950 text-white">
            <Code2 className="size-5" />
          </span>
          <span>DevSnip</span>
        </Link>
        <div className="hidden flex-1 justify-center md:flex">
          <SearchForm key={`desktop-${query ?? ""}`} query={query} />
        </div>
        <div className="ml-auto flex items-center gap-3">
          {session?.user ? (
            <>
              <Avatar>
                <AvatarImage
                  src={session.user.image ?? undefined}
                  alt={session.user.name ?? "User"}
                />
                <AvatarFallback>{initials(session.user.name)}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <SignOutButton />
              </div>
            </>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
      <div className="border-t border-zinc-100 px-4 py-3 md:hidden">
        <SearchForm key={`mobile-${query ?? ""}`} query={query} />
      </div>
      <nav className="border-t border-zinc-100 px-2 py-2 lg:hidden">
        <div className="mx-auto grid max-w-2xl grid-cols-4 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex h-11 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
              aria-label={item.label}
              title={item.label}
            >
              <item.icon className="size-5" />
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
