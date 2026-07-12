import Link from "next/link";
import { listCategories } from "@/actions/categories";
import { PhotoUploadForm } from "@/components/PhotoUploadForm";

export const dynamic = "force-dynamic";

export default async function NewPhotoRecipePage() {
  const categories = await listCategories();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <Link
        href="/recipes/new"
        className="text-sm text-zinc-500 dark:text-zinc-400"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold">Upload a recipe photo</h1>
      <PhotoUploadForm categories={categories} />
    </div>
  );
}
