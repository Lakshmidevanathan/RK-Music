import siteData from "@/data/site-data.json";

export type MediaItem = {
  id: string;
  type: string;
  kind: string;
  filename: string;
  label: string | null;
  publicUrl: string;
  sortOrder: number;
};

export type SongData = {
  id: string;
  slug: string;
  title: string;
  composer: string | null;
  ragams: string;
  taalam: string | null;
  songType: string | null;
  language: string | null;
  deity: string | null;
  similarLinks: string;
  media: MediaItem[];
};

export type RagaOutlineData = {
  id: string;
  slug: string;
  title: string;
  ragam: string;
  description: string | null;
  media: MediaItem[];
};

export function getSongs(): SongData[] {
  return siteData.songs;
}

export function getSongBySlug(slug: string): SongData | undefined {
  return siteData.songs.find((song) => song.slug === slug);
}

export function getRagaOutlines(): RagaOutlineData[] {
  return siteData.ragaOutlines;
}

export function getRagaOutlineBySlug(slug: string): RagaOutlineData | undefined {
  return siteData.ragaOutlines.find((outline) => outline.slug === slug);
}
