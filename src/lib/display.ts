/** Strip common media/document extensions for on-screen labels. */
export function displayFileLabel(name: string): string {
  return name.replace(/\.(mp3|m4a|wav|ogg|flac|pdf|docx?)$/i, "");
}
