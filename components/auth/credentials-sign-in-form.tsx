"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  signInWithCredentials,
  type CredentialsSignInState,
} from "@/app/actions/authentication";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: CredentialsSignInState = {};

export function CredentialsSignInForm() {
  const [state, action, pending] = useActionState(
    signInWithCredentials,
    initialState,
  );

  return (
    <form
      action={action}
      aria-label="Sign in"
      className="space-y-4"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="h-10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="h-10"
        />
      </div>
      {state.message ? (
        <p className="text-sm text-red-600" role="alert">
          {state.message}
        </p>
      ) : null}
      {state.errors?.email ? (
        <p className="text-sm text-red-600">{state.errors.email[0]}</p>
      ) : null}
      {state.errors?.password ? (
        <p className="text-sm text-red-600">{state.errors.password[0]}</p>
      ) : null}
      <Button
        type="submit"
        className="w-full bg-zinc-950 text-white hover:bg-zinc-800"
        disabled={pending}
      >
        Sign In
      </Button>
      <p className="text-center text-sm text-zinc-600">
        New to DevSnip?{" "}
        <Link href="/register" className="font-medium text-zinc-950 underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
