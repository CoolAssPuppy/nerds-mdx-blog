import { describe, it, expect } from "vitest";
import {
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
  generateFAQJsonLd,
  generateHowToJsonLd,
  generateCollectionJsonLd,
} from "@/data/json-ld";
import { resolveConfig } from "@/config";
import type { BlogPost, BlogPostMeta } from "@/types";

const config = resolveConfig({
  siteUrl: "https://example.com",
  blog: { basePath: "/blog" },
  author: { name: "Jane", url: "https://example.com/about" },
  publisher: { name: "Acme Corp", logo: "/images/logo.png" },
});

const makePost = (overrides: Partial<BlogPost> = {}): BlogPost => ({
  slug: "test-post",
  title: "Test Post",
  excerpt: "A test excerpt.",
  publishedAt: "2026-01-15T08:00:00.000Z",
  content: "Content here.",
  readingTime: "3",
  ...overrides,
});

const makeMeta = (overrides: Partial<BlogPostMeta> = {}): BlogPostMeta => ({
  slug: "test-post",
  title: "Test Post",
  excerpt: "A test excerpt.",
  publishedAt: "2026-01-15T08:00:00.000Z",
  readingTime: "3",
  ...overrides,
});

describe("generateArticleJsonLd", () => {
  it("should generate Article schema", () => {
    const result = generateArticleJsonLd(makePost(), config);
    expect(result["@type"]).toBe("Article");
    expect(result.headline).toBe("Test Post");
    expect(result.author.name).toBe("Jane");
  });

  it("should generate TechArticle for tech posts", () => {
    const result = generateArticleJsonLd(
      makePost({ articleType: "tech" }),
      config
    );
    expect(result["@type"]).toBe("TechArticle");
  });

  it("should detect tech articles from title keywords", () => {
    const result = generateArticleJsonLd(
      makePost({ title: "How to build a blog" }),
      config
    );
    expect(result["@type"]).toBe("TechArticle");
  });

  it("should include publisher info", () => {
    const result = generateArticleJsonLd(makePost(), config);
    expect(result.publisher.name).toBe("Acme Corp");
  });

  it("should use updatedAt for dateModified when present", () => {
    const result = generateArticleJsonLd(
      makePost({ updatedAt: "2026-06-01T00:00:00.000Z" }),
      config
    );
    expect(result.dateModified).toBe("2026-06-01T00:00:00.000Z");
  });
});

describe("generateBreadcrumbJsonLd", () => {
  it("should generate 3-level breadcrumb", () => {
    const result = generateBreadcrumbJsonLd(makePost(), config);
    expect(result["@type"]).toBe("BreadcrumbList");
    expect(result.itemListElement).toHaveLength(3);
    expect(result.itemListElement[0].name).toBe("Home");
    expect(result.itemListElement[1].name).toBe("Blog");
    expect(result.itemListElement[2].name).toBe("Test Post");
  });
});

describe("generateFAQJsonLd", () => {
  it("should generate FAQPage schema from FAQ items", () => {
    const faqs = [
      { question: "What is MDX?", answer: "MDX is markdown with JSX." },
      { question: "Is it free?", answer: "Yes." },
    ];
    const result = generateFAQJsonLd(faqs);
    expect(result["@type"]).toBe("FAQPage");
    expect(result.mainEntity).toHaveLength(2);
    expect(result.mainEntity[0]["@type"]).toBe("Question");
  });
});

describe("generateHowToJsonLd", () => {
  it("should generate HowTo schema with steps", () => {
    const steps = [
      { name: "Step 1", text: "Do this first" },
      { name: "Step 2", text: "Then do this" },
    ];
    const result = generateHowToJsonLd(makePost(), steps, config);
    expect(result["@type"]).toBe("HowTo");
    expect(result.step).toHaveLength(2);
    expect(result.step[0].position).toBe(1);
  });
});

describe("generateCollectionJsonLd", () => {
  it("should generate CollectionPage with ItemList", () => {
    const posts = [makeMeta({ slug: "a" }), makeMeta({ slug: "b" })];
    const result = generateCollectionJsonLd(posts, config);
    expect(result["@type"]).toBe("CollectionPage");
    expect(result.mainEntity.itemListElement).toHaveLength(2);
  });
});
