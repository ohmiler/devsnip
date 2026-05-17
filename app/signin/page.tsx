import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignInButton } from "@/components/auth/auth-buttons";

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-6">
      <section className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-zinc-500">DevSnip</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
          Share code with developers.
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Sign in with GitHub to publish snippets, like useful code, and save
          references.
        </p>
        <div className="mt-8">
          <SignInButton />
        </div>
      </section>
    </main>
  );
}
