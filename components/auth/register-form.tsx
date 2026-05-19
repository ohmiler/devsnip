"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  registerWithCredentials,
  type CredentialsRegisterState,
} from "@/app/actions/authentication";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: CredentialsRegisterState = {};

export function RegisterForm() {
  const [state, action, pending] = useActionState(
    registerWithCredentials,
    initialState,
  );

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="h-10"
        />
        {state.errors?.name ? (
          <p className="text-sm text-red-600">{state.errors.name[0]}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-10"
        />
        {state.errors?.email ? (
          <p className="text-sm text-red-600">{state.errors.email[0]}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="h-10"
        />
        {state.errors?.password ? (
          <p className="text-sm text-red-600">{state.errors.password[0]}</p>
        ) : null}
      </div>
      {state.message ? (
        <p className="text-sm text-red-600" role="alert">
          {state.message}
        </p>
      ) : null}
      <Button
        type="submit"
        className="w-full bg-zinc-950 text-white hover:bg-zinc-800"
        disabled={pending}
      >
        Create Account
      </Button>
      <p className="text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link href="/signin" className="font-medium text-zinc-950 underline">
          Sign In
        </Link>
      </p>
    </form>
  );
}
