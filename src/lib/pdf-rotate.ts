import fs from "fs/promises";
import { PDFDocument, degrees, type Rotation } from "pdf-lib";

export type PdfTransformOptions = {
  /** If true, rotate landscape pages (width > height) to portrait. */
  rotateToPortrait?: boolean;
  /** Explicit rotation in degrees (90, -90, 180, etc.). Applied after auto-detection. */
  rotation?: number;
};

function isLandscape(width: number, height: number): boolean {
  return width > height;
}

function portraitRotationDegrees(width: number, height: number): number {
  // Counter-clockwise 90° for typical sideways landscape scans.
  return isLandscape(width, height) ? 90 : 0;
}

function combineRotation(existing: Rotation, addedDegrees: number): Rotation {
  const existingAngle = existing.angle;
  const total = (((existingAngle + addedDegrees) % 360) + 360) % 360;
  return degrees(total);
}

/**
 * Copy a PDF to dest, optionally rotating pages for portrait display.
 */
export async function writePdfWithRotation(
  src: string,
  dest: string,
  options: PdfTransformOptions,
): Promise<boolean> {
  const { rotateToPortrait = false, rotation } = options;

  if (!rotateToPortrait && rotation === undefined) {
    await fs.copyFile(src, dest);
    return false;
  }

  const input = await fs.readFile(src);
  const pdf = await PDFDocument.load(input);
  let changed = false;

  for (const page of pdf.getPages()) {
    const { width, height } = page.getSize();
    const current = page.getRotation();
    let added = 0;

    if (rotateToPortrait) {
      added += portraitRotationDegrees(width, height);
    }
    if (rotation !== undefined) {
      added += rotation;
    }

    if (added !== 0) {
      page.setRotation(combineRotation(current, added));
      changed = true;
    }
  }

  if (!changed) {
    await fs.copyFile(src, dest);
    return false;
  }

  const output = await pdf.save();
  await fs.writeFile(dest, output);
  return true;
}
