import Link from "next/link";

export default function NewRecipePage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <Link href="/" className="text-sm text-zinc-500 dark:text-zinc-400">
        ← Back to all recipes
      </Link>

      <h1 className="text-2xl font-semibold">Add a recipe</h1>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/recipes/new/typed"
          className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-black/10 px-6 py-8 text-center transition-colors hover:bg-black/[.03] dark:border-white/15 dark:hover:bg-white/[.06]"
        >
          <span className="text-3xl">⌨️</span>
          <span className="font-semibold">Type it in</span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Enter the title, ingredients, and instructions
          </span>
        </Link>

        <Link
          href="/recipes/new/photo"
          className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-black/10 px-6 py-8 text-center transition-colors hover:bg-black/[.03] dark:border-white/15 dark:hover:bg-white/[.06]"
        >
          <span className="text-3xl">📷</span>
          <span className="font-semibold">Upload a photo</span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Snap a photo of a recipe card or cookbook page
          </span>
        </Link>
      </div>
    </div>
  );
}
