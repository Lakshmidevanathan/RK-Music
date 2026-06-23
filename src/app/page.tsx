import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [songCount, outlineCount] = await Promise.all([
    prisma.song.count(),
    prisma.ragaOutline.count(),
  ]);

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Music class <span className="text-accent">resources</span>
        </h1>
        <p className="max-w-xl text-muted leading-relaxed">
          Browse Carnatic songs with practice recordings and notation, or listen
          to raga outlines for swara singing practice.
        </p>
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/songs"
          className="group rounded-xl border border-border bg-card p-6 shadow-md transition hover:border-accent hover:bg-card-hover hover:shadow-lg"
        >
          <h2 className="text-xl font-semibold group-hover:text-accent transition-colors">
            Carnatic Songs
          </h2>
          <p className="mt-2 text-sm text-muted">
            Recordings, notation, and song details — composer, raagam, taalam, and
            more.
          </p>
          <p className="mt-4 text-sm font-medium text-accent">
            {songCount} {songCount === 1 ? "song" : "songs"} →
          </p>
        </Link>

        <Link
          href="/raga-outlines"
          className="group rounded-xl border border-border bg-card p-6 shadow-md transition hover:border-accent hover:bg-card-hover hover:shadow-lg"
        >
          <h2 className="text-xl font-semibold group-hover:text-accent transition-colors">
            Raga Outlines
          </h2>
          <p className="mt-2 text-sm text-muted">
            Audio outlines for swara singing practice in each raga.
          </p>
          <p className="mt-4 text-sm font-medium text-accent">
            {outlineCount} {outlineCount === 1 ? "outline" : "outlines"} →
          </p>
        </Link>
      </div>

      {songCount === 0 && outlineCount === 0 && (
        <p className="rounded-lg border border-border bg-card p-4 text-sm text-muted">
          No content imported yet. Run{" "}
          <code className="rounded bg-background px-1.5 py-0.5">npm run import</code>{" "}
          after placing files in <code className="rounded bg-background px-1.5 py-0.5">Songs/</code> and{" "}
          <code className="rounded bg-background px-1.5 py-0.5">Raga Outlines/</code>.
        </p>
      )}
    </div>
  );
}
