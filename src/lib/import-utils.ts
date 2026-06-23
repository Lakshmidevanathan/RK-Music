import path from "path";

const AUDIO_EXT = new Set([".mp3", ".m4a", ".wav", ".ogg", ".flac"]);
const PDF_EXT = new Set([".pdf"]);

export function isAudioFile(filename: string): boolean {
  return AUDIO_EXT.has(path.extname(filename).toLowerCase());
}

export function isPdfFile(filename: string): boolean {
  return PDF_EXT.has(path.extname(filename).toLowerCase());
}

export function mimeForFile(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const map: Record<string, string> = {
    ".mp3": "audio/mpeg",
    ".m4a": "audio/mp4",
    ".wav": "audio/wav",
    ".ogg": "audio/ogg",
    ".flac": "audio/flac",
    ".pdf": "application/pdf",
  };
  return map[ext] ?? "application/octet-stream";
}

/** Try to pull ragam and taalam from filenames like ...-Keeravani-Adi.pdf */
export function inferRagamTaalamFromFilename(filename: string): {
  ragam?: string;
  taalam?: string;
} {
  const base = path.basename(filename, path.extname(filename));
  const parts = base.split("-").filter(Boolean);
  if (parts.length < 2) return {};

  const taalamCandidates = new Set([
    "adi",
    "rupaka",
    "misra",
    "khanda",
    "tisra",
    "chapu",
    "ata",
  ]);
  const last = parts[parts.length - 1]?.toLowerCase();
  const secondLast = parts[parts.length - 2];

  if (last && taalamCandidates.has(last) && secondLast) {
    return {
      ragam: titleCase(secondLast),
      taalam: titleCase(last),
    };
  }
  return {};
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function parseRagaOutlineFilename(filename: string): {
  ragam: string;
  title: string;
} | null {
  const base = path.basename(filename, path.extname(filename));
  const match = base.match(/^(.+?)\s+Outline$/i);
  if (!match) return null;
  const ragam = match[1].trim();
  return { ragam, title: `${ragam} Outline` };
}

export function documentKind(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.includes("lyric") || lower.includes("sahityam")) return "lyrics";
  if (lower.includes("notn") || lower.includes("notation")) return "notation";
  return "other";
}
