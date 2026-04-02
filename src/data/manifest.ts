import type { BlogManifest } from "../types";
import { listMdxFiles, parseMdxFile } from "./parse";

export function generateManifest(contentDir: string): BlogManifest {
  const files = listMdxFiles(contentDir);
  const posts = files.map((file) => parseMdxFile(contentDir, file));

  return {
    generatedAt: new Date().toISOString(),
    postCount: posts.length,
    posts,
  };
}
