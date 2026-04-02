import { describe, it, expect } from "vitest";
import {
  stripCodeBlocksAndComponents,
  calculateReadingTime,
} from "@/data/reading-time";

describe("stripCodeBlocksAndComponents", () => {
  it("should strip fenced code blocks", () => {
    const input = "Before\n```typescript\nconst x = 1;\n```\nAfter";
    const result = stripCodeBlocksAndComponents(input);

    expect(result).toContain("Before");
    expect(result).toContain("After");
    expect(result).not.toContain("const x = 1");
  });

  it("should strip inline code", () => {
    const input = "Use `console.log` for debugging";
    const result = stripCodeBlocksAndComponents(input);

    expect(result).toContain("Use");
    expect(result).toContain("for debugging");
    expect(result).not.toContain("console.log");
  });

  it("should strip self-closing JSX components", () => {
    const input = "Before <MyComponent prop='value' /> After";
    const result = stripCodeBlocksAndComponents(input);

    expect(result).toContain("Before");
    expect(result).toContain("After");
    expect(result).not.toContain("MyComponent");
  });

  it("should strip JSX components with children", () => {
    const input = "Before <Callout>Some warning text</Callout> After";
    const result = stripCodeBlocksAndComponents(input);

    expect(result).toContain("Before");
    expect(result).toContain("After");
    expect(result).not.toContain("Callout");
    expect(result).not.toContain("Some warning text");
  });

  it("should strip HTML comments", () => {
    const input = "Before <!-- hidden comment --> After";
    const result = stripCodeBlocksAndComponents(input);

    expect(result).toContain("Before");
    expect(result).toContain("After");
    expect(result).not.toContain("hidden comment");
  });

  it("should handle content with no strippable elements", () => {
    const input = "Just plain text with nothing special.";
    const result = stripCodeBlocksAndComponents(input);

    expect(result).toBe(input);
  });

  it("should handle multiple code blocks", () => {
    const input = [
      "Intro text",
      "```js",
      "const a = 1;",
      "```",
      "Middle text",
      "```python",
      "x = 2",
      "```",
      "End text",
    ].join("\n");
    const result = stripCodeBlocksAndComponents(input);

    expect(result).toContain("Intro text");
    expect(result).toContain("Middle text");
    expect(result).toContain("End text");
    expect(result).not.toContain("const a = 1");
    expect(result).not.toContain("x = 2");
  });
});

describe("calculateReadingTime", () => {
  it("should return minimum 1 minute for short content", () => {
    const result = calculateReadingTime("Hello world.");

    expect(result).toBe("1");
  });

  it("should calculate reading time for longer content", () => {
    const words = Array(500).fill("word").join(" ");
    const result = calculateReadingTime(words);

    expect(Number(result)).toBeGreaterThanOrEqual(2);
  });

  it("should exclude code blocks from reading time", () => {
    const longCode = Array(1000).fill("code").join(" ");
    const content = `Short intro.\n\n\`\`\`typescript\n${longCode}\n\`\`\`\n\nShort outro.`;

    const result = calculateReadingTime(content);

    expect(result).toBe("1");
  });

  it("should return a string", () => {
    const result = calculateReadingTime("Some content here.");

    expect(typeof result).toBe("string");
  });
});
