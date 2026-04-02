import path from "path";
import fs from "fs";
import matter from "gray-matter";
import type { BlogPost, ManifestEntry } from "../types.js";
import { calculateReadingTime } from "./reading-time.js";

export function getSlugFromFilename(filename: string): string {
  return filename.replace(".mdx", "").replace(/^\d{8}-/, "");
}

type FrontmatterData = {
  readonly title: string;
  readonly excerpt: string;
  readonly description: string | undefined;
  readonly publishedAt: string;
  readonly updatedAt: string | undefined;
  readonly featureImage: string | undefined;
  readonly featured: boolean;
  readonly tags: string[];
};

function extractFrontmatter(data: Record<string, unknown>): FrontmatterData {
  return {
    title: (data.title as string) || "Untitled",
    excerpt: (data.excerpt as string) || "",
    description: data.description as string | undefined,
    publishedAt: (data.publishedAt as string) || new Date().toISOString(),
    updatedAt: data.updatedAt as string | undefined,
    featureImage: data.featureImage as string | undefined,
    featured: (data.featured as boolean) || false,
    tags: (data.tags as string[]) || [],
  };
}

export function parseMdxFile(
  contentDir: string,
  file: string
): ManifestEntry {
  const filePath = path.join(contentDir, file);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const fm = extractFrontmatter(data);

  return {
    file,
    slug: getSlugFromFilename(file),
    ...fm,
    readingTime: calculateReadingTime(content),
  };
}

export function parseMdxFileWithContent(
  contentDir: string,
  filename: string,
  slug: string
): BlogPost | null {
  const filePath = path.join(contentDir, filename);

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const fm = extractFrontmatter(data);

    return {
      slug,
      ...fm,
      content,
      faqs: data.faqs,
      articleType: data.articleType,
      howToSteps: data.howToSteps,
      readingTime: calculateReadingTime(content),
    };
  } catch {
    return null;
  }
}

export function listMdxFiles(contentDir: string): string[] {
  try {
    return fs
      .readdirSync(contentDir)
      .filter((file) => file.endsWith(".mdx"))
      .sort();
  } catch {
    return [];
  }
}
