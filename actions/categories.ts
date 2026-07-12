"use server";

import { db } from "@/lib/db";
import { categories } from "@/lib/schema";
import { slugify } from "@/lib/slugify";
import { asc, eq } from "drizzle-orm";

export async function listCategories() {
  return db.select().from(categories).orderBy(asc(categories.name));
}

export async function findOrCreateCategory(rawName: string) {
  const name = rawName.trim();
  const slug = slugify(name);

  if (!slug) {
    throw new Error("Category name cannot be empty");
  }

  const [inserted] = await db
    .insert(categories)
    .values({ name, slug })
    .onConflictDoNothing({ target: categories.slug })
    .returning();

  if (inserted) return inserted;

  const [existing] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);

  return existing;
}
