import { describe, expect, it } from "vitest";
import { parseSnippetFormData } from "@/lib/snippet-schema";

function formData(input: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(input)) {
    data.set(key, value);
  }
  return data;
}

describe("parseSnippetFormData", () => {
  it("accepts valid snippet input", () => {
    const result = parseSnippetFormData(
      formData({
        title: "Fetch typed data",
        caption: "A small helper for server components.",
        language: "TypeScript",
        code: "export async function getData() { return [] }",
      }),
    );

    expect(result.success).toBe(true);
  });

  it("rejects an empty code block", () => {
    const result = parseSnippetFormData(
      formData({
        title: "Fetch typed data",
        caption: "",
        language: "TypeScript",
        code: "",
      }),
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.code?.[0]).toContain(
        "Code is required",
      );
    }
  });
});
