export function MetadataField({
  label,
  value,
  align = "left",
}: {
  label: string;
  value: string | string[] | null | undefined;
  align?: "left" | "right";
}) {
  const empty =
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0);

  if (empty) return null;

  return (
    <div className={align === "right" ? "min-w-0 shrink-0 text-left sm:text-right" : "min-w-0 text-left"}>
      <dt className="inline-block rounded-full bg-accent-soft py-0.5 pr-2.5 text-xs font-semibold uppercase tracking-wide text-accent">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm font-medium text-foreground-strong">
        {Array.isArray(value) ? value.join(", ") : value}
      </dd>
    </div>
  );
}

export function MetadataList({
  items,
  row = false,
}: {
  items: { label: string; value: string | string[] | null | undefined }[];
  /** Single horizontal row (wraps on narrow screens). */
  row?: boolean;
}) {
  const visible = items.filter(
    (i) =>
      i.value !== null &&
      i.value !== undefined &&
      (Array.isArray(i.value) ? i.value.length > 0 : i.value !== ""),
  );

  if (visible.length === 0) return null;

  return (
    <dl
      className={
        row
          ? "flex flex-wrap items-start gap-x-10 gap-y-3"
          : "grid gap-3 sm:grid-cols-2"
      }
    >
      {visible.map(({ label, value }) => (
        <div key={label} className="min-w-[5.5rem]">
          <dt className="inline-block rounded-full bg-accent-soft py-0.5 pr-2.5 text-xs font-semibold uppercase tracking-wide text-accent">
            {label}
          </dt>
          <dd className="mt-1.5 text-sm font-medium text-foreground-strong">
            {Array.isArray(value) ? value.join(", ") : value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
