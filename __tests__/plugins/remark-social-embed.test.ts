import { describe, it, expect } from "vitest";
import { remarkSocialEmbed, matchSocialUrl } from "@/plugins/remark-social-embed";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import remarkStringify from "remark-stringify";

describe("matchSocialUrl", () => {
  it("should match twitter.com status URLs", () => {
    const result = matchSocialUrl("https://twitter.com/user/status/123456");
    expect(result).toEqual({ component: "TweetEmbed", id: "123456" });
  });

  it("should match x.com status URLs", () => {
    const result = matchSocialUrl("https://x.com/user/status/789012");
    expect(result).toEqual({ component: "TweetEmbed", id: "789012" });
  });

  it("should match youtube.com/watch URLs", () => {
    const result = matchSocialUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(result).toEqual({ component: "YouTubeEmbed", id: "dQw4w9WgXcQ" });
  });

  it("should match youtu.be short URLs", () => {
    const result = matchSocialUrl("https://youtu.be/dQw4w9WgXcQ");
    expect(result).toEqual({ component: "YouTubeEmbed", id: "dQw4w9WgXcQ" });
  });

  it("should match youtube.com/embed URLs", () => {
    const result = matchSocialUrl("https://www.youtube.com/embed/dQw4w9WgXcQ");
    expect(result).toEqual({ component: "YouTubeEmbed", id: "dQw4w9WgXcQ" });
  });

  it("should match instagram.com/p/ URLs", () => {
    const result = matchSocialUrl("https://www.instagram.com/p/ABC123/");
    expect(result).toEqual({ component: "InstagramEmbed", id: "ABC123" });
  });

  it("should match instagram.com/reel/ URLs", () => {
    const result = matchSocialUrl("https://www.instagram.com/reel/XYZ789/");
    expect(result).toEqual({ component: "InstagramEmbed", id: "XYZ789" });
  });

  it("should return null for non-social URLs", () => {
    expect(matchSocialUrl("https://example.com")).toBeNull();
    expect(matchSocialUrl("https://github.com/repo")).toBeNull();
  });
});

describe("remarkSocialEmbed plugin", () => {
  const process = async (markdown: string): Promise<string> => {
    const result = await unified()
      .use(remarkParse)
      .use(remarkMdx)
      .use(remarkSocialEmbed)
      .use(remarkStringify)
      .process(markdown);
    return String(result);
  };

  it("should transform a standalone YouTube link into a component", async () => {
    const input = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const output = await process(input);
    expect(output).toContain("YouTubeEmbed");
    expect(output).toContain("dQw4w9WgXcQ");
  });

  it("should transform a standalone Twitter link into a component", async () => {
    const input = "https://twitter.com/user/status/123456";
    const output = await process(input);
    expect(output).toContain("TweetEmbed");
    expect(output).toContain("123456");
  });

  it("should not transform links with custom text", async () => {
    const input = "[Check this video](https://www.youtube.com/watch?v=dQw4w9WgXcQ)";
    const output = await process(input);
    expect(output).not.toContain("YouTubeEmbed");
    expect(output).toContain("Check this video");
  });

  it("should not transform URLs in paragraphs with other text", async () => {
    const input = "Check out https://www.youtube.com/watch?v=dQw4w9WgXcQ for more";
    const output = await process(input);
    expect(output).not.toContain("YouTubeEmbed");
  });

  it("should leave non-social URLs unchanged", async () => {
    const input = "https://example.com/page";
    const output = await process(input);
    expect(output).toContain("example.com");
  });
});
