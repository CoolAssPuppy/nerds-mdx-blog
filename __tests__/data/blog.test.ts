import { describe, it, expect, beforeEach, vi } from "vitest";
import path from "path";
import { createBlog } from "@/config";
import type { BlogConfig } from "@/types";

const FIXTURES_DIR = path.resolve(__dirname, "../fixtures");

const makeConfig = (overrides?: Partial<BlogConfig>): BlogConfig => ({
  siteUrl: "https://example.com",
  blog: { contentDir: FIXTURES_DIR },
  ...overrides,
});

describe("createBlog", () => {
  describe("getAllPosts", () => {
    it("should return published posts sorted by date descending", () => {
      const blog = createBlog(makeConfig());
      const posts = blog.getAllPosts();

      expect(posts.length).toBeGreaterThanOrEqual(1);

      for (let i = 1; i < posts.length; i++) {
        const prev = new Date(posts[i - 1].publishedAt).getTime();
        const curr = new Date(posts[i].publishedAt).getTime();
        expect(prev).toBeGreaterThanOrEqual(curr);
      }
    });

    it("should exclude posts with future publishedAt in production", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";

      const blog = createBlog(makeConfig());
      const posts = blog.getAllPosts();
      const futureSlugs = posts.map((p) => p.slug);

      expect(futureSlugs).not.toContain("post-from-the-future");

      process.env.NODE_ENV = originalEnv;
    });

    it("should include posts with future publishedAt in development", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      const blog = createBlog(makeConfig());
      const posts = blog.getAllPosts();
      const slugs = posts.map((p) => p.slug);

      expect(slugs).toContain("post-future-date");

      process.env.NODE_ENV = originalEnv;
    });

    it("should return metadata without content field", () => {
      const blog = createBlog(makeConfig());
      const posts = blog.getAllPosts();
      const firstPost = posts[0];

      expect(firstPost).toHaveProperty("slug");
      expect(firstPost).toHaveProperty("title");
      expect(firstPost).toHaveProperty("excerpt");
      expect(firstPost).toHaveProperty("publishedAt");
      expect(firstPost).toHaveProperty("readingTime");
      expect(firstPost).not.toHaveProperty("content");
    });

    it("should extract slug from filename by removing date prefix", () => {
      const blog = createBlog(makeConfig());
      const posts = blog.getAllPosts();
      const slugs = posts.map((p) => p.slug);

      expect(slugs).not.toEqual(
        expect.arrayContaining([expect.stringMatching(/^\d{8}-/)])
      );
    });

    it("should include reading time for each post", () => {
      const blog = createBlog(makeConfig());
      const posts = blog.getAllPosts();

      for (const post of posts) {
        expect(Number(post.readingTime)).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe("getPostBySlug", () => {
    it("should return a post with content for a valid slug", () => {
      const blog = createBlog(makeConfig());
      const post = blog.getPostBySlug("sample-post");

      expect(post).not.toBeNull();
      expect(post!.slug).toBe("sample-post");
      expect(post!.title).toBe("Getting started with your blog");
      expect(post!.content).toBeTruthy();
      expect(post!.content.length).toBeGreaterThan(0);
    });

    it("should return null for a non-existent slug", () => {
      const blog = createBlog(makeConfig());
      const post = blog.getPostBySlug("does-not-exist");

      expect(post).toBeNull();
    });

    it("should parse frontmatter correctly", () => {
      const blog = createBlog(makeConfig());
      const post = blog.getPostBySlug("sample-post");

      expect(post!.featured).toBe(true);
      expect(post!.tags).toContain("getting-started");
      expect(post!.tags).toContain("tutorial");
      expect(post!.featureImage).toBe("/images/blog/getting-started.jpg");
    });

    it("should parse FAQ frontmatter", () => {
      const blog = createBlog(makeConfig());
      const post = blog.getPostBySlug("post-with-faqs");

      expect(post!.faqs).toHaveLength(2);
      expect(post!.faqs![0].question).toBe("What is MDX?");
      expect(post!.articleType).toBe("tech");
    });
  });

  describe("getRelatedPosts", () => {
    it("should return posts with shared tags scored higher", () => {
      const blog = createBlog(makeConfig());
      const related = blog.getRelatedPosts("sample-post", 3);

      expect(related.length).toBeGreaterThanOrEqual(1);
      expect(related.every((p) => p.slug !== "sample-post")).toBe(true);
    });

    it("should not include the current post", () => {
      const blog = createBlog(makeConfig());
      const related = blog.getRelatedPosts("sample-post", 10);

      expect(related.map((p) => p.slug)).not.toContain("sample-post");
    });

    it("should fall back to recent posts for unknown slug", () => {
      const blog = createBlog(makeConfig());
      const related = blog.getRelatedPosts("nonexistent", 3);

      expect(related.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("getAllTags", () => {
    it("should return unique tags sorted alphabetically", () => {
      const blog = createBlog(makeConfig());
      const tags = blog.getAllTags();

      expect(tags.length).toBeGreaterThanOrEqual(1);
      for (let i = 1; i < tags.length; i++) {
        expect(tags[i].localeCompare(tags[i - 1])).toBeGreaterThanOrEqual(0);
      }
    });

    it("should not contain duplicates", () => {
      const blog = createBlog(makeConfig());
      const tags = blog.getAllTags();
      const unique = new Set(tags);

      expect(tags.length).toBe(unique.size);
    });
  });

  describe("getPostsByTag", () => {
    it("should return posts matching a tag", () => {
      const blog = createBlog(makeConfig());
      const posts = blog.getPostsByTag("tutorial");

      expect(posts.length).toBeGreaterThanOrEqual(1);
      for (const post of posts) {
        expect(post.tags?.map((t) => t.toLowerCase())).toContain("tutorial");
      }
    });

    it("should be case-insensitive", () => {
      const blog = createBlog(makeConfig());
      const lower = blog.getPostsByTag("tutorial");
      const upper = blog.getPostsByTag("Tutorial");

      expect(lower.length).toBe(upper.length);
    });

    it("should return empty array for non-existent tag", () => {
      const blog = createBlog(makeConfig());
      const posts = blog.getPostsByTag("nonexistent-tag-xyz");

      expect(posts).toEqual([]);
    });
  });

  describe("getTagCounts", () => {
    it("should return a record of tag counts", () => {
      const blog = createBlog(makeConfig());
      const counts = blog.getTagCounts();

      expect(typeof counts).toBe("object");
      expect(counts["tutorial"]).toBeGreaterThanOrEqual(1);
    });
  });

  describe("getFeaturedPosts", () => {
    it("should return only posts marked as featured", () => {
      const blog = createBlog(makeConfig());
      const featured = blog.getFeaturedPosts();

      for (const post of featured) {
        expect(post.featured).toBe(true);
      }
    });
  });

  describe("getAllPostsWithContent", () => {
    it("should return posts with content field", () => {
      const blog = createBlog(makeConfig());
      const posts = blog.getAllPostsWithContent();

      expect(posts.length).toBeGreaterThanOrEqual(1);
      for (const post of posts) {
        expect(post.content).toBeTruthy();
      }
    });
  });
});
