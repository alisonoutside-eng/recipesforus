"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { restoreRecipe, permanentlyDeleteRecipe } from "@/actions/recipes";

export function TrashedRecipeActions({ id }: { id: string }) {
  const router = useRouter();
  const [isWorking, setIsWorking] = useState(false);

  async function handleRestore() {
    setIsWorking(true);
    try {
      await restoreRecipe(id);
      router.refresh();
    } catch {
      setIsWorking(false);
      alert("Couldn't restore this recipe. Please try again.");
    }
  }

  async function handlePermanentDelete() {
    if (
      !confirm(
        "Permanently delete this recipe? This cannot be undone and it will not be recoverable."
      )
    )
      return;
    setIsWorking(true);
    try {
      await permanentlyDeleteRecipe(id);
      router.refresh();
    } catch {
      setIsWorking(false);
      alert("Couldn't delete this recipe. Please try again.");
    }
  }

  return (
    <div className="flex shrink-0 gap-2">
      <button
        onClick={handleRestore}
        disabled={isWorking}
        className="rounded-full border border-black/15 px-3 py-1.5 text-sm font-medium disabled:opacity-60 dark:border-white/20"
      >
        Restore
      </button>
      <button
        onClick={handlePermanentDelete}
        disabled={isWorking}
        className="rounded-full border border-red-600/40 px-3 py-1.5 text-sm font-medium text-red-600 disabled:opacity-60 dark:border-red-400/40 dark:text-red-400"
      >
        Delete forever
      </button>
    </div>
  );
}
