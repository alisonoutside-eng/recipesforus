import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipeById } from "@/actions/recipes";
import { listCategories } from "@/actions/categories";
import { TypedRecipeForm } from "@/components/TypedRecipeForm";
import { PhotoUploadForm } from "@/components/PhotoUploadForm";

export const dynamic = "force-dynamic";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [recipe, categories] = await Promise.all([
    getRecipeById(id),
    listCategories(),
  ]);

  if (!recipe) notFound();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <Link
        href={`/recipes/${id}`}
        className="text-sm text-zinc-500 dark:text-zinc-400"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold">Edit recipe</h1>

      {recipe.bodyType === "typed" ? (
        <TypedRecipeForm
          categories={categories}
          recipeId={id}
          initialValues={{
            title: recipe.title,
            categoryName: recipe.categoryName,
            addedBy: recipe.addedBy,
            ingredients: recipe.ingredients ?? "",
            instructions: recipe.instructions ?? "",
            hasCoverPhoto: Boolean(recipe.coverPhotoUrl),
          }}
        />
      ) : (
        <PhotoUploadForm
          categories={categories}
          recipeId={id}
          initialValues={{
            title: recipe.title,
            categoryName: recipe.categoryName,
            addedBy: recipe.addedBy,
            notes: recipe.notes,
            hasCoverPhoto: Boolean(recipe.coverPhotoUrl),
          }}
        />
      )}
    </div>
  );
}
