"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createTypedRecipe, updateTypedRecipe } from "@/actions/recipes";
import { uploadImage } from "@/lib/compressImage";
import { CategoryCombobox } from "@/components/CategoryCombobox";
import { AddedByField } from "@/components/AddedByField";

type Category = { name: string; slug: string };

type TypedRecipeFormProps = {
  categories: Category[];
  recipeId?: string;
  initialValues?: {
    title: string;
    categoryName: string;
    addedBy: string;
    ingredients: string;
    instructions: string;
    hasCoverPhoto?: boolean;
  };
};

export function TypedRecipeForm({
  categories,
  recipeId,
  initialValues,
}: TypedRecipeFormProps) {
  const router = useRouter();
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "");
    const category = String(formData.get("category") ?? "");
    const addedBy = String(formData.get("addedBy") ?? "");
    const ingredients = String(formData.get("ingredients") ?? "");
    const instructions = String(formData.get("instructions") ?? "");

    if (!title || !category || !addedBy || !ingredients || !instructions) {
      setError("Please fill in every field.");
      return;
    }

    setIsSubmitting(true);
    try {
      const coverPhotoUrl = coverFile ? await uploadImage(coverFile) : undefined;

      if (recipeId) {
        await updateTypedRecipe(recipeId, {
          title,
          category,
          addedBy,
          ingredients,
          instructions,
          coverPhotoUrl,
        });
        router.push(`/recipes/${recipeId}`);
      } else {
        const newRecipeId = await createTypedRecipe({
          title,
          category,
          addedBy,
          ingredients,
          instructions,
          coverPhotoUrl,
        });
        router.push(`/recipes/${newRecipeId}`);
      }
    } catch (err) {
      setError((err as Error).message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium">
          Recipe title
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={initialValues?.title}
          placeholder="e.g. Grandma's Pot Roast"
          className="rounded-lg border border-black/15 px-3 py-2 dark:border-white/20 dark:bg-transparent"
        />
      </div>

      <CategoryCombobox
        categories={categories}
        defaultValue={initialValues?.categoryName}
      />
      <AddedByField defaultValue={initialValues?.addedBy} />

      <div className="flex flex-col gap-1">
        <label htmlFor="ingredients" className="text-sm font-medium">
          Ingredients
        </label>
        <textarea
          id="ingredients"
          name="ingredients"
          required
          rows={6}
          defaultValue={initialValues?.ingredients}
          placeholder={"1 lb chicken\n2 cups rice\n..."}
          className="rounded-lg border border-black/15 px-3 py-2 dark:border-white/20 dark:bg-transparent"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="instructions" className="text-sm font-medium">
          Instructions
        </label>
        <textarea
          id="instructions"
          name="instructions"
          required
          rows={8}
          defaultValue={initialValues?.instructions}
          placeholder="1. Preheat oven to..."
          className="rounded-lg border border-black/15 px-3 py-2 dark:border-white/20 dark:bg-transparent"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="coverPhoto" className="text-sm font-medium">
          {initialValues?.hasCoverPhoto
            ? "Cover photo (leave empty to keep current) — shown on the recipe list"
            : "Cover photo (optional) — shown on the recipe list"}
        </label>
        <input
          id="coverPhoto"
          type="file"
          accept="image/*"
          onChange={(event) => setCoverFile(event.currentTarget.files?.[0] ?? null)}
          className="rounded-lg border border-black/15 px-3 py-2 dark:border-white/20 dark:bg-transparent"
        />
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          A photo of the finished dish, or anything else you&rsquo;d like to show
        </span>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded-full bg-foreground px-5 py-3 font-medium text-background disabled:opacity-60"
      >
        {isSubmitting ? "Saving…" : recipeId ? "Save changes" : "Save recipe"}
      </button>
    </form>
  );
}
