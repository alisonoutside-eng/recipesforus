"use server";

import { db } from "@/lib/db";
import { recipes, categories } from "@/lib/schema";
import { findOrCreateCategory } from "@/actions/categories";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";

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
      notes: recipes.notes,
      createdAt: recipes.createdAt,
      categoryName: categories.name,
    })
    .from(recipes)
    .innerJoin(categories, eq(recipes.categoryId, categories.id))
    .where(eq(recipes.id, id))
    .limit(1);

  return row;
}

export async function createTypedRecipe(input: {
  title: string;
  category: string;
  addedBy: string;
  ingredients: string;
  instructions: string;
  coverPhotoUrl?: string;
}) {
  const title = input.title.trim();
  const categoryName = input.category.trim();
  const addedBy = input.addedBy.trim();
  const ingredients = input.ingredients.trim();
  const instructions = input.instructions.trim();

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
      photoUrls: input.coverPhotoUrl ? [input.coverPhotoUrl] : undefined,
    })
    .returning();

  revalidatePath("/");
  return recipe.id as string;
}

export async function createPhotoRecipe(input: {
  title: string;
  category: string;
  addedBy: string;
  photoUrls: string[];
  notes?: string;
}) {
  const title = input.title.trim();
  const categoryName = input.category.trim();
  const addedBy = input.addedBy.trim();
  const notes = input.notes?.trim() || null;

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
      notes,
    })
    .returning();

  revalidatePath("/");
  return recipe.id as string;
}

export async function updateTypedRecipe(
  id: string,
  input: {
    title: string;
    category: string;
    addedBy: string;
    ingredients: string;
    instructions: string;
    coverPhotoUrl?: string;
  }
) {
  const title = input.title.trim();
  const categoryName = input.category.trim();
  const addedBy = input.addedBy.trim();
  const ingredients = input.ingredients.trim();
  const instructions = input.instructions.trim();

  if (!title || !categoryName || !addedBy || !ingredients || !instructions) {
    throw new Error("All fields are required");
  }

  const category = await findOrCreateCategory(categoryName);

  if (input.coverPhotoUrl) {
    const [existing] = await db
      .select({ photoUrls: recipes.photoUrls })
      .from(recipes)
      .where(eq(recipes.id, id))
      .limit(1);

    await db
      .update(recipes)
      .set({
        title,
        categoryId: category.id,
        addedBy,
        ingredients,
        instructions,
        photoUrls: [input.coverPhotoUrl],
      })
      .where(eq(recipes.id, id));

    if (existing?.photoUrls?.length) {
      await del(existing.photoUrls).catch(() => {});
    }
  } else {
    await db
      .update(recipes)
      .set({ title, categoryId: category.id, addedBy, ingredients, instructions })
      .where(eq(recipes.id, id));
  }

  revalidatePath("/");
  revalidatePath(`/recipes/${id}`);
}

export async function updatePhotoRecipe(
  id: string,
  input: {
    title: string;
    category: string;
    addedBy: string;
    photoUrls?: string[];
    notes?: string;
  }
) {
  const title = input.title.trim();
  const categoryName = input.category.trim();
  const addedBy = input.addedBy.trim();
  const notes = input.notes?.trim() || null;

  if (!title || !categoryName || !addedBy) {
    throw new Error("All fields are required");
  }

  const category = await findOrCreateCategory(categoryName);

  if (input.photoUrls && input.photoUrls.length > 0) {
    const [existing] = await db
      .select({ photoUrls: recipes.photoUrls })
      .from(recipes)
      .where(eq(recipes.id, id))
      .limit(1);

    await db
      .update(recipes)
      .set({
        title,
        categoryId: category.id,
        addedBy,
        photoUrls: input.photoUrls,
        notes,
      })
      .where(eq(recipes.id, id));

    if (existing?.photoUrls?.length) {
      await del(existing.photoUrls).catch(() => {});
    }
  } else {
    await db
      .update(recipes)
      .set({ title, categoryId: category.id, addedBy, notes })
      .where(eq(recipes.id, id));
  }

  revalidatePath("/");
  revalidatePath(`/recipes/${id}`);
}

export async function deleteRecipe(id: string) {
  const [existing] = await db
    .select({ photoUrls: recipes.photoUrls })
    .from(recipes)
    .where(eq(recipes.id, id))
    .limit(1);

  await db.delete(recipes).where(eq(recipes.id, id));

  if (existing?.photoUrls?.length) {
    await del(existing.photoUrls).catch(() => {});
  }

  revalidatePath("/");
}
