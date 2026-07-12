export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-8">
      <h1 className="text-center text-2xl font-semibold">Family Recipes</h1>
      <form action="/api/login" method="post" className="flex flex-col gap-4">
        <input type="hidden" name="next" value={next ?? "/"} />
        <div className="flex flex-col gap-1">
          <label htmlFor="passcode" className="text-sm font-medium">
            Family passcode
          </label>
          <input
            id="passcode"
            name="passcode"
            type="password"
            required
            autoFocus
            className="rounded-lg border border-black/15 px-3 py-2 dark:border-white/20 dark:bg-transparent"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">
            Incorrect passcode. Please try again.
          </p>
        )}
        <button
          type="submit"
          className="rounded-full bg-foreground px-5 py-3 font-medium text-background"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
