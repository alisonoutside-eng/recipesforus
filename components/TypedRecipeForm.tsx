import { createTypedRecipe } from "@/actions/recipes";
import { listCategories } from "@/actions/categories";
import { CategoryCombobox } from "@/components/CategoryCombobox";
import { AddedByField } from "@/components/AddedByField";

export async function TypedRecipeForm() {
  const categories = await listCategories();

  return (
    <form action={createTypedRecipe} className="flex flex-col gap-4">
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
        <label htmlFor="ingredients" className="text-sm font-medium">
          Ingredients
        </label>
        <textarea
          id="ingredients"
          name="ingredients"
          required
          rows={6}
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
          placeholder="1. Preheat oven to..."
          className="rounded-lg border border-black/15 px-3 py-2 dark:border-white/20 dark:bg-transparent"
        />
      </div>

      <button
        type="submit"
        className="mt-2 rounded-full bg-foreground px-5 py-3 font-medium text-background"
      >
        Save recipe
      </button>
    </form>
  );
}
