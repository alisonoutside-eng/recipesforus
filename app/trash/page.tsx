import Link from "next/link";
import { getTrashedRecipes } from "@/actions/recipes";
import { TrashedRecipeActions } from "@/components/TrashedRecipeActions";

export const dynamic = "force-dynamic";

export default async function TrashPage() {
  const trashed = await getTrashedRecipes();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <Link href="/" className="text-sm text-zinc-500 dark:text-zinc-400">
        ← Back to all recipes
      </Link>

      <h1 className="text-2xl font-semibold">Trash</h1>

      {trashed.length === 0 ? (
        <p className="py-12 text-center text-zinc-500 dark:text-zinc-400">
          Trash is empty.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {trashed.map((recipe) => (
            <div
              key={recipe.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-black/10 p-4 dark:border-white/15"
            >
              <div className="min-w-0">
                <span className="block truncate font-semibold">
                  {recipe.title}
                </span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {recipe.categoryName} · added by {recipe.addedBy}
                </span>
              </div>
              <TrashedRecipeActions id={recipe.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
