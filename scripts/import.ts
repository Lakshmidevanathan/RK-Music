import fs from "fs/promises";
import path from "path";
import { parse as parseYaml } from "yaml";
import { slugify } from "../src/lib/slug";
import { prisma } from "../src/lib/prisma";
import {
  documentKind,
  inferRagamTaalamFromFilename,
  isAudioFile,
  isPdfFile,
  mimeForFile,
  parseRagaOutlineFilename,
} from "../src/lib/import-utils";
import { writePdfWithRotation } from "../src/lib/pdf-rotate";

const ROOT = process.cwd();
const SONGS_DIR = path.join(ROOT, "Songs");
const RAGA_DIR = path.join(ROOT, "Raga Outlines");
const MEDIA_DIR = path.join(ROOT, "public", "media");

type DocumentMetadata = {
  file: string;
  kind?: string;
  label?: string;
  /** Rotate landscape pages to portrait when copying to public/media. */
  rotateToPortrait?: boolean;
  /** Extra rotation in degrees (e.g. 90, -90). */
  rotation?: number;
};

type SongMetadata = {
  title?: string;
  composer?: string;
  ragams?: string[];
  taalam?: string;
  songType?: string;
  language?: string;
  deity?: string;
  similarSongLinks?: { label?: string; url: string; songSlug?: string }[];
  recordings?: { file: string; label?: string }[];
  documents?: DocumentMetadata[];
  /** Apply rotateToPortrait to every PDF in this song unless overridden per file. */
  rotatePdfsToPortrait?: boolean;
};

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function copyToMedia(
  src: string,
  destRelative: string,
): Promise<string> {
  const dest = path.join(MEDIA_DIR, destRelative);
  await ensureDir(path.dirname(dest));
  await fs.copyFile(src, dest);
  return `/media/${destRelative.replace(/\\/g, "/")}`;
}

async function copyPdfToMedia(
  src: string,
  destRelative: string,
  transform: { rotateToPortrait?: boolean; rotation?: number },
): Promise<{ publicUrl: string; rotated: boolean }> {
  const dest = path.join(MEDIA_DIR, destRelative);
  await ensureDir(path.dirname(dest));
  const rotated = await writePdfWithRotation(src, dest, transform);
  return {
    publicUrl: `/media/${destRelative.replace(/\\/g, "/")}`,
    rotated,
  };
}

function optionalText(value: string | undefined | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

async function readMetadataYaml(dir: string): Promise<SongMetadata | null> {
  const yamlPath = path.join(dir, "metadata.yaml");
  try {
    const raw = await fs.readFile(yamlPath, "utf8");
    return parseYaml(raw) as SongMetadata;
  } catch {
    return null;
  }
}

async function importSongs() {
  let entries: string[];
  try {
    entries = await fs.readdir(SONGS_DIR);
  } catch {
    console.warn(`Songs folder not found: ${SONGS_DIR}`);
    return;
  }

  for (const folderName of entries) {
    const songDir = path.join(SONGS_DIR, folderName);
    const stat = await fs.stat(songDir);
    if (!stat.isDirectory()) continue;

    const meta = await readMetadataYaml(songDir);
    const slug = slugify(meta?.title ?? folderName);
    const title = meta?.title ?? folderName;

    const files = (await fs.readdir(songDir)).sort();
    const audioFiles = files.filter(isAudioFile);
    const pdfFiles = files.filter(isPdfFile);

    let ragams = meta?.ragams ?? [];
    let taalam = meta?.taalam;

    if (ragams.length === 0 || !taalam) {
      for (const f of [...audioFiles, ...pdfFiles]) {
        const inferred = inferRagamTaalamFromFilename(f);
        if (inferred.ragam && ragams.length === 0) ragams = [inferred.ragam];
        if (inferred.taalam && !taalam) taalam = inferred.taalam;
      }
    }

    const song = await prisma.song.upsert({
      where: { slug },
      create: {
        slug,
        title,
        composer: optionalText(meta?.composer),
        ragams: JSON.stringify(ragams),
        taalam: optionalText(taalam),
        songType: optionalText(meta?.songType),
        language: optionalText(meta?.language),
        deity: optionalText(meta?.deity),
        similarLinks: JSON.stringify(meta?.similarSongLinks ?? []),
      },
      update: {
        title,
        composer: optionalText(meta?.composer),
        ragams: JSON.stringify(ragams),
        taalam: optionalText(taalam),
        songType: optionalText(meta?.songType),
        language: optionalText(meta?.language),
        deity: optionalText(meta?.deity),
        similarLinks: JSON.stringify(meta?.similarSongLinks ?? []),
      },
    });

    await prisma.mediaAsset.deleteMany({ where: { songId: song.id } });

    const recordingMeta = new Map(
      (meta?.recordings ?? []).map((r) => [r.file, r.label]),
    );
    const documentMeta = new Map(
      (meta?.documents ?? []).map((d) => [d.file, d]),
    );

    let order = 0;
    for (const filename of audioFiles) {
      const src = path.join(songDir, filename);
      const destRel = path.join("songs", slug, filename);
      const publicUrl = await copyToMedia(src, destRel);
      await prisma.mediaAsset.create({
        data: {
          type: "audio",
          kind: "recording",
          filename,
          label: recordingMeta.get(filename) ?? filename,
          mimeType: mimeForFile(filename),
          storageKey: destRel.replace(/\\/g, "/"),
          publicUrl,
          sortOrder: order++,
          songId: song.id,
        },
      });
    }

    order = 0;
    for (const filename of pdfFiles) {
      const src = path.join(songDir, filename);
      const destRel = path.join("songs", slug, filename);
      const docMeta = documentMeta.get(filename);
      const rotateToPortrait =
        docMeta?.rotateToPortrait ?? meta?.rotatePdfsToPortrait ?? false;
      const { publicUrl, rotated } = await copyPdfToMedia(src, destRel, {
        rotateToPortrait,
        rotation: docMeta?.rotation,
      });
      if (rotated) {
        console.log(`    Rotated PDF to portrait: ${filename}`);
      }
      await prisma.mediaAsset.create({
        data: {
          type: "pdf",
          kind: docMeta?.kind ?? documentKind(filename),
          filename,
          label: docMeta?.label ?? filename,
          mimeType: mimeForFile(filename),
          storageKey: destRel.replace(/\\/g, "/"),
          publicUrl,
          sortOrder: order++,
          songId: song.id,
        },
      });
    }

    console.log(`  Song: ${title} (${audioFiles.length} audio, ${pdfFiles.length} pdf)`);
  }
}

async function importRagaOutlines() {
  let entries: string[];
  try {
    entries = await fs.readdir(RAGA_DIR);
  } catch {
    console.warn(`Raga Outlines folder not found: ${RAGA_DIR}`);
    return;
  }

  for (const filename of entries.sort()) {
    if (!isAudioFile(filename)) continue;

    const parsed = parseRagaOutlineFilename(filename);
    if (!parsed) {
      console.warn(`  Skipping unrecognized outline file: ${filename}`);
      continue;
    }

    const slug = slugify(parsed.ragam);
    const src = path.join(RAGA_DIR, filename);
    const destRel = path.join("raga-outlines", slug, filename);
    const publicUrl = await copyToMedia(src, destRel);

    const outline = await prisma.ragaOutline.upsert({
      where: { slug },
      create: {
        slug,
        title: parsed.title,
        ragam: parsed.ragam,
      },
      update: {
        title: parsed.title,
        ragam: parsed.ragam,
      },
    });

    await prisma.mediaAsset.deleteMany({
      where: { ragaOutlineId: outline.id },
    });

    await prisma.mediaAsset.create({
      data: {
        type: "audio",
        kind: "outline",
        filename,
        label: parsed.title,
        mimeType: mimeForFile(filename),
        storageKey: destRel.replace(/\\/g, "/"),
        publicUrl,
        sortOrder: 0,
        ragaOutlineId: outline.id,
      },
    });

    console.log(`  Raga Outline: ${parsed.ragam}`);
  }
}

async function main() {
  console.log("RKMusic import\n");
  await ensureDir(MEDIA_DIR);

  console.log("Importing Songs...");
  await importSongs();

  console.log("\nImporting Raga Outlines...");
  await importRagaOutlines();

  const songCount = await prisma.song.count();
  const outlineCount = await prisma.ragaOutline.count();
  console.log(`\nDone. ${songCount} songs, ${outlineCount} raga outlines.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
