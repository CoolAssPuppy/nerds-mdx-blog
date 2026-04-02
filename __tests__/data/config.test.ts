import { describe, it, expect } from "vitest";
import { defineConfig, resolveConfig } from "@/config";

describe("defineConfig", () => {
  it("should return the config object unchanged", () => {
    const config = { siteUrl: "https://example.com" };
    const result = defineConfig(config);

    expect(result).toEqual(config);
  });
});

describe("resolveConfig", () => {
  it("should apply all defaults when given minimal config", () => {
    const config = defineConfig({ siteUrl: "https://example.com" });
    const resolved = resolveConfig(config);

    expect(resolved.siteUrl).toBe("https://example.com");
    expect(resolved.blog.title).toBe("Blog");
    expect(resolved.blog.description).toBe("A blog powered by nerds-mdx-blog");
    expect(resolved.blog.basePath).toBe("/blog");
    expect(resolved.blog.contentDir).toBe("content/blog");
    expect(resolved.blog.postsPerPage).toBe(12);
    expect(resolved.blog.revalidate).toBe(86400);
  });

  it("should apply author defaults", () => {
    const resolved = resolveConfig({ siteUrl: "https://example.com" });

    expect(resolved.author.name).toBe("");
    expect(resolved.author.url).toBe("");
    expect(resolved.author.email).toBe("");
    expect(resolved.author.twitter).toBe("");
    expect(resolved.author.social).toEqual([]);
  });

  it("should apply publisher defaults from author name", () => {
    const resolved = resolveConfig({
      siteUrl: "https://example.com",
      author: { name: "Jane Smith" },
    });

    expect(resolved.publisher.name).toBe("Jane Smith");
    expect(resolved.publisher.logo).toBe("");
  });

  it("should apply feature defaults", () => {
    const resolved = resolveConfig({ siteUrl: "https://example.com" });

    expect(resolved.features.rss).toBe(true);
    expect(resolved.features.jsonApi).toBe(true);
    expect(resolved.features.tableOfContents).toBe(true);
    expect(resolved.features.relatedPosts).toBe(true);
    expect(resolved.features.search).toBe(true);
    expect(resolved.features.socialEmbeds).toBe(true);
    expect(resolved.features.scheduledPublishing).toBe(true);
  });

  it("should apply default tag acronyms", () => {
    const resolved = resolveConfig({ siteUrl: "https://example.com" });

    expect(resolved.tagAcronyms).toContain("ai");
    expect(resolved.tagAcronyms).toContain("api");
    expect(resolved.tagAcronyms).toContain("seo");
  });

  it("should preserve user overrides", () => {
    const resolved = resolveConfig({
      siteUrl: "https://acme.com",
      blog: {
        title: "Acme Blog",
        basePath: "/articles",
        postsPerPage: 24,
      },
      author: {
        name: "John Doe",
        email: "john@acme.com",
      },
      features: {
        rss: false,
        search: false,
      },
      tagAcronyms: ["api", "sdk"],
    });

    expect(resolved.blog.title).toBe("Acme Blog");
    expect(resolved.blog.basePath).toBe("/articles");
    expect(resolved.blog.postsPerPage).toBe(24);
    expect(resolved.blog.description).toBe("A blog powered by nerds-mdx-blog");
    expect(resolved.author.name).toBe("John Doe");
    expect(resolved.author.email).toBe("john@acme.com");
    expect(resolved.author.url).toBe("");
    expect(resolved.features.rss).toBe(false);
    expect(resolved.features.search).toBe(false);
    expect(resolved.features.tableOfContents).toBe(true);
    expect(resolved.tagAcronyms).toEqual(["api", "sdk"]);
  });

  it("should use explicit publisher name over author name", () => {
    const resolved = resolveConfig({
      siteUrl: "https://example.com",
      author: { name: "Jane" },
      publisher: { name: "Acme Corp" },
    });

    expect(resolved.publisher.name).toBe("Acme Corp");
  });
});
