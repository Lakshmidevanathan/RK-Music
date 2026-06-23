import { notFound } from "next/navigation";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DocumentPanel } from "@/components/DocumentPanel";
import { MetadataField } from "@/components/MetadataList";
import { RelatedLinks } from "@/components/SimilarLinks";
import { SongMetadataPanel } from "@/components/SongMetadataPanel";
import { parseJsonArray } from "@/lib/json";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function SongDetailPage({ params }: Props) {
  const { slug } = await params;

  const song = await prisma.song.findUnique({
    where: { slug },
    include: {
      media: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!song) notFound();

  const recordings = song.media
    .filter((m) => m.type === "audio")
    .map((m) => ({
      id: m.id,
      label: m.label ?? m.filename,
      publicUrl: m.publicUrl,
    }));

  const documents = song.media
    .filter((m) => m.type === "pdf")
    .map((m) => ({
      id: m.id,
      label: m.label,
      publicUrl: m.publicUrl,
      kind: m.kind,
    }));

  const raagams = parseJsonArray(song.ragams);

  const summary = [song.composer, raagams.join(", "), song.taalam]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Carnatic Songs", href: "/songs" },
          { label: song.title },
        ]}
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <aside className="w-full shrink-0 lg:w-40 xl:w-44">
          <h1 className="sr-only">{song.title}</h1>
          <SongMetadataPanel summary={summary || song.title}>
            <MetadataField label="Title" value={song.title} />
            <MetadataField label="Composer" value={song.composer} />
            <MetadataField label="Raagam" value={raagams} />
            <MetadataField label="Taalam" value={song.taalam} />
            <MetadataField label="Song Type" value={song.songType} />
            <MetadataField label="Language" value={song.language} />
            <MetadataField label="Deity" value={song.deity} />
            <div className="col-span-2 lg:col-span-1">
              <RelatedLinks
                json={song.similarLinks}
                row
                collapsible
                pills
              />
            </div>
          </SongMetadataPanel>
        </aside>

        <div className="min-w-0 flex-1 space-y-8">
          <AudioPlayer tracks={recordings} />
          <DocumentPanel documents={documents} />
        </div>
      </div>
    </div>
  );
}
