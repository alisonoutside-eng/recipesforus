import Link from "next/link";
import { getRecipes } from "@/actions/recipes";
import { listCategories } from "@/actions/categories";
import { RecipeList } from "@/components/RecipeList";
import { CategoryFilter } from "@/components/CategoryFilter";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [recipes, categories] = await Promise.all([
    getRecipes(category),
    listCategories(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Family Recipes</h1>
        <Link
          href="/recipes/new"
          className="shrink-0 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          + Add recipe
        </Link>
      </div>

      <CategoryFilter categories={categories} activeSlug={category} />
      <RecipeList recipes={recipes} />
    </div>
  );
}
