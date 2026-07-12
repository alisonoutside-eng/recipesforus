"use server";

import { db } from "@/lib/db";
import { recipes, categories } from "@/lib/schema";
import { findOrCreateCategory } from "@/actions/categories";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function getRecipes(categorySlug?: string) {
  const rows = await db
    .select({
      id: recipes.id,
      title: recipes.title,
      addedBy: recipes.addedBy,
      bodyType: recipes.bodyType,
      photoUrls: recipes.photoUrls,
      createdAt: recipes.createdAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(recipes)
    .innerJoin(categories, eq(recipes.categoryId, categories.id))
    .orderBy(desc(recipes.createdAt));

  if (!categorySlug) return rows;
  return rows.filter((r) => r.categorySlug === categorySlug);
}

export async function getRecipeById(id: string) {
  const [row] = await db
    .select({
      id: recipes.id,
      title: recipes.title,
      addedBy: recipes.addedBy,
      bodyType: recipes.bodyType,
      ingredients: recipes.ingredients,
      instructions: recipes.instructions,
      photoUrls: recipes.photoUrls,
      createdAt: recipes.createdAt,
      categoryName: categories.name,
    })
    .from(recipes)
    .innerJoin(categories, eq(recipes.categoryId, categories.id))
    .where(eq(recipes.id, id))
    .limit(1);

  return row;
}

export async function createTypedRecipe(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const categoryName = String(formData.get("category") ?? "").trim();
  const addedBy = String(formData.get("addedBy") ?? "").trim();
  const ingredients = String(formData.get("ingredients") ?? "").trim();
  const instructions = String(formData.get("instructions") ?? "").trim();

  if (!title || !categoryName || !addedBy || !ingredients || !instructions) {
    throw new Error("All fields are required");
  }

  const category = await findOrCreateCategory(categoryName);

  const [recipe] = await db
    .insert(recipes)
    .values({
      title,
      categoryId: category.id,
      addedBy,
      bodyType: "typed",
      ingredients,
      instructions,
    })
    .returning();

  revalidatePath("/");
  redirect(`/recipes/${recipe.id}`);
}

export async function createPhotoRecipe(input: {
  title: string;
  category: string;
  addedBy: string;
  photoUrls: string[];
}) {
  const title = input.title.trim();
  const categoryName = input.category.trim();
  const addedBy = input.addedBy.trim();

  if (!title || !categoryName || !addedBy || input.photoUrls.length === 0) {
    throw new Error("All fields, and at least one photo, are required");
  }

  const category = await findOrCreateCategory(categoryName);

  const [recipe] = await db
    .insert(recipes)
    .values({
      title,
      categoryId: category.id,
      addedBy,
      bodyType: "photo",
      photoUrls: input.photoUrls,
    })
    .returning();

  revalidatePath("/");
  return recipe.id as string;
}
