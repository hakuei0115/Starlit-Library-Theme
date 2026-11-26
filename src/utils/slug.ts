/**
 * URL segment for a tag or category: "State Machine" -> "state-machine", "C#" -> "c-sharp".
 * Letters of any language are kept, so Chinese names stay readable.
 * Names that only differ in case, spacing or punctuation get the same slug.
 */
export function slugify(name: string): string {
  const slug = name
    .normalize('NFC')
    .trim()
    .toLowerCase()
    .replace(/#/g, '-sharp')
    .replace(/\+/g, '-plus')
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

  // A name made only of symbols still needs a unique, valid segment.
  return slug || Array.from(name, (c) => `u${c.codePointAt(0)!.toString(16)}`).join('-');
}
