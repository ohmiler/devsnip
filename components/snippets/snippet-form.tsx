"use client";

import { useActionState } from "react";
import {
  LANGUAGE_OPTIONS,
  type SnippetFormState,
} from "@/lib/snippet-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type SnippetFormProps = {
  action: (
    state: SnippetFormState,
    formData: FormData,
  ) => Promise<SnippetFormState>;
  submitLabel: string;
  defaultValues?: {
    title?: string;
    caption?: string | null;
    language?: string;
    code?: string;
  };
};

const initialState: SnippetFormState = {};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-sm text-zinc-500">{messages[0]}</p>;
}

export function SnippetForm({
  action,
  submitLabel,
  defaultValues,
}: SnippetFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const values = state.values ?? defaultValues ?? {};

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={values.title ?? ""}
          required
          minLength={3}
          maxLength={80}
        />
        <FieldError messages={state.errors?.title} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="caption">Caption</Label>
        <Textarea
          id="caption"
          name="caption"
          defaultValue={values.caption ?? ""}
          maxLength={280}
          rows={3}
        />
        <FieldError messages={state.errors?.caption} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select name="language" defaultValue={values.language ?? "TypeScript"}>
          <SelectTrigger id="language" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGE_OPTIONS.map((language) => (
              <SelectItem key={language} value={language}>
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError messages={state.errors?.language} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="code">Code</Label>
        <Textarea
          id="code"
          name="code"
          defaultValue={values.code ?? ""}
          required
          rows={16}
          className="font-mono text-sm"
        />
        <FieldError messages={state.errors?.code} />
      </div>
      {state.message ? (
        <p className="text-sm text-zinc-500">{state.message}</p>
      ) : null}
      <Button
        type="submit"
        disabled={pending}
        className="bg-zinc-950 text-white hover:bg-zinc-800"
      >
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
