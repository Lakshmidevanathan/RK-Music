"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SearchInput } from "@/components/SearchInput";
import { SongFilters } from "@/components/SongFilters";
import { parseJsonArray } from "@/lib/json";
import type { SongData } from "@/lib/data";
import {
  buildFilterOptions,
  filterSongs,
  hasActiveFilters,
  type FilterOptions,
  type SongFilterParams,
} from "@/lib/song-filters";

function SongsList({
  songs,
  filterOptions,
}: {
  songs: SongData[];
  filterOptions: FilterOptions;
}) {
  const searchParams = useSearchParams();
  const filterParams: SongFilterParams = {
    q: searchParams.get("q") ?? undefined,
    composer: searchParams.get("composer") ?? undefined,
    ragam: searchParams.get("ragam") ?? undefined,
    taalam: searchParams.get("taalam") ?? undefined,
    songType: searchParams.get("songType") ?? undefined,
    language: searchParams.get("language") ?? undefined,
    deity: searchParams.get("deity") ?? undefined,
  };

  const listSongs = songs.map((song) => ({
    id: song.id,
    slug: song.slug,
    title: song.title,
    composer: song.composer,
    ragams: song.ragams,
    taalam: song.taalam,
    songType: song.songType,
    language: song.language,
    deity: song.deity,
  }));

  const filtered = filterSongs(listSongs, filterParams);
  const filtersActive = hasActiveFilters(filterParams);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
      <aside className="w-full shrink-0 lg:w-44 xl:w-48">
        <SongFilters options={filterOptions} />
      </aside>

      <div className="min-w-0 flex-1 space-y-6">
        <SearchInput placeholder="Search songs…" />

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
  );
}

export function SongsPageContent({ songs }: { songs: SongData[] }) {
  const filterOptions = buildFilterOptions(
    songs.map((song) => ({
      id: song.id,
      slug: song.slug,
      title: song.title,
      composer: song.composer,
      ragams: song.ragams,
      taalam: song.taalam,
      songType: song.songType,
      language: song.language,
      deity: song.deity,
    })),
  );

  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
      <SongsList songs={songs} filterOptions={filterOptions} />
    </Suspense>
  );
}
