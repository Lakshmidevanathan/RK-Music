export function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export type SimilarLink = { label?: string; url: string; songSlug?: string };

export function parseSimilarLinks(value: string): SimilarLink[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is SimilarLink =>
        typeof item === "object" &&
        item !== null &&
        "url" in item &&
        typeof (item as SimilarLink).url === "string",
    );
  } catch {
    return [];
  }
}
