"use client";

import { startTransition, useOptimistic, useState } from "react";
import { Bookmark, Heart } from "lucide-react";
import { toggleBookmark, toggleLike } from "@/app/actions/social";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SocialActions({
  snippetId,
  liked,
  bookmarked,
  likeCount,
  bookmarkCount,
}: {
  snippetId: string;
  liked: boolean;
  bookmarked: boolean;
  likeCount: number;
  bookmarkCount: number;
}) {
  const [error, setError] = useState("");
  const [optimistic, updateOptimistic] = useOptimistic(
    { liked, bookmarked, likeCount, bookmarkCount },
    (state, action: "like" | "bookmark") => {
      if (action === "like") {
        return {
          ...state,
          liked: !state.liked,
          likeCount: state.likeCount + (state.liked ? -1 : 1),
        };
      }

      return {
        ...state,
        bookmarked: !state.bookmarked,
        bookmarkCount: state.bookmarkCount + (state.bookmarked ? -1 : 1),
      };
    },
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn("gap-2", optimistic.liked && "text-zinc-950")}
        onClick={() => {
          setError("");
          startTransition(async () => {
            updateOptimistic("like");
            try {
              await toggleLike(snippetId);
            } catch {
              setError("Sign in to like snippets.");
            }
          });
        }}
      >
        <Heart className={cn("size-4", optimistic.liked && "fill-zinc-950")} />
        {optimistic.likeCount}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn("gap-2", optimistic.bookmarked && "text-zinc-950")}
        onClick={() => {
          setError("");
          startTransition(async () => {
            updateOptimistic("bookmark");
            try {
              await toggleBookmark(snippetId);
            } catch {
              setError("Sign in to save snippets.");
            }
          });
        }}
      >
        <Bookmark
          className={cn("size-4", optimistic.bookmarked && "fill-zinc-950")}
        />
        {optimistic.bookmarkCount}
      </Button>
      {error ? <p className="text-xs text-zinc-500">{error}</p> : null}
    </div>
  );
}
