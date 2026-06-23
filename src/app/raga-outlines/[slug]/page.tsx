import { notFound } from "next/navigation";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function RagaOutlineDetailPage({ params }: Props) {
  const { slug } = await params;

  const outline = await prisma.ragaOutline.findUnique({
    where: { slug },
    include: {
      media: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!outline) notFound();

  const tracks = outline.media.map((m) => ({
    id: m.id,
    label: m.label ?? m.filename,
    publicUrl: m.publicUrl,
  }));

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Raga Outlines", href: "/raga-outlines" },
          { label: outline.ragam },
        ]}
      />

      <div className="space-y-8">
        {outline.description && (
          <p className="text-muted">{outline.description}</p>
        )}
        <AudioPlayer tracks={tracks} />
      </div>
    </div>
  );
}
