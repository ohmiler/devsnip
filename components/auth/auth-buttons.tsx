import { LogIn, LogOut } from "lucide-react";
import { signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", { redirectTo: "/" });
      }}
    >
      <Button
        type="submit"
        className="gap-2 bg-zinc-950 text-white hover:bg-zinc-800"
      >
        <LogIn className="size-4" />
        Sign in with GitHub
      </Button>
    </form>
  );
}

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <Button type="submit" variant="outline" className="gap-2">
        <LogOut className="size-4" />
        Sign out
      </Button>
    </form>
  );
}
