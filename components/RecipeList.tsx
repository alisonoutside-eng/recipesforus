import { RecipeCard } from "@/components/RecipeCard";

type RecipeListItem = {
  id: string;
  title: string;
  addedBy: string;
  categoryName: string;
  bodyType: string;
  photoUrls: string[] | null;
};

export function RecipeList({ recipes }: { recipes: RecipeListItem[] }) {
  if (recipes.length === 0) {
    return (
      <p className="py-12 text-center text-zinc-500 dark:text-zinc-400">
        No recipes yet — be the first to add one.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} {...recipe} />
      ))}
    </div>
  );
}
