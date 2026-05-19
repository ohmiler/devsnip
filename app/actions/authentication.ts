"use server";

import { signIn } from "@/auth";
import { registerSchema, signInSchema } from "@/lib/auth-validation";
import { hashPassword } from "@/lib/password";
import prisma from "@/lib/prisma";

export type CredentialsSignInState = {
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
};

export type CredentialsRegisterState = {
  message?: string;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
};

function isRedirectError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String((error as { digest?: unknown }).digest).startsWith("NEXT_REDIRECT")
  );
}

export async function signInWithCredentials(
  _prevState: CredentialsSignInState,
  formData: FormData,
): Promise<CredentialsSignInState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Check the highlighted fields.",
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/",
    });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { message: "Invalid email or password." };
  }

  return {};
}

export async function registerWithCredentials(
  _prevState: CredentialsRegisterState,
  formData: FormData,
): Promise<CredentialsRegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Check the highlighted fields.",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  });

  if (existingUser) {
    return { message: "An account with this email already exists." };
  }

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      emailVerified: new Date(),
      passwordHash: await hashPassword(parsed.data.password),
    },
  });

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/",
    });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { message: "Account created, but sign-in failed." };
  }

  return {};
}
