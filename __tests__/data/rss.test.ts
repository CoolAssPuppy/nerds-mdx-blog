import { describe, it, expect } from "vitest";
import { generateRssFeed, escapeXml } from "@/data/rss";
import type { ResolvedBlogConfig, BlogPost } from "@/types";
import { resolveConfig } from "@/config";

const config = resolveConfig({
  siteUrl: "https://example.com",
  blog: { title: "Test Blog", description: "A test blog", basePath: "/blog" },
  author: { name: "Jane", email: "jane@example.com" },
});

const makePost = (overrides: Partial<BlogPost> = {}): BlogPost => ({
  slug: "test-post",
  title: "Test Post",
  excerpt: "This is a test post.",
  publishedAt: "2026-01-15T08:00:00.000Z",
  content: "Some **markdown** content with a [link](https://example.com).",
  readingTime: "3",
  tags: ["test"],
  ...overrides,
});

describe("escapeXml", () => {
  it("should escape ampersands", () => {
    expect(escapeXml("A & B")).toBe("A &amp; B");
  });

  it("should escape angle brackets", () => {
    expect(escapeXml("<script>")).toBe("&lt;script&gt;");
  });

  it("should escape quotes", () => {
    expect(escapeXml('"hello"')).toBe("&quot;hello&quot;");
  });
});

describe("generateRssFeed", () => {
  it("should produce valid RSS 2.0 XML", () => {
    const feed = generateRssFeed([makePost()], config);

    expect(feed).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(feed).toContain('<rss version="2.0"');
    expect(feed).toContain("<channel>");
    expect(feed).toContain("</channel>");
    expect(feed).toContain("</rss>");
  });

  it("should include feed metadata from config", () => {
    const feed = generateRssFeed([makePost()], config);

    expect(feed).toContain("<title>Test Blog</title>");
    expect(feed).toContain("<link>https://example.com/blog</link>");
    expect(feed).toContain("A test blog");
  });

  it("should include post items", () => {
    const feed = generateRssFeed([makePost({ title: "My Great Post" })], config);

    expect(feed).toContain("<item>");
    expect(feed).toContain("<title>My Great Post</title>");
    expect(feed).toContain("https://example.com/blog/test-post");
  });

  it("should include content:encoded with HTML", () => {
    const feed = generateRssFeed([makePost()], config);

    expect(feed).toContain("<content:encoded>");
    expect(feed).toContain("CDATA");
  });

  it("should handle empty post list", () => {
    const feed = generateRssFeed([], config);

    expect(feed).toContain("<channel>");
    expect(feed).not.toContain("<item>");
  });

  it("should escape special characters in titles", () => {
    const feed = generateRssFeed(
      [makePost({ title: 'Post with "quotes" & <tags>' })],
      config
    );

    expect(feed).toContain("&amp;");
    expect(feed).toContain("&lt;tags&gt;");
  });
});
