type Category = { name: string; slug: string };

export function CategoryCombobox({ categories }: { categories: Category[] }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="category" className="text-sm font-medium">
        Category
      </label>
      <input
        id="category"
        name="category"
        list="category-options"
        required
        placeholder="e.g. Dessert"
        autoComplete="off"
        className="rounded-lg border border-black/15 px-3 py-2 dark:border-white/20 dark:bg-transparent"
      />
      <datalist id="category-options">
        {categories.map((category) => (
          <option key={category.slug} value={category.name} />
        ))}
      </datalist>
    </div>
  );
}
