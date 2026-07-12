import {
  pgTable,
  uuid,
  text,
  timestamp,
  check,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const recipes = pgTable(
  "recipes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id),
    addedBy: text("added_by").notNull(),
    bodyType: text("body_type").notNull(),
    ingredients: text("ingredients"),
    instructions: text("instructions"),
    photoUrls: text("photo_urls").array(),
    coverPhotoUrl: text("cover_photo_url"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("recipes_category_id_idx").on(table.categoryId),
    check("body_type_check", sql`${table.bodyType} in ('typed', 'photo')`),
  ]
);

export type Category = typeof categories.$inferSelect;
export type Recipe = typeof recipes.$inferSelect;
