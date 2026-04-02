import { describe, it, expect } from "vitest";
import { blogPageTemplate } from "@/cli/templates/blog-page";
import { blogConfigTemplate } from "@/cli/templates/blog-config";
import { blogLibTemplate } from "@/cli/templates/blog-lib";
import { blogSlugPageTemplate } from "@/cli/templates/blog-slug-page";
import { blogTagPageTemplate } from "@/cli/templates/blog-tag-page";
import { rssRouteTemplate } from "@/cli/templates/rss-route";
import { blogApiRouteTemplate } from "@/cli/templates/blog-api-route";
import { markdownRouteTemplate } from "@/cli/templates/markdown-route";
import { samplePost1, samplePost2 } from "@/cli/templates/sample-posts";

const SCOPED_PACKAGE = "@strategicnerds/nerds-mdx-blog";

const stringTemplates = {
  blogPageTemplate,
  blogConfigTemplate,
  blogLibTemplate,
  blogSlugPageTemplate,
  blogTagPageTemplate,
  rssRouteTemplate,
  markdownRouteTemplate,
} as const;

const samplePosts = { samplePost1, samplePost2 } as const;

describe("CLI templates", () => {
  describe("all templates are non-empty strings", () => {
    Object.entries(stringTemplates).forEach(([name, template]) => {
      it(`${name} is a non-empty string`, () => {
        expect(typeof template).toBe("string");
        expect(template.length).toBeGreaterThan(0);
      });
    });

    Object.entries(samplePosts).forEach(([name, template]) => {
      it(`${name} is a non-empty string`, () => {
        expect(typeof template).toBe("string");
        expect(template.length).toBeGreaterThan(0);
      });
    });

    it("blogApiRouteTemplate is a function that returns a non-empty string", () => {
      expect(typeof blogApiRouteTemplate).toBe("function");
      const result = blogApiRouteTemplate(
        "https://example.com",
        "/blog"
      );
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("templates reference the correct scoped package name", () => {
    const templatesWithPackageImports = {
      blogPageTemplate,
      blogConfigTemplate,
      blogLibTemplate,
      blogSlugPageTemplate,
      blogTagPageTemplate,
      rssRouteTemplate,
      markdownRouteTemplate,
    };

    Object.entries(templatesWithPackageImports).forEach(
      ([name, template]) => {
        it(`${name} uses scoped package ${SCOPED_PACKAGE}`, () => {
          if (template.includes("nerds-mdx-blog")) {
            expect(template).toContain(SCOPED_PACKAGE);
            expect(template).not.toMatch(
              /from\s+["']nerds-mdx-blog(?!\/)/
            );
          }
        });
      }
    );

    it("no template uses the unscoped package name (regression)", () => {
      const allTemplates = [
        blogPageTemplate,
        blogConfigTemplate,
        blogLibTemplate,
        blogSlugPageTemplate,
        blogTagPageTemplate,
        rssRouteTemplate,
        markdownRouteTemplate,
        blogApiRouteTemplate("https://example.com", "/blog"),
      ];

      allTemplates.forEach((template) => {
        const unscopedImport = template.match(
          /from\s+["']nerds-mdx-blog/
        );
        expect(unscopedImport).toBeNull();
      });
    });
  });

  describe("templates contain expected imports", () => {
    it("blog-page imports BlogGrid and generateCollectionJsonLd", () => {
      expect(blogPageTemplate).toContain(
        `from "${SCOPED_PACKAGE}/components"`
      );
      expect(blogPageTemplate).toContain("BlogGrid");
      expect(blogPageTemplate).toContain("generateCollectionJsonLd");
      expect(blogPageTemplate).toContain("revalidate");
    });

    it("blog-config imports defineConfig", () => {
      expect(blogConfigTemplate).toContain("defineConfig");
      expect(blogConfigTemplate).toContain(
        `from "${SCOPED_PACKAGE}"`
      );
    });

    it("blog-lib imports createBlog", () => {
      expect(blogLibTemplate).toContain("createBlog");
      expect(blogLibTemplate).toContain(
        `from "${SCOPED_PACKAGE}"`
      );
    });

    it("blog-slug-page imports MDX utilities and components", () => {
      expect(blogSlugPageTemplate).toContain("getMdxComponents");
      expect(blogSlugPageTemplate).toContain("generateArticleJsonLd");
      expect(blogSlugPageTemplate).toContain("generateBreadcrumbJsonLd");
      expect(blogSlugPageTemplate).toContain("MDXRemote");
      expect(blogSlugPageTemplate).toContain("BlogContent");
      expect(blogSlugPageTemplate).toContain("TableOfContents");
      expect(blogSlugPageTemplate).toContain("RelatedPosts");
      expect(blogSlugPageTemplate).toContain("featureImage");
      expect(blogSlugPageTemplate).toContain("Image");
      expect(blogSlugPageTemplate).toContain(
        `from "${SCOPED_PACKAGE}/components"`
      );
    });

    it("blog-tag-page imports BlogCard and TagNavigation", () => {
      expect(blogTagPageTemplate).toContain("BlogCard");
      expect(blogTagPageTemplate).toContain("TagNavigation");
      expect(blogTagPageTemplate).toContain("formatTagName");
    });

    it("rss-route imports generateRssFeed", () => {
      expect(rssRouteTemplate).toContain("generateRssFeed");
      expect(rssRouteTemplate).toContain(
        `from "${SCOPED_PACKAGE}"`
      );
    });

    it("markdown-route imports stripCodeBlocksAndComponents and sets content type", () => {
      expect(markdownRouteTemplate).toContain(
        "stripCodeBlocksAndComponents"
      );
      expect(markdownRouteTemplate).toContain(
        `from "${SCOPED_PACKAGE}"`
      );
      expect(markdownRouteTemplate).toContain("text/markdown");
    });
  });

  describe("sample posts have valid frontmatter", () => {
    const requiredFields = ["title", "publishedAt", "excerpt"];

    [
      { name: "samplePost1", content: samplePost1 },
      { name: "samplePost2", content: samplePost2 },
    ].forEach(({ name, content }) => {
      it(`${name} starts and ends frontmatter with ---`, () => {
        const lines = content.trim().split("\n");
        expect(lines[0]).toBe("---");
        const closingIndex = lines.indexOf("---", 1);
        expect(closingIndex).toBeGreaterThan(0);
      });

      requiredFields.forEach((field) => {
        it(`${name} contains ${field} in frontmatter`, () => {
          const frontmatterMatch = content.match(
            /^---\n([\s\S]*?)\n---/
          );
          expect(frontmatterMatch).not.toBeNull();
          const frontmatter = frontmatterMatch![1];
          expect(frontmatter).toContain(`${field}:`);
        });
      });

      it(`${name} has a non-empty title`, () => {
        const titleMatch = content.match(/title:\s*"(.+?)"/);
        expect(titleMatch).not.toBeNull();
        expect(titleMatch![1].length).toBeGreaterThan(0);
      });

      it(`${name} has a valid publishedAt date`, () => {
        const dateMatch = content.match(
          /publishedAt:\s*"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)"/
        );
        expect(dateMatch).not.toBeNull();
        const date = new Date(dateMatch![1]);
        expect(date.toString()).not.toBe("Invalid Date");
      });

      it(`${name} has real content after frontmatter`, () => {
        const parts = content.split("---");
        const body = parts.slice(2).join("---").trim();
        expect(body.length).toBeGreaterThan(50);
      });

      it(`${name} has a non-empty excerpt value`, () => {
        const excerptMatch = content.match(/excerpt:\s*"(.+?)"/);
        expect(excerptMatch).not.toBeNull();
        expect(excerptMatch![1].length).toBeGreaterThan(10);
      });
    });
  });

  describe("blog-api-route template function", () => {
    it("returns content containing the provided siteUrl", () => {
      const result = blogApiRouteTemplate(
        "https://mysite.com",
        "/blog"
      );
      expect(result).toContain("https://mysite.com");
    });

    it("returns content containing the provided basePath", () => {
      const result = blogApiRouteTemplate(
        "https://mysite.com",
        "/posts"
      );
      expect(result).toContain("/posts");
    });

    it("imports from @/lib/blog", () => {
      const result = blogApiRouteTemplate(
        "https://example.com",
        "/blog"
      );
      expect(result).toContain('from "@/lib/blog"');
    });

    it("exports a GET handler", () => {
      const result = blogApiRouteTemplate(
        "https://example.com",
        "/blog"
      );
      expect(result).toContain("export async function GET");
    });

    it("returns NextResponse.json with posts data", () => {
      const result = blogApiRouteTemplate(
        "https://example.com",
        "/blog"
      );
      expect(result).toContain("NextResponse.json");
      expect(result).toContain("posts");
    });

    it("embeds different siteUrls correctly", () => {
      const result1 = blogApiRouteTemplate(
        "https://alpha.com",
        "/blog"
      );
      const result2 = blogApiRouteTemplate(
        "https://beta.com",
        "/blog"
      );
      expect(result1).toContain("https://alpha.com");
      expect(result1).not.toContain("https://beta.com");
      expect(result2).toContain("https://beta.com");
      expect(result2).not.toContain("https://alpha.com");
    });
  });
});
