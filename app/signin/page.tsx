import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { GitHubSignInButton } from "@/components/auth/auth-buttons";
import { CredentialsSignInForm } from "@/components/auth/credentials-sign-in-form";

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
          Sign in to DevSnip.
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Sign in to publish snippets, like useful code, and save references.
        </p>
        <div className="mt-8 space-y-5">
          <CredentialsSignInForm />
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-200" />
            <span className="text-xs font-medium uppercase text-zinc-500">
              or
            </span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>
          <GitHubSignInButton />
        </div>
      </section>
    </main>
  );
}
