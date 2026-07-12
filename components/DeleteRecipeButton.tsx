"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteRecipe } from "@/actions/recipes";

export function DeleteRecipeButton({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this recipe? You can restore it from Trash later.")) return;
    setIsDeleting(true);
    try {
      await deleteRecipe(id);
      router.push("/");
    } catch {
      setIsDeleting(false);
      alert("Couldn't delete this recipe. Please try again.");
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-full border border-red-600/40 px-4 py-2 text-sm font-medium text-red-600 disabled:opacity-60 dark:border-red-400/40 dark:text-red-400"
    >
      {isDeleting ? "Deleting…" : "Delete"}
    </button>
  );
}
