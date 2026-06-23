import Link from "next/link";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SearchInput } from "@/components/SearchInput";
import { SongFilters } from "@/components/SongFilters";
import { parseJsonArray } from "@/lib/json";
import { prisma } from "@/lib/prisma";
import {
  buildFilterOptions,
  filterSongs,
  hasActiveFilters,
  type SongFilterParams,
} from "@/lib/song-filters";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    q?: string;
    composer?: string;
    ragam?: string;
    taalam?: string;
    songType?: string;
    language?: string;
    deity?: string;
  }>;
};

export default async function SongsPage({ searchParams }: Props) {
  const params = await searchParams;
  const filterParams: SongFilterParams = {
    q: params.q,
    composer: params.composer,
    ragam: params.ragam,
    taalam: params.taalam,
    songType: params.songType,
    language: params.language,
    deity: params.deity,
  };

  const songs = await prisma.song.findMany({
    orderBy: { title: "asc" },
    select: {
      id: true,
      slug: true,
      title: true,
      composer: true,
      ragams: true,
      taalam: true,
      songType: true,
      language: true,
      deity: true,
    },
  });

  const filterOptions = buildFilterOptions(songs);
  const filtered = filterSongs(songs, filterParams);
  const filtersActive = hasActiveFilters(filterParams);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Carnatic Songs" },
        ]}
      />

      <div>
        <h1 className="text-2xl font-semibold">Carnatic Songs</h1>
        <p className="mt-1 text-sm text-muted">
          Search by title or narrow results with the metadata filters.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <aside className="w-full shrink-0 lg:w-44 xl:w-48">
          <Suspense fallback={null}>
            <SongFilters options={filterOptions} />
          </Suspense>
        </aside>

        <div className="min-w-0 flex-1 space-y-6">
          <Suspense fallback={null}>
            <SearchInput placeholder="Search songs…" />
          </Suspense>

          {filtered.length === 0 ? (
            <p className="text-sm text-muted">
              {songs.length === 0
                ? "No songs imported yet."
                : filtersActive || filterParams.q
                  ? "No songs match your search or filters."
                  : "No songs match your search."}
            </p>
          ) : (
            <ul className="divide-y divide-border-light rounded-xl border border-border bg-card shadow-md">
              {filtered.map((song) => {
                const ragams = parseJsonArray(song.ragams);
                return (
                  <li key={song.id}>
                    <Link
                      href={`/songs/${song.slug}`}
                      className="block px-4 py-4 transition hover:bg-card-hover"
                    >
                      <p className="font-semibold text-accent">{song.title}</p>
                      <p className="mt-1 text-sm font-medium text-foreground-strong">
                        {[
                          song.composer,
                          ragams.length > 0 ? ragams.join(", ") : null,
                          song.taalam,
                        ]
                          .filter(Boolean)
                          .join(" · ") || "—"}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
