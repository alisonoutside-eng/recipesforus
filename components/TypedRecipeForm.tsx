import { createTypedRecipe, updateTypedRecipe } from "@/actions/recipes";
import { listCategories } from "@/actions/categories";
import { CategoryCombobox } from "@/components/CategoryCombobox";
import { AddedByField } from "@/components/AddedByField";

type TypedRecipeFormProps = {
  recipeId?: string;
  initialValues?: {
    title: string;
    categoryName: string;
    addedBy: string;
    ingredients: string;
    instructions: string;
  };
};

export async function TypedRecipeForm({
  recipeId,
  initialValues,
}: TypedRecipeFormProps) {
  const categories = await listCategories();
  const action = recipeId
    ? updateTypedRecipe.bind(null, recipeId)
    : createTypedRecipe;

  return (
    <form action={action} className="flex flex-col gap-4">
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

      <button
        type="submit"
        className="mt-2 rounded-full bg-foreground px-5 py-3 font-medium text-background"
      >
        {recipeId ? "Save changes" : "Save recipe"}
      </button>
    </form>
  );
}
