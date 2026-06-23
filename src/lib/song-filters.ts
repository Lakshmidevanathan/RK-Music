import { parseJsonArray } from "@/lib/json";

export type SongListItem = {
  id: string;
  slug: string;
  title: string;
  composer: string | null;
  ragams: string;
  taalam: string | null;
  songType: string | null;
  language: string | null;
  deity: string | null;
};

export type SongFilterParams = {
  q?: string;
  composer?: string;
  ragam?: string;
  taalam?: string;
  songType?: string;
  language?: string;
  deity?: string;
};

export type FilterOptions = {
  composer: string[];
  ragam: string[];
  taalam: string[];
  songType: string[];
  language: string[];
  deity: string[];
};

function uniqueSorted(values: (string | null | undefined)[]): string[] {
  return [...new Set(values.filter((v): v is string => Boolean(v?.trim())))].sort(
    (a, b) => a.localeCompare(b),
  );
}

export function buildFilterOptions(songs: SongListItem[]): FilterOptions {
  const ragams = songs.flatMap((song) => parseJsonArray(song.ragams));
  return {
    composer: uniqueSorted(songs.map((song) => song.composer)),
    ragam: uniqueSorted(ragams),
    taalam: uniqueSorted(songs.map((song) => song.taalam)),
    songType: uniqueSorted(songs.map((song) => song.songType)),
    language: uniqueSorted(songs.map((song) => song.language)),
    deity: uniqueSorted(songs.map((song) => song.deity)),
  };
}

export function filterSongs(
  songs: SongListItem[],
  params: SongFilterParams,
): SongListItem[] {
  const query = params.q?.trim().toLowerCase() ?? "";

  return songs.filter((song) => {
    if (query) {
      const ragams = parseJsonArray(song.ragams).join(" ");
      const haystack = [
        song.title,
        song.composer,
        song.taalam,
        song.songType,
        song.language,
        song.deity,
        ragams,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    if (params.composer && song.composer !== params.composer) return false;
    if (params.taalam && song.taalam !== params.taalam) return false;
    if (params.songType && song.songType !== params.songType) return false;
    if (params.language && song.language !== params.language) return false;
    if (params.deity && song.deity !== params.deity) return false;
    if (params.ragam) {
      const ragams = parseJsonArray(song.ragams);
      if (!ragams.includes(params.ragam)) return false;
    }

    return true;
  });
}

export function hasActiveFilters(params: SongFilterParams): boolean {
  return Boolean(
    params.composer ||
      params.ragam ||
      params.taalam ||
      params.songType ||
      params.language ||
      params.deity,
  );
}
