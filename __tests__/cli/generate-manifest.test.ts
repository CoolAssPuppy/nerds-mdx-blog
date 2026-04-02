import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import { runGenerateManifest } from "@/cli/generate-manifest";

let tmpDir: string;

function createMdxFile(filename: string, frontmatter: Record<string, unknown>, body = "Some body content."): void {
  const fmLines = Object.entries(frontmatter)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:\n${value.map((v) => `  - ${v}`).join("\n")}`;
      }
      return `${key}: "${value}"`;
    })
    .join("\n");

  const content = `---\n${fmLines}\n---\n\n${body}`;
  const dir = path.join(tmpDir, "content", "blog");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), content);
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "nerds-manifest-"));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("runGenerateManifest", () => {
  it("should generate manifest JSON at the correct output path", () => {
    createMdxFile("20240101-hello-world.mdx", {
      title: "Hello World",
      publishedAt: "2024-01-01T08:00:00.000Z",
      excerpt: "A test post",
      tags: ["test"],
    });

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    runGenerateManifest(path.join(tmpDir, "content", "blog"));
    consoleSpy.mockRestore();

    const manifestPath = path.join(tmpDir, "content", "blog-manifest.json");
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    expect(manifest.postCount).toBe(1);
    expect(manifest.posts).toHaveLength(1);
    expect(manifest.posts[0].slug).toBe("hello-world");
    expect(manifest.posts[0].title).toBe("Hello World");
    expect(manifest.generatedAt).toBeDefined();
  });

  it("should include multiple posts in the manifest", () => {
    createMdxFile("20240101-first-post.mdx", {
      title: "First Post",
      publishedAt: "2024-01-01T08:00:00.000Z",
      excerpt: "First",
      tags: ["a"],
    });
    createMdxFile("20240202-second-post.mdx", {
      title: "Second Post",
      publishedAt: "2024-02-02T08:00:00.000Z",
      excerpt: "Second",
      tags: ["b"],
    });

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    runGenerateManifest(path.join(tmpDir, "content", "blog"));
    consoleSpy.mockRestore();

    const manifestPath = path.join(tmpDir, "content", "blog-manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    expect(manifest.postCount).toBe(2);
    expect(manifest.posts.map((p: { slug: string }) => p.slug)).toEqual([
      "first-post",
      "second-post",
    ]);
  });

  it("should handle an empty content directory gracefully", () => {
    const emptyDir = path.join(tmpDir, "content", "blog");
    fs.mkdirSync(emptyDir, { recursive: true });

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    runGenerateManifest(emptyDir);
    consoleSpy.mockRestore();

    const manifestPath = path.join(tmpDir, "content", "blog-manifest.json");
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    expect(manifest.postCount).toBe(0);
    expect(manifest.posts).toEqual([]);
  });

  it("should handle a missing content directory gracefully", () => {
    const missingDir = path.join(tmpDir, "does-not-exist", "blog");

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    runGenerateManifest(missingDir);
    consoleSpy.mockRestore();

    const manifestPath = path.join(tmpDir, "does-not-exist", "blog-manifest.json");
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    expect(manifest.postCount).toBe(0);
    expect(manifest.posts).toEqual([]);
  });

  it("should preserve frontmatter fields in manifest entries", () => {
    createMdxFile(
      "20240315-detailed-post.mdx",
      {
        title: "Detailed Post",
        publishedAt: "2024-03-15T08:00:00.000Z",
        excerpt: "A detailed excerpt",
        featured: "true",
        featureImage: "/images/blog/test.jpg",
        tags: ["marketing", "ai"],
      },
      "This is longer body content with enough words to matter for reading time."
    );

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    runGenerateManifest(path.join(tmpDir, "content", "blog"));
    consoleSpy.mockRestore();

    const manifestPath = path.join(tmpDir, "content", "blog-manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    const post = manifest.posts[0];

    expect(post.title).toBe("Detailed Post");
    expect(post.excerpt).toBe("A detailed excerpt");
    expect(post.tags).toEqual(["marketing", "ai"]);
    expect(post.readingTime).toBeDefined();
    expect(post.file).toBe("20240315-detailed-post.mdx");
  });
});
