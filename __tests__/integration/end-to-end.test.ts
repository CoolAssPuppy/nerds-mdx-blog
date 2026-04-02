import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import { createBlog } from "@/config";
import { runInit } from "@/cli/init";

let tmpDir: string;

function createFile(relativePath: string, content: string): void {
  const fullPath = path.join(tmpDir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

function setupNextProject(): void {
  fs.mkdirSync(path.join(tmpDir, "src"));
  createFile("package.json", JSON.stringify({ scripts: {} }, null, 2));
  createFile(
    "next.config.ts",
    "const nextConfig = {};\nexport default nextConfig;"
  );
  createFile(
    "tailwind.config.ts",
    'export default { content: [\n  "./src/**/*.tsx"\n] };'
  );
}

describe("end-to-end blog workflow", () => {
  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "nerds-e2e-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("should scaffold and load posts successfully", () => {
    setupNextProject();

    const initResult = runInit({ projectRoot: tmpDir });
    expect(initResult.filesCreated.length).toBeGreaterThan(0);

    const contentDir = path.join(tmpDir, "content/blog");
    expect(fs.existsSync(contentDir)).toBe(true);

    const mdxFiles = fs
      .readdirSync(contentDir)
      .filter((f) => f.endsWith(".mdx"));
    expect(mdxFiles.length).toBeGreaterThanOrEqual(2);

    const blog = createBlog({
      siteUrl: "https://example.com",
      blog: { contentDir },
    });

    const posts = blog.getAllPosts();
    expect(posts.length).toBe(2);
    expect(posts[0].title).toBeTruthy();
    expect(posts[0].slug).toBeTruthy();
    expect(posts[0].excerpt).toBeTruthy();
    expect(posts[0].readingTime).toBeTruthy();
  });

  it("should load post by slug after scaffold", () => {
    setupNextProject();
    runInit({ projectRoot: tmpDir });

    const contentDir = path.join(tmpDir, "content/blog");
    const blog = createBlog({
      siteUrl: "https://example.com",
      blog: { contentDir },
    });

    const post = blog.getPostBySlug("welcome-to-strategic-nerds");
    expect(post).not.toBeNull();
    expect(post!.title).toBe("Welcome to Strategic Nerds");
    expect(post!.content).toBeTruthy();
    expect(post!.content.length).toBeGreaterThan(50);
  });

  it("should return tags from scaffolded posts", () => {
    setupNextProject();
    runInit({ projectRoot: tmpDir });

    const contentDir = path.join(tmpDir, "content/blog");
    const blog = createBlog({
      siteUrl: "https://example.com",
      blog: { contentDir },
    });

    const tags = blog.getAllTags();
    expect(tags).toContain("getting-started");
    expect(tags).toContain("fiction");
  });

  it("should generate manifest with correct post count", () => {
    setupNextProject();
    runInit({ projectRoot: tmpDir });

    const manifestPath = path.join(tmpDir, "content/blog-manifest.json");
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    expect(manifest.postCount).toBe(2);
    expect(manifest.posts.length).toBe(2);
  });

  it("should find related posts across scaffolded content", () => {
    setupNextProject();
    runInit({ projectRoot: tmpDir });

    const contentDir = path.join(tmpDir, "content/blog");
    const blog = createBlog({
      siteUrl: "https://example.com",
      blog: { contentDir },
    });

    const related = blog.getRelatedPosts("welcome-to-strategic-nerds", 3);
    expect(related.length).toBeGreaterThanOrEqual(1);
    expect(related[0].slug).toBe("the-midnight-coders-children");
  });

  it("should work with absolute content directory path", () => {
    setupNextProject();
    runInit({ projectRoot: tmpDir });

    const contentDir = path.join(tmpDir, "content/blog");
    const blog = createBlog({
      siteUrl: "https://example.com",
      blog: { contentDir },
    });

    const posts = blog.getAllPosts();
    expect(posts.length).toBe(2);
  });

  it("should work with custom content directory", () => {
    setupNextProject();
    runInit({ projectRoot: tmpDir, contentDir: "posts" });

    const contentDir = path.join(tmpDir, "posts");
    expect(fs.existsSync(contentDir)).toBe(true);

    const blog = createBlog({
      siteUrl: "https://example.com",
      blog: { contentDir },
    });

    const posts = blog.getAllPosts();
    expect(posts.length).toBe(2);
  });
});
