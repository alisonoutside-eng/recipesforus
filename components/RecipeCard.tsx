import Link from "next/link";
import Image from "next/image";
import { photoServingUrl } from "@/lib/photoUrl";

type RecipeCardProps = {
  id: string;
  title: string;
  addedBy: string;
  categoryName: string;
  photoUrls: string[] | null;
  coverPhotoUrl: string | null;
};

export function RecipeCard({
  id,
  title,
  addedBy,
  categoryName,
  photoUrls,
  coverPhotoUrl,
}: RecipeCardProps) {
  const thumbnail = coverPhotoUrl ?? photoUrls?.[0];

  return (
    <Link
      href={`/recipes/${id}`}
      className="flex gap-4 rounded-xl border border-black/10 p-4 transition-colors hover:bg-black/[.03] dark:border-white/15 dark:hover:bg-white/[.06]"
    >
      {thumbnail ? (
        <Image
          src={photoServingUrl(thumbnail)}
          alt={title}
          width={72}
          height={72}
          unoptimized
          className="h-18 w-18 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-lg bg-black/5 text-2xl dark:bg-white/10">
          🍽️
        </div>
      )}
      <div className="flex min-w-0 flex-col justify-center gap-1">
        <span className="truncate font-semibold">{title}</span>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {categoryName} · added by {addedBy}
        </span>
      </div>
    </Link>
  );
}
