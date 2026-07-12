import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipeById } from "@/actions/recipes";
import { photoServingUrl } from "@/lib/photoUrl";
import { DeleteRecipeButton } from "@/components/DeleteRecipeButton";

export const dynamic = "force-dynamic";

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await getRecipeById(id);

  if (!recipe) notFound();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <Link href="/" className="text-sm text-zinc-500 dark:text-zinc-400">
        ← Back to all recipes
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{recipe.title}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {recipe.categoryName} · added by {recipe.addedBy}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link
            href={`/recipes/${id}/edit`}
            className="rounded-full border border-black/15 px-4 py-2 text-sm font-medium dark:border-white/20"
          >
            Edit
          </Link>
          <DeleteRecipeButton id={id} />
        </div>
      </div>

      {recipe.bodyType === "photo" ? (
        <div className="flex flex-col gap-4">
          {recipe.photoUrls?.map((url) => (
            <Image
              key={url}
              src={photoServingUrl(url)}
              alt={recipe.title}
              width={800}
              height={1000}
              unoptimized
              className="w-full rounded-xl object-contain"
            />
          ))}
          {recipe.notes && (
            <section>
              <h2 className="mb-2 font-semibold">Notes</h2>
              <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                {recipe.notes}
              </p>
            </section>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <section>
            <h2 className="mb-2 font-semibold">Ingredients</h2>
            <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
              {recipe.ingredients}
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-semibold">Instructions</h2>
            <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
              {recipe.instructions}
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
