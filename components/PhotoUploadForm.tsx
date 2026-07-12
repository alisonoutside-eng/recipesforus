"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPhotoRecipe, updatePhotoRecipe } from "@/actions/recipes";
import { uploadImage } from "@/lib/compressImage";
import { CategoryCombobox } from "@/components/CategoryCombobox";
import { AddedByField } from "@/components/AddedByField";

type Category = { name: string; slug: string };

type PhotoUploadFormProps = {
  categories: Category[];
  recipeId?: string;
  initialValues?: {
    title: string;
    categoryName: string;
    addedBy: string;
    notes?: string | null;
    hasCoverPhoto?: boolean;
  };
};

export function PhotoUploadForm({
  categories,
  recipeId,
  initialValues,
}: PhotoUploadFormProps) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "");
    const category = String(formData.get("category") ?? "");
    const addedBy = String(formData.get("addedBy") ?? "");
    const notes = String(formData.get("notes") ?? "");

    if (!title || !category || !addedBy || (!recipeId && files.length === 0)) {
      setError("Please fill in every field and choose at least one photo.");
      return;
    }

    setIsSubmitting(true);
    try {
      const photoUrls: string[] = [];
      for (const file of files) {
        photoUrls.push(await uploadImage(file));
      }
      const coverPhotoUrl = coverFile ? await uploadImage(coverFile) : undefined;

      if (recipeId) {
        await updatePhotoRecipe(recipeId, {
          title,
          category,
          addedBy,
          notes,
          photoUrls: photoUrls.length > 0 ? photoUrls : undefined,
          coverPhotoUrl,
        });
        router.push(`/recipes/${recipeId}`);
      } else {
        const newRecipeId = await createPhotoRecipe({
          title,
          category,
          addedBy,
          notes,
          photoUrls,
          coverPhotoUrl,
        });
        router.push(`/recipes/${newRecipeId}`);
      }
    } catch (err) {
      setError((err as Error).message || "Upload failed. Please try again.");
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
        <label htmlFor="photos" className="text-sm font-medium">
          {recipeId
            ? "Replace photo(s) (leave empty to keep current)"
            : "Photo(s) of the recipe"}
        </label>
        <input
          id="photos"
          type="file"
          accept="image/*"
          multiple
          onChange={(event) =>
            setFiles(Array.from(event.currentTarget.files ?? []))
          }
          className="rounded-lg border border-black/15 px-3 py-2 dark:border-white/20 dark:bg-transparent"
        />
        {files.length > 0 && (
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {files.length} photo{files.length > 1 ? "s" : ""} selected
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes or modifications (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={initialValues?.notes ?? ""}
          placeholder="e.g. I use half the sugar, or add 10 extra minutes at altitude"
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
          A photo of the finished dish, or anything else — separate from the
          recipe photo(s) above
        </span>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded-full bg-foreground px-5 py-3 font-medium text-background disabled:opacity-60"
      >
        {isSubmitting
          ? "Uploading…"
          : recipeId
            ? "Save changes"
            : "Save recipe"}
      </button>
    </form>
  );
}
