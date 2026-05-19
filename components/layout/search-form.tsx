"use client";

import { type FormEvent, useEffect, useState, useTransition } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export function SearchForm({ query = "" }: { query?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(query);
  const [isPending, startTransition] = useTransition();
  const normalizedQuery = query.trim();

  function searchHref(rawQuery: string) {
    const nextQuery = rawQuery.trim();

    if (!nextQuery) {
      return "/";
    }

    const params = new URLSearchParams({ q: nextQuery });
    return `/?${params.toString()}`;
  }

  useEffect(() => {
    const nextQuery = value.trim();

    if (nextQuery === normalizedQuery) {
      return;
    }

    const handle = window.setTimeout(() => {
      startTransition(() => {
        router.replace(searchHref(value), { scroll: false });
      });
    }, 300);

    return () => window.clearTimeout(handle);
  }, [normalizedQuery, router, value]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(searchHref(value));
  }

  return (
    <form
      action="/"
      role="search"
      className="relative w-full max-w-xl"
      onSubmit={submitSearch}
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
      <Input
        type="search"
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-label="Search snippets"
        aria-busy={isPending}
        className="h-11 rounded-lg border-zinc-200 bg-zinc-100 pl-10 text-base shadow-none"
      />
    </form>
  );
}
