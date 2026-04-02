import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { extractHeadings } from "@/components/TableOfContents";

describe("extractHeadings", () => {
  it("should extract H1, H2, and H3 headings", () => {
    const content = "# Heading 1\n\nSome text\n\n## Heading 2\n\nMore text\n\n### Heading 3";
    const headings = extractHeadings(content);

    expect(headings).toHaveLength(3);
    expect(headings[0]).toEqual({
      id: "heading-1",
      text: "Heading 1",
      level: 1,
    });
    expect(headings[1]).toEqual({
      id: "heading-2",
      text: "Heading 2",
      level: 2,
    });
    expect(headings[2]).toEqual({
      id: "heading-3",
      text: "Heading 3",
      level: 3,
    });
  });

  it("should ignore headings inside code blocks", () => {
    const content = "## Real heading\n\n```\n# Not a heading\n## Also not\n```\n\n## Another real one";
    const headings = extractHeadings(content);

    expect(headings).toHaveLength(2);
    expect(headings[0].text).toBe("Real heading");
    expect(headings[1].text).toBe("Another real one");
  });

  it("should generate slugified IDs", () => {
    const content = "## Hello World!\n\n## Special Characters: @#$";
    const headings = extractHeadings(content);

    expect(headings[0].id).toBe("hello-world");
    expect(headings[1].id).toBe("special-characters-");
  });

  it("should return empty array for content with no headings", () => {
    const headings = extractHeadings("Just some text without any headings.");
    expect(headings).toEqual([]);
  });
});
