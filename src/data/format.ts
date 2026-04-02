import { DEFAULT_TAG_ACRONYMS } from "../constants.js";

export function formatTagName(
  tag: string,
  acronyms: readonly string[] = DEFAULT_TAG_ACRONYMS
): string {
  const acronymSet = new Set(acronyms.map((a) => a.toLowerCase()));

  return tag
    .split("-")
    .map((word) => {
      if (acronymSet.has(word.toLowerCase())) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
