import Link from "next/link";
import { Bookmark, Home, LayoutDashboard, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const navItems = [
  { href: "/", label: "Feed", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/snippets/new", label: "New Snippet", icon: PlusCircle },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <nav className="sticky top-24 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-12 items-center gap-3 rounded-lg px-4 text-sm font-medium text-zinc-700 transition hover:bg-white hover:text-zinc-950",
            )}
          >
            <item.icon className="size-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
