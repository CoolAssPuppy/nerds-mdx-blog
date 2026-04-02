import fs from "fs";
import path from "path";
import type {
  BlogPost,
  BlogPostMeta,
  ResolvedBlogConfig,
  ManifestEntry,
  BlogManifest,
} from "../types";
import { listMdxFiles, parseMdxFile, parseMdxFileWithContent } from "./parse";

function isPostPublished(
  publishedAt: string,
  scheduledPublishing: boolean
): boolean {
  if (!scheduledPublishing) return true;
  if (process.env.NODE_ENV === "development") return true;

  return new Date(publishedAt).getTime() <= Date.now();
}

function resolveContentDir(contentDir: string): string {
  if (path.isAbsolute(contentDir)) return contentDir;
  return path.join(process.cwd(), contentDir);
}

function loadManifest(contentDir: string): BlogManifest | null {
  const manifestPath = path.join(contentDir, "..", "blog-manifest.json");
  try {
    const raw = fs.readFileSync(manifestPath, "utf-8");
    return JSON.parse(raw) as BlogManifest;
  } catch {
    return null;
  }
}

function getEntries(contentDir: string): ManifestEntry[] {
  if (process.env.NODE_ENV === "production") {
    const manifest = loadManifest(contentDir);
    if (manifest) return manifest.posts as ManifestEntry[];
  }
  return listMdxFiles(contentDir).map((file) =>
    parseMdxFile(contentDir, file)
  );
}

function entryToMeta(entry: ManifestEntry): BlogPostMeta {
  return {
    slug: entry.slug,
    title: entry.title,
    excerpt: entry.excerpt,
    description: entry.description,
    publishedAt: entry.publishedAt,
    updatedAt: entry.updatedAt,
    featureImage: entry.featureImage,
    featured: entry.featured || false,
    tags: entry.tags || [],
    readingTime: entry.readingTime,
  };
}

function sortByDateDesc<T extends { publishedAt: string }>(posts: T[]): T[] {
  const withTimestamps = posts.map((p) => ({
    post: p,
    ts: new Date(p.publishedAt).getTime(),
  }));
  withTimestamps.sort((a, b) => b.ts - a.ts);
  return withTimestamps.map(({ post }) => post);
}

export function createBlogDataLayer(config: ResolvedBlogConfig) {
  const contentDir = resolveContentDir(config.blog.contentDir);
  const { scheduledPublishing } = config.features;

  const isPublished = (entry: ManifestEntry) =>
    isPostPublished(entry.publishedAt, scheduledPublishing);

  const buildFilenameMap = (): Map<string, string> =>
    new Map(getEntries(contentDir).map((e) => [e.slug, e.file]));

  const getAllPosts = (): BlogPostMeta[] =>
    sortByDateDesc(getEntries(contentDir).filter(isPublished).map(entryToMeta));

  const getAllPostsWithContent = (): BlogPost[] => {
    const posts = getEntries(contentDir)
      .filter(isPublished)
      .map((entry) =>
        parseMdxFileWithContent(contentDir, entry.file, entry.slug)
      )
      .filter((post): post is BlogPost => post !== null);

    return sortByDateDesc(posts);
  };

  const getPostBySlug = (slug: string): BlogPost | null => {
    const filename = buildFilenameMap().get(slug);
    if (!filename) return null;
    return parseMdxFileWithContent(contentDir, filename, slug);
  };

  const getFeaturedPosts = (): BlogPostMeta[] =>
    getAllPosts().filter((post) => post.featured);

  const getRelatedPosts = (
    currentSlug: string,
    count = 3
  ): BlogPostMeta[] => {
    const allPosts = getAllPosts();
    const currentPost = allPosts.find((p) => p.slug === currentSlug);
    const others = allPosts.filter((p) => p.slug !== currentSlug);

    if (!currentPost?.tags?.length) return others.slice(0, count);

    const currentTags = new Set(
      currentPost.tags.map((t) => t.toLowerCase())
    );

    const scored = others
      .map((post) => {
        const sharedCount = (post.tags ?? []).filter((t) =>
          currentTags.has(t.toLowerCase())
        ).length;
        return { post, score: sharedCount };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score);

    if (scored.length >= count) {
      return scored.slice(0, count).map(({ post }) => post);
    }

    const matched = scored.map(({ post }) => post);
    const matchedSlugs = new Set(matched.map((m) => m.slug));
    const remaining = others
      .filter((p) => !matchedSlugs.has(p.slug))
      .slice(0, count - matched.length);

    return [...matched, ...remaining];
  };

  const getAllTags = (): string[] => {
    const tagSet = new Set<string>();
    for (const post of getAllPosts()) {
      for (const tag of post.tags ?? []) {
        tagSet.add(tag);
      }
    }
    return Array.from(tagSet).sort();
  };

  const getPostsByTag = (tag: string): BlogPostMeta[] => {
    const lowerTag = tag.toLowerCase();
    return getAllPosts().filter((post) =>
      post.tags?.some((t) => t.toLowerCase() === lowerTag)
    );
  };

  const getTagCounts = (): Record<string, number> => {
    const counts: Record<string, number> = {};
    for (const post of getAllPosts()) {
      for (const tag of post.tags ?? []) {
        counts[tag] = (counts[tag] || 0) + 1;
      }
    }
    return counts;
  };

  return {
    getAllPosts,
    getAllPostsWithContent,
    getPostBySlug,
    getRelatedPosts,
    getFeaturedPosts,
    getAllTags,
    getPostsByTag,
    getTagCounts,
    config,
  };
}
