import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-6">
      <section className="max-w-md text-center">
        <p className="text-sm font-medium text-zinc-500">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
          Snippet not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          The page you opened does not exist or is not available to your
          account.
        </p>
        <Button asChild className="mt-6 bg-zinc-950 text-white hover:bg-zinc-800">
          <Link href="/">Back to feed</Link>
        </Button>
      </section>
    </main>
  );
}
