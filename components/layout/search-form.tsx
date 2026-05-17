import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchForm({ query = "" }: { query?: string }) {
  return (
    <form action="/" className="relative w-full max-w-xl">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
      <Input
        name="q"
        defaultValue={query}
        aria-label="Search snippets"
        className="h-11 rounded-lg border-zinc-200 bg-zinc-100 pl-10 text-base shadow-none"
      />
    </form>
  );
}
