/** Prefix public asset paths with Next.js basePath (GitHub Pages subpath deploy). */
export function assetUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!path || path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
