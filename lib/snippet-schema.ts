import { z } from "zod";

export const LANGUAGE_OPTIONS = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "SQL",
  "Bash",
  "Other",
] as const;

export type SnippetLanguage = (typeof LANGUAGE_OPTIONS)[number];

export type SnippetFormState = {
  errors?: {
    title?: string[];
    caption?: string[];
    language?: string[];
    code?: string[];
  };
  message?: string;
  values?: {
    title?: string;
    caption?: string;
    language?: string;
    code?: string;
  };
};

const rawSnippetSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(80, "Title must be 80 characters or fewer"),
  caption: z
    .string()
    .trim()
    .max(280, "Caption must be 280 characters or fewer"),
  language: z.enum(LANGUAGE_OPTIONS, {
    error: "Choose a supported language",
  }),
  code: z
    .string()
    .trim()
    .min(1, "Code is required")
    .max(12000, "Code must be 12,000 characters or fewer"),
});

export const snippetSchema = rawSnippetSchema.transform((value) => ({
  ...value,
  caption: value.caption.length > 0 ? value.caption : null,
}));

export type SnippetInput = z.infer<typeof snippetSchema>;

export function parseSnippetFormData(formData: FormData) {
  return snippetSchema.safeParse({
    title: formData.get("title"),
    caption: formData.get("caption") ?? "",
    language: formData.get("language"),
    code: formData.get("code"),
  });
}

export function formStateFromValidation(
  result: ReturnType<typeof parseSnippetFormData>,
  formData: FormData,
): SnippetFormState {
  if (result.success) {
    return {};
  }

  return {
    errors: result.error.flatten().fieldErrors,
    message: "Please fix the highlighted fields.",
    values: {
      title: String(formData.get("title") ?? ""),
      caption: String(formData.get("caption") ?? ""),
      language: String(formData.get("language") ?? "TypeScript"),
      code: String(formData.get("code") ?? ""),
    },
  };
}
