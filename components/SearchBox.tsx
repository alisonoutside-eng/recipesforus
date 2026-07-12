export function SearchBox({
  defaultValue,
  category,
}: {
  defaultValue?: string;
  category?: string;
}) {
  return (
    <form action="/" method="get" className="flex gap-2">
      {category && <input type="hidden" name="category" value={category} />}
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Search recipes or ingredients…"
        className="flex-1 rounded-lg border border-black/15 px-3 py-2 dark:border-white/20 dark:bg-transparent"
      />
      <button
        type="submit"
        className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background"
      >
        Search
      </button>
    </form>
  );
}
