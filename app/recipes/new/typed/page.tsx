import Link from "next/link";
import { TypedRecipeForm } from "@/components/TypedRecipeForm";

export const dynamic = "force-dynamic";

export default function NewTypedRecipePage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <Link
        href="/recipes/new"
        className="text-sm text-zinc-500 dark:text-zinc-400"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold">Type in a recipe</h1>
      <TypedRecipeForm />
    </div>
  );
}
