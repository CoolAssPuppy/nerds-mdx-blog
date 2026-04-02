import fs from "fs";
import path from "path";
import { generateManifest } from "../data/manifest.js";

export function runGenerateManifest(contentDir?: string): void {
  const resolvedDir = contentDir
    ? path.resolve(contentDir)
    : path.join(process.cwd(), "content/blog");

  const manifest = generateManifest(resolvedDir);
  const outputPath = path.join(resolvedDir, "..", "blog-manifest.json");

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2) + "\n");

  console.log(
    `Generated ${outputPath} (${manifest.postCount} posts)`
  );
}
