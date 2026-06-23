"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SearchInput } from "@/components/SearchInput";
import type { RagaOutlineData } from "@/lib/data";

function RagaOutlinesList({ outlines }: { outlines: RagaOutlineData[] }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";

  const filtered = query
    ? outlines.filter((outline) =>
        [outline.title, outline.ragam, outline.description]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : outlines;

  return (
    <div className="space-y-6">
      <SearchInput placeholder="Search ragas…" />

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
                  <p className="mt-1 line-clamp-2 text-sm text-muted">
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

export function RagaOutlinesPageContent({
  outlines,
}: {
  outlines: RagaOutlineData[];
}) {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
      <RagaOutlinesList outlines={outlines} />
    </Suspense>
  );
}
