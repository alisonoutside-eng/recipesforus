"use client";

import { useState } from "react";

type Category = { name: string; slug: string };

const NEW_CATEGORY_OPTION = "__new__";

export function CategoryCombobox({
  categories,
  defaultValue,
}: {
  categories: Category[];
  defaultValue?: string;
}) {
  const matchesExisting =
    !!defaultValue && categories.some((c) => c.name === defaultValue);
  const startInNewMode = categories.length === 0 || (!!defaultValue && !matchesExisting);

  const [isAddingNew, setIsAddingNew] = useState(startInNewMode);
  const [selectValue, setSelectValue] = useState(
    matchesExisting ? (defaultValue as string) : (categories[0]?.name ?? "")
  );

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="category" className="text-sm font-medium">
        Category
      </label>

      {isAddingNew ? (
        <div className="flex gap-2">
          <input
            id="category"
            name="category"
            required
            autoFocus={categories.length > 0}
            defaultValue={startInNewMode ? defaultValue : ""}
            placeholder="e.g. Dessert"
            autoComplete="off"
            className="flex-1 rounded-lg border border-black/15 px-3 py-2 dark:border-white/20 dark:bg-transparent"
          />
          {categories.length > 0 && (
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="shrink-0 rounded-lg border border-black/15 px-3 py-2 text-sm dark:border-white/20"
            >
              Choose existing
            </button>
          )}
        </div>
      ) : (
        <select
          id="category"
          name="category"
          required
          value={selectValue}
          onChange={(event) => {
            if (event.target.value === NEW_CATEGORY_OPTION) {
              setIsAddingNew(true);
            } else {
              setSelectValue(event.target.value);
            }
          }}
          className="rounded-lg border border-black/15 px-3 py-2 dark:border-white/20 dark:bg-transparent"
        >
          {categories.map((category) => (
            <option key={category.slug} value={category.name}>
              {category.name}
            </option>
          ))}
          <option value={NEW_CATEGORY_OPTION}>+ Add new category…</option>
        </select>
      )}
    </div>
  );
}
