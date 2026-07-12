"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPhotoRecipe } from "@/actions/recipes";
import { CategoryCombobox } from "@/components/CategoryCombobox";
import { AddedByField } from "@/components/AddedByField";

type Category = { name: string; slug: string };

async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const maxDimension = 1600;
  const scale = Math.min(
    1,
    maxDimension / Math.max(bitmap.width, bitmap.height)
  );
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width * scale;
  canvas.height = bitmap.height * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob ?? file),
      "image/jpeg",
      0.82
    );
  });
}

export function PhotoUploadForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
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

    if (!title || !category || !addedBy || files.length === 0) {
      setError("Please fill in every field and choose at least one photo.");
      return;
    }

    setIsSubmitting(true);
    try {
      const photoUrls: string[] = [];
      for (const file of files) {
        const compressed = await compressImage(file);
        const uploadData = new FormData();
        uploadData.set("file", compressed, file.name);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });
        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.error ?? "Upload failed");
        }
        const { pathname } = await response.json();
        photoUrls.push(pathname);
      }

      const recipeId = await createPhotoRecipe({
        title,
        category,
        addedBy,
        photoUrls,
      });
      router.push(`/recipes/${recipeId}`);
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
          placeholder="e.g. Grandma's Pot Roast"
          className="rounded-lg border border-black/15 px-3 py-2 dark:border-white/20 dark:bg-transparent"
        />
      </div>

      <CategoryCombobox categories={categories} />
      <AddedByField />

      <div className="flex flex-col gap-1">
        <label htmlFor="photos" className="text-sm font-medium">
          Photo(s) of the recipe
        </label>
        <input
          id="photos"
          type="file"
          accept="image/*"
          multiple
          capture="environment"
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

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded-full bg-foreground px-5 py-3 font-medium text-background disabled:opacity-60"
      >
        {isSubmitting ? "Uploading…" : "Save recipe"}
      </button>
    </form>
  );
}
