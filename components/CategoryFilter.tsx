import Link from "next/link";

type Category = { name: string; slug: string };

export function CategoryFilter({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/"
        className={`rounded-full px-3 py-1 text-sm ${
          !activeSlug
            ? "bg-foreground text-background"
            : "bg-black/5 dark:bg-white/10"
        }`}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/?category=${category.slug}`}
          className={`rounded-full px-3 py-1 text-sm ${
            activeSlug === category.slug
              ? "bg-foreground text-background"
              : "bg-black/5 dark:bg-white/10"
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
