import Link from "next/link";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SearchInput } from "@/components/SearchInput";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function RagaOutlinesPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim().toLowerCase() ?? "";

  const outlines = await prisma.ragaOutline.findMany({
    include: {
      media: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { ragam: "asc" },
  });

  const filtered = query
    ? outlines.filter((o) =>
        [o.title, o.ragam, o.description]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : outlines;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Raga Outlines" },
        ]}
      />

      <div>
        <h1 className="text-2xl font-semibold">Raga Outlines</h1>
        <p className="mt-1 text-sm text-muted">
          Swara singing outlines for each raga.
        </p>
      </div>

      <Suspense fallback={null}>
        <SearchInput placeholder="Search ragas…" />
      </Suspense>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted">
          {outlines.length === 0
            ? "No raga outlines imported yet."
            : "No outlines match your search."}
        </p>
      ) : (
        <ul className="divide-y divide-border-light rounded-xl border border-border bg-card shadow-md">
          {filtered.map((outline) => (
            <li key={outline.id}>
              <Link
                href={`/raga-outlines/${outline.slug}`}
                className="block px-4 py-4 transition hover:bg-card-hover"
              >
                <p className="font-medium">{outline.ragam}</p>
                {outline.description && (
                  <p className="mt-1 text-sm text-muted line-clamp-2">
                    {outline.description}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
