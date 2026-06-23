import fs from "fs/promises";
import path from "path";
import { prisma } from "../src/lib/prisma";

const OUTPUT = path.join(process.cwd(), "src", "data", "site-data.json");

export async function exportSiteData() {
  const [songs, ragaOutlines] = await Promise.all([
    prisma.song.findMany({
      orderBy: { title: "asc" },
      include: {
        media: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.ragaOutline.findMany({
      orderBy: { ragam: "asc" },
      include: {
        media: { orderBy: { sortOrder: "asc" } },
      },
    }),
  ]);

  const data = {
    songs: songs.map((song) => ({
      id: song.id,
      slug: song.slug,
      title: song.title,
      composer: song.composer,
      ragams: song.ragams,
      taalam: song.taalam,
      songType: song.songType,
      language: song.language,
      deity: song.deity,
      similarLinks: song.similarLinks,
      media: song.media.map((item) => ({
        id: item.id,
        type: item.type,
        kind: item.kind,
        filename: item.filename,
        label: item.label,
        publicUrl: item.publicUrl,
        sortOrder: item.sortOrder,
      })),
    })),
    ragaOutlines: ragaOutlines.map((outline) => ({
      id: outline.id,
      slug: outline.slug,
      title: outline.title,
      ragam: outline.ragam,
      description: outline.description,
      media: outline.media.map((item) => ({
        id: item.id,
        type: item.type,
        kind: item.kind,
        filename: item.filename,
        label: item.label,
        publicUrl: item.publicUrl,
        sortOrder: item.sortOrder,
      })),
    })),
  };

  await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
  await fs.writeFile(OUTPUT, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(
    `Exported site data: ${data.songs.length} songs, ${data.ragaOutlines.length} raga outlines.`,
  );
}
