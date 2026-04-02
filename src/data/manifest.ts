import type { BlogManifest } from "../types.js";
import { listMdxFiles, parseMdxFile } from "./parse.js";

export function generateManifest(contentDir: string): BlogManifest {
  const files = listMdxFiles(contentDir);
  const posts = files.map((file) => parseMdxFile(contentDir, file));

  return {
    generatedAt: new Date().toISOString(),
    postCount: posts.length,
    posts,
  };
}
