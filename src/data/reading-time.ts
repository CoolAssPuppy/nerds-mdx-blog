import readingTimeLib from "reading-time";

export function stripCodeBlocksAndComponents(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/<[A-Z][^>]*\/>/g, "")
    .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

export function calculateReadingTime(content: string): string {
  const stripped = stripCodeBlocksAndComponents(content);
  const result = readingTimeLib(stripped);
  const minutes = Math.max(1, Math.round(result.minutes));
  return String(minutes);
}
