import { describe, it, expect } from "vitest";
import path from "path";
import { generateManifest } from "@/data/manifest";

const FIXTURES_DIR = path.resolve(__dirname, "../fixtures");

describe("generateManifest", () => {
  it("should generate a manifest with correct structure", () => {
    const manifest = generateManifest(FIXTURES_DIR);

    expect(manifest).toHaveProperty("generatedAt");
    expect(manifest).toHaveProperty("postCount");
    expect(manifest).toHaveProperty("posts");
    expect(typeof manifest.generatedAt).toBe("string");
    expect(typeof manifest.postCount).toBe("number");
    expect(Array.isArray(manifest.posts)).toBe(true);
  });

  it("should include all MDX files", () => {
    const manifest = generateManifest(FIXTURES_DIR);

    expect(manifest.postCount).toBeGreaterThanOrEqual(4);
    expect(manifest.posts.length).toBe(manifest.postCount);
  });

  it("should extract slug from filename", () => {
    const manifest = generateManifest(FIXTURES_DIR);
    const slugs = manifest.posts.map((p) => p.slug);

    expect(slugs).toContain("sample-post");
    expect(slugs).toContain("post-with-faqs");
    expect(slugs).toContain("post-future-date");
    expect(slugs).toContain("post-with-code");
  });

  it("should include frontmatter fields in each entry", () => {
    const manifest = generateManifest(FIXTURES_DIR);
    const samplePost = manifest.posts.find((p) => p.slug === "sample-post");

    expect(samplePost).toBeDefined();
    expect(samplePost!.title).toBe("Getting started with your blog");
    expect(samplePost!.excerpt).toContain("quick guide");
    expect(samplePost!.featured).toBe(true);
    expect(samplePost!.tags).toContain("getting-started");
    expect(samplePost!.readingTime).toBeDefined();
  });

  it("should calculate reading time for each post", () => {
    const manifest = generateManifest(FIXTURES_DIR);

    for (const post of manifest.posts) {
      expect(Number(post.readingTime)).toBeGreaterThanOrEqual(1);
    }
  });

  it("should return empty manifest for non-existent directory", () => {
    const manifest = generateManifest("/nonexistent/path");

    expect(manifest.postCount).toBe(0);
    expect(manifest.posts).toEqual([]);
  });
});
