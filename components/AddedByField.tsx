export function AddedByField({ defaultValue }: { defaultValue?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="addedBy" className="text-sm font-medium">
        Your name
      </label>
      <input
        id="addedBy"
        name="addedBy"
        required
        defaultValue={defaultValue}
        placeholder="e.g. Sarah"
        autoComplete="name"
        className="rounded-lg border border-black/15 px-3 py-2 dark:border-white/20 dark:bg-transparent"
      />
    </div>
  );
}
